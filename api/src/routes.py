import os
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
#     time.sleep(4)


class DatasetsView(MethodView):
    @staticmethod
    def get():
        """

        :return: {
            dataset_id: Dataset(...)
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
            return jsonify({"errors": file_errors, "id": None})

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


@bp.route("/datasets/<string:dataset_id>/sequences")
def dataset_sequences_view(dataset_id):
    """

    :param dataset_id:
    :return: {
        "pagination": {
            page=0
            page_size=100
        },
        "dataset_id": id,
        "records": [
            Record(...)
        ]
    }
    """
    page = request.args.get("page", 0, int)
    page_size = request.args.get("page_size", 100, int)

    engine = data.engine.get_engine()
    response = engine.get_dataset_records(dataset_id, page, page_size)
    return jsonify(response)


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


@bp.route("/alphabet")
def alphabet():
    return jsonify(data.constants.ALPHABET)


@bp.route("/clear")
def clear():
    engine = data.engine.get_engine()
    datasets = engine.get_datasets()
    for d in datasets:
        dataset_id = d.get("_id", None)
        if dataset_id is not None:
            engine.delete_dataset(dataset_id)

    return jsonify(engine.get_datasets())


@bp.route("/create")
def upload():
    engine = data.engine.get_engine()

    engine.create_dataset(
        name="My Dataset",
        data_format="fasta",
        user_filename="test.fast",
        path="../demo/some.fasta",
    )

    datasets = engine.get_datasets()
    out = json_util.loads(json_util.dumps(datasets))
    return jsonify(out)
