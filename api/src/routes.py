import os
import uuid
import tempfile
from bson import json_util
from datetime import datetime
from flask import Blueprint, jsonify, request
from flask.views import MethodView


import data


bp = Blueprint("datasets", __name__)


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
            "data_format": (fasta,)
        }

        :return: {
            "dataset": DatasetMeta(...)
        }
        """
        input_file = request.files.get("file", None)

        file_errors = data.utils.validate_file(input_file)
        if file_errors:
            return jsonify({"errors": file_errors, "id": None})

        tmp_path = os.path.join(tempfile.gettempdir(), uuid.uuid4().hex)
        try:
            input_file.save(tmp_path)

            upload_errors, dataset_id = data.engine.create_dataset(
                name=request.form["name"],
                data_format=request.form["data_format"].lower(),
                user_filename=input_file.filename,
                path=tmp_path,
            )
            return jsonify({"errors": upload_errors, "id": dataset_id})
        finally:
            os.remove(tmp_path)


bp.add_url_rule(
    "/datasets",
    view_func=DatasetsView.as_view("datasets_view"),
    methods=["GET", "POST"],
)


@bp.route("/")
def test():
    engine = data.engine.get_engine()
    datasets = engine.get_datasets()
    for d in datasets:
        dataset_id = d.get("_id", None)
        if dataset_id is not None:
            engine.delete_dataset(dataset_id)

    engine.create_dataset(
        name="My Dataset",
        data_format="fasta",
        user_filename="test.fast",
        path="../demo/some.fasta",
    )

    datasets = engine.get_datasets()
    out = json_util.loads(json_util.dumps(datasets))
    return jsonify(out)
