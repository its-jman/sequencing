import os
import uuid

from marshmallow import ValidationError
from flask import Blueprint, jsonify, request
from flask.views import MethodView

import utils
import config

from models.record import RecordSchema
from models.dataset import DatasetSchema, RecordsMetaSchema

datasets_routes = Blueprint("datasets", __name__)


class DatasetsView(MethodView):
    @staticmethod
    def get():
        """

        :return: {
            dataset_id: Dataset(...)
        }
        """
        schema = DatasetSchema()
        try:
            # json_data = schema.dump(M.datasets.values())
            json_data = {}
            for dataset in M.datasets.values():
                json_data[dataset.id] = schema.dump(dataset)
        except ValidationError as e:
            return jsonify({"error": "Datasets could not be dumped properly. [%s]" % e})
        return jsonify(json_data)

    @staticmethod
    def post():
        """
        data = {
            "file": FilePart(...),
            "name": "My Dataset Name",
            "file_type": fasta | undefined
        }

        :return: {
            "dataset": DatasetMeta(...)
        }
        """
        # Ensure file exists
        input_file = request.files.get("file", None)
        if input_file is None or input_file.filename == "":
            return jsonify({"error": "No file part"})

        # Check filename/type to see if extension is valid
        if not utils.allowed_file(input_file.filename):
            return jsonify({"error": "Invalid file extension"})

        file_format = request.form["file_type"]
        tmp_path = os.path.join(config.TMP_FOLDER, uuid.uuid4().hex)
        try:
            input_file.save(tmp_path)
            records = utils.parse_fasta_stream(tmp_path)
            new_upload = M.create_new_dataset(
                name=request.form["name"],
                user_filename=input_file.filename,
                records=records,
            )
        except (ValueError, ValidationError) as e:
            print("File could not be parsed.")
            print(e)
            return jsonify({"error": "File could not be parsed: [%s]" % e})
        else:
            if new_upload is None:
                return jsonify({"error": "unknown"})

            # Create dataset to save it to file in a consistant manner
            schema = DatasetSchema()
            return jsonify({"dataset": schema.dump(new_upload)})
        finally:
            os.remove(tmp_path)


class DatasetView(MethodView):
    @staticmethod
    def get(dataset_id):
        """

        :param dataset_id: reference to id to provide the upload manager
        :return: {
            "dataset": DatasetMeta(...)
        }
        """
        if dataset_id not in M.datasets:
            return jsonify({"error": "invalid dataset_id"})

        schema = DatasetSchema()
        try:
            dataset_json = schema.dump(M.datasets[dataset_id])
        except ValidationError as e:
            return jsonify({"error": "Error dumping dataset [%s]" % e})
        return jsonify({"dataset": dataset_json})

    @staticmethod
    def delete(dataset_id):
        """

        :param dataset_id: reference to provide the upload manager
        :return: 204 -> No Content
        """
        M.delete_dataset(dataset_id)
        return "", 204


@datasets_routes.route("/<string:dataset_id>/sequences")
def dataset_sequences_view(dataset_id):
    """

    :param dataset_id:
    :return: {
        "pagination": {
            start=0
            limit=500
            total_items
        },
        "dataset_id": id,
        "records": [
            Record(...)
        ]
    }
    """
    if dataset_id not in M.datasets:
        return jsonify({"error": "invalid dataset_id"})

    schema = RecordSchema(many=True)
    try:
        p = utils.Pagination(request)
        records = M.datasets[dataset_id].load_records()
        json_records = schema.dump(records[p.start : p.start + p.limit])
    except ValidationError as e:
        return jsonify({"error": "Error dumping dataset [%s]" % e})
    return jsonify(
        {
            "pagination": {
                "start": p.start,
                "limit": p.limit,
                "total_items": len(records),
            },
            "dataset_id": dataset_id,
            "records": json_records,
        }
    )


datasets_routes.add_url_rule(
    "/", view_func=DatasetsView.as_view("datasets_view"), methods=["GET", "POST"]
)


datasets_routes.add_url_rule(
    "/<string:dataset_id>",
    view_func=DatasetView.as_view("dataset_view"),
    methods=["GET", "DELETE"],
)
