import json
import os
import random
import time
import uuid
import tempfile

from bson import json_util
from datetime import datetime
from flask import Blueprint, jsonify, request
from flask.views import MethodView


import data


bp = Blueprint("datasets", __name__)


# @bp.before_request
# def sleep_more():
#     time.sleep(random.randint(1, 4))


class DatasetsView(MethodView):
    @staticmethod
    def get():
        """

        :return: {
            dataset_id: Dataset(...),
            qid
        }
        """
        engine = data.engine.get_engine()
        return jsonify(engine.get_datasets())

    @staticmethod
    def post():
        """
        input = {
            "file": FilePart(...),
            "name": "My Dataset Name",
        }

        :return: {
            "dataset": DatasetMeta(...)
        }
        """
        engine = data.engine.get_engine()
        input_file = request.files.get("file", None)

        file_errors = data.utils.validate_file(input_file)
        if file_errors:
            return jsonify({"errors": file_errors, "seq_id": None})

        tmp_path = os.path.join(tempfile.gettempdir(), uuid.uuid4().hex)
        try:
            input_file.save(tmp_path)

            upload_errors, dataset = engine.create_dataset(
                name=request.form["name"],
                # data_format=request.form["data_format"].lower(),
                data_format="fasta",
                user_filename=input_file.filename,
                path=tmp_path,
            )
            return jsonify({"errors": upload_errors, "dataset": dataset})
        finally:
            os.remove(tmp_path)


class DatasetView(MethodView):
    @staticmethod
    def delete(dataset_id):
        """

        :param dataset_id: reference to provide the upload manager
        :return: 204 -> No Content
        """
        engine = data.engine.get_engine()
        engine.delete_dataset(dataset_id)
        return "", 204


bp.add_url_rule(
    "/datasets",
    view_func=DatasetsView.as_view("datasets_view"),
    methods=["GET", "POST"],
)

bp.add_url_rule(
    "/datasets/<string:dataset_id>",
    view_func=DatasetView.as_view("dataset_view"),
    methods=["DELETE"],
)


@bp.route("/datasets/<string:dataset_id>/sequences", methods=["GET"])
def dataset_sequences_view(dataset_id):
    """

    :query_string_param page: page to return
    :query_string_param page_size: page size to calculate offset by
    :query_string_param qid: query seq_id
    :query_string_param filter: string that must be contained in the description
    :query_string_param excluded: projection keys to exclude from response
    :param dataset_id:
    :return: {
        "pagination": {
            page=0
            page_size=100
        },
        "dataset_id": seq_id,
        "records": [
            Record(...)
        ]
    }
    """
    page = request.args.get("page", 0, int)
    page_size = request.args.get("page_size", 100, int)

    query_id = request.args.get("qid", None, str)
    desc_filter = request.args.get("filter", None, str)
    excluded = request.args.get("excluded", None, str)

    if excluded is not None:
        excluded = excluded.split(",")

    engine = data.engine.get_engine()
    response = engine.get_dataset_records(
        dataset_id=dataset_id,
        page=page,
        page_size=page_size,
        query_id=query_id,
        desc_filter=desc_filter,
        excluded_fields=excluded,
    )
    return jsonify(response)


@bp.route("/queries", methods=["GET"])
def get_queries():
    engine = data.engine.get_engine()
    queries = engine.get_queries()
    return jsonify(queries)


@bp.route("/queries", methods=["POST"])
def create_query():
    body = request.get_json(force=True)

    raw_pattern = body.get("raw_pattern", None)
    if raw_pattern is None:
        return jsonify({"errors": ["missing_pattern"]})

    engine = data.engine.get_engine()
    query, errors = engine.get_query(raw_pattern)
    if query is None and len(errors) == 0:
        errors.append("creation_failure")
    return jsonify({"errors": errors, "query": query})


@bp.route("/queries/<string:query_id>/datasets/<string:dataset_id>", methods=["GET"])
def query_dataset(query_id, dataset_id):
    engine = data.engine.get_engine()
    match_analysis = engine.query_dataset(query_id, dataset_id)
    return jsonify({"match_analysis": match_analysis})


# @bp.route(
#     "/queries/<string:query_id>/datasets/<string:dataset_id>/sequences", methods=["GET"]
# )
# def query_dataset_sequences(query_id, dataset_id):
#     page = request.args.get("page", 0, int)
#     page_size = request.args.get("page_size", 100, int)
#
#     query_id = bson.objectid.ObjectId(query_id)
#     dataset_id = bson.objectid.ObjectId(dataset_id)
#
#     engine = data.engine.get_engine()
#     result = engine.query_dataset_sequences(
#         query_id=query_id, dataset_id=dataset_id, page=page, page_size=page_size
#     )
#     return jsonify(result)


@bp.route("/alphabet", methods=["GET"])
def alphabet():
    return jsonify(data.constants.ALPHABET)


@bp.route("/clear", methods=["GET"])
def clear():
    engine = data.engine.get_engine()
    cnames = engine.db.collection_names()
    for cname in cnames:
        engine.db.drop_collection(cname)

    return jsonify(engine.get_datasets())


@bp.route("/create", methods=["GET"])
def auto_upload():
    engine = data.engine.get_engine()

    engine.create_dataset(
        name="My Dataset",
        data_format="fasta",
        user_filename="test.fast",
        path="../demo/all.fasta",
    )

    datasets = engine.get_datasets()
    out = json_util.loads(json_util.dumps(datasets))
    return jsonify(out)
