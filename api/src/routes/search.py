from flask import Blueprint, jsonify

import search

from models.record import RecordSchema
from models.dataset import DatasetSchema, RecordsMetaSchema

search_routes = Blueprint("search", __name__)


@search_routes.route("/<raw_pattern>/datasets", defaults={"dataset_id": None})
@search_routes.route("/<raw_pattern>/datasets/<string:dataset_id>")
def search_view(raw_pattern, dataset_id):
    """
    {
        "regex": transformed_pattern,
        "matches": {
            dataset_id: RecordsMetaSchema(filter(does_match, records))
        }
    }

    :param raw_pattern:
    :param dataset_id:
    :return:
    """
    # Process all datasets instead of a single identifier
    pattern = search.regexify_pattern(raw_pattern)
    if dataset_id is None:
        matches_info = {}
        for dataset in M.datasets.values():
            records = dataset.load_records()
            dataset_matches = search.search_records(records, pattern)

            records_matches = list(filter(lambda r: r.id in dataset_matches, records))
            matches_records_meta = RecordsMetaSchema.from_records(records_matches)
            matches_info[dataset.id] = RecordsMetaSchema().dump(matches_records_meta)
    else:
        dataset = M.datasets[dataset_id]
        records = dataset.load_records()
        dataset_match = search.search_records(records, pattern)

        records_matches = list(filter(lambda r: r.id in dataset_match, records))
        matches_records_meta = RecordsMetaSchema.from_records(records_matches)

        matches_info = {dataset.id: RecordsMetaSchema().dump(matches_records_meta)}

    return jsonify({"regex": pattern, "matches": matches_info})


@search_routes.route("/search/<raw_pattern>/datasets/<string:dataset_id>/sequences")
def search_sequences_view(raw_pattern, dataset_id):
    """

    :param raw_pattern:
    :param dataset_id:
    :return: {
        regex: transformed_pattern
        matches: {
            dataset_id: [Match(...)]
        }
    }
    """
    pattern = search.regexify_pattern(raw_pattern)

    dataset = M.datasets[dataset_id]
    records = dataset.load_records()
    dataset_matches = search.search_records(records, pattern)

    return jsonify({"regex": pattern, "matches": dataset_matches})
