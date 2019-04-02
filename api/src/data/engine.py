import os
import re
import time
import bson
import pymongo
from flask import g
from Bio import SeqIO
from datetime import datetime
from collections import Counter

from pymongo import MongoClient
from pymongo.errors import BulkWriteError

from data import utils, models


class DataEngine:
    mongo_db_name = "sequencing"
    datasets_cname = "datasets"
    queries_cname = "queries"
    dataset_projection = {
        "name": 1,
        "data_format": 1,
        "user_filename": 1,
        "upload_time": 1,
        "analysis": 1,
        "queries": 1,
    }

    sequences_projection = {
        "seq_id": 1,
        "description": 1,
        "sequence": 1,
        "discarded": 1,
        "analysis": 1,
        "queries": 1,
    }

    def __init__(self):
        mongo_url = os.environ.get('SEQUENCING_MONGO_URL', "mongodb://mongo:27017")
        
        self.client = MongoClient(
            mongo_url,
            username="myuser",
            password="mypass",
            authSource="admin",
            socketTimeoutMS=3000,
            connectTimeoutMS=3000,
        )

        self.db = self.client.get_database(DataEngine.mongo_db_name)
        self._datasets = self.db.get_collection(DataEngine.datasets_cname)
        self._queries = self.db.get_collection(DataEngine.queries_cname)

    def gen_dataset_id(self):
        dataset_id = bson.ObjectId()
        while str(dataset_id) in self.db.collection_names():
            dataset_id = bson.ObjectId()

        return dataset_id

    def get_datasets(self, page=None, page_size=None):
        projection = {**self.dataset_projection}
        projection.pop("queries")

        # offset = page * page_size
        cursor = self._datasets.find({}, projection)  # .skip(offset).limit(page_size)
        return list(cursor)

    def get_dataset_records(
        self,
        dataset_id,
        page,
        page_size,
        query_id=None,
        desc_filter=None,
        excluded_fields=None,
    ):
        if isinstance(dataset_id, str):
            dataset_id = bson.ObjectId(dataset_id)
        if isinstance(query_id, str):
            query_id = bson.ObjectId(query_id)

        dataset = self._datasets.find_one({"_id": dataset_id})
        if dataset is None:
            return None, ["invalid_dataset"]

        mongo_filter = {}
        projection = {**self.sequences_projection}
        projection.pop("queries")

        # Filter results by raw_pattern
        if query_id is not None:
            query = self._queries.find_one({"_id": query_id})
            if query is None:
                return None, ["invalid_query"]

            query_id = query["_id"]
            if dataset["queries"].get(str(query_id), None) is None:
                self._build_query_for_dataset(query, dataset)
            mongo_filter[f"queries.{str(query_id)}"] = {"$exists": True}
            projection[f"queries.{str(query_id)}"] = 1

        # Filter results by description
        if desc_filter is not None:
            mongo_filter["$text"] = {"$search": desc_filter}
            projection["match_score"] = {"$meta": "textScore"}

        # Remove all excluded fields from projection. This should be the last statement that manages the projection
        if excluded_fields is not None:
            if isinstance(excluded_fields, list) and all(
                isinstance(item, str) for item in excluded_fields
            ):
                for exclude in excluded_fields:
                    if exclude in projection:
                        projection.pop(exclude)
            else:
                print("Invalid excluded_fields tag")

        records_cname = str(dataset_id)
        records_collection = self.db.get_collection(records_cname)

        offset = page * page_size
        cursor = records_collection.find(mongo_filter, projection)

        if page_size == 0:
            items = []
        else:
            cursor = (
                cursor.skip(offset)
                .limit(page_size)
                .sort("seq_id", 1)
                .collation({"locale": "en_US", "numericOrdering": True})
            )
            items = list(cursor)

        return {
            "page": page,
            "page_size": page_size,
            "total_count": cursor.count(),
            "items": items,
        }

    def delete_dataset(self, dataset_id):
        dataset = self._datasets.find_one_and_delete({"_id": dataset_id})
        self.db.drop_collection(str(dataset_id))
        return dataset

    def _create_and_insert_records(self, records_cname, records_iterator):
        records_collection = self.db.get_collection(records_cname)
        records_collection.create_index([("description", pymongo.TEXT)])
        analysis = {
            "discarded_count": 0,
            "record_count": 0,
            "amino_count": 0,
            "distribution": Counter(),
        }

        with utils.BulkWriter(records_collection.insert_many) as bw:
            for raw_record in records_iterator:
                record = utils.convert_raw_record(raw_record)
                bw.insert(utils.convert_model(record))

                if record.discarded or not record.analysis:
                    analysis["discarded_count"] += 1
                    continue
                else:
                    analysis["record_count"] += 1
                    analysis["amino_count"] += record.analysis.amino_count
                    analysis["distribution"] += record.analysis.distribution

        return analysis

    def create_dataset(self, name, data_format, user_filename, path):
        dataset_id = self.gen_dataset_id()
        dataset = models.Dataset(
            _id=dataset_id,
            name=name,
            data_format=data_format,
            user_filename=user_filename,
            upload_time=datetime.utcnow(),
        )

        records_cname = str(dataset_id)
        records_iterator = SeqIO.parse(path, data_format)
        analysis = self._create_and_insert_records(records_cname, records_iterator)

        errors = []
        if analysis["record_count"] == 0:
            self.db.drop_collection(records_cname)

            errors.append("no_valid_records")
            dataset = None
        else:
            dataset.analysis = models.DatasetAnalysis(**analysis)
            dataset.queries = {}
            self._datasets.insert_one(utils.convert_model(dataset))

        return errors, dataset

    def get_query(self, raw_pattern):
        query = self._queries.find_one({"raw_pattern": raw_pattern})
        if query is not None:
            return query, []
        else:
            pattern = utils.convert_raw_pattern(raw_pattern)
            pattern_re = utils.compile_regex(pattern)
            if pattern_re is None:
                return None, ["invalid_pattern"]

            query_model = models.Query(raw_pattern=raw_pattern)
            query = utils.convert_model(query_model)
            inserted = self._queries.insert_one(query)
            return query, []

    def get_queries(self):
        return list(self._queries.find())

    def _build_query_for_dataset(self, query, dataset):
        pattern = utils.convert_raw_pattern(query["raw_pattern"])
        pattern_re = utils.compile_regex(pattern)
        if pattern_re is None:
            raise ValueError("invalid_pattern")

        records_cname = str(dataset["_id"])
        records = self.db.get_collection(records_cname)

        total_matches = 0
        with utils.BulkWriter(records.bulk_write) as bw:
            for record in records.find({}, {"sequence": 1}):
                matches = utils.get_sequence_matches(pattern_re, record["sequence"])

                if len(matches) > 0:
                    total_matches += len(matches)
                    bw.insert(
                        pymongo.UpdateOne(
                            {"_id": record["_id"]},
                            {"$set": {f"queries.{query['_id']}": {"matches": matches}}},
                        )
                    )

        analysis = {"total_matches": total_matches}
        self._datasets.update_one(
            {"_id": dataset["_id"]}, {"$set": {f"queries.{query['_id']}": analysis}}
        )

        return analysis

    def query_dataset(self, query_id, dataset_id):
        query = self._queries.find_one({"_id": query_id})
        dataset = self._datasets.find_one({"_id": dataset_id})

        errors = []
        if query is None:
            errors.append("invalid_query")
        if dataset is None:
            errors.append("invalid_dataset")
        if len(errors) > 0:
            return errors

        # total matches
        analysis = dataset["queries"].get(query_id, None)
        if analysis is None:
            analysis = self._build_query_for_dataset(query, dataset)

        return analysis

    # def query_dataset_sequences(self, query_id, dataset_id, page, page_size):
    #     query = self._queries.find_one({"_id": query_id})
    #     dataset = self._datasets.find_one({"_id": dataset_id})
    #
    #     errors = []
    #     if not query:
    #         errors.append("invalid_query")
    #     if not dataset:
    #         errors.append("invalid_dataset")
    #     if len(errors) > 0:
    #         return {"errors": errors}
    #
    #     if not dataset["queries"].get(str(query_id), None):
    #         self._build_query_for_dataset(query, dataset)
    #
    #     records_collection = self.db.get_collection(str(dataset_id))
    #     # total matches
    #     offset = page * page_size
    #     cursor = (
    #         records_collection.find({f"queries.{query_id}": {"$exists": True}})
    #         .skip(offset)
    #         .limit(page_size)
    #     )  # .sort("seq_id", 1)
    #     items = list(cursor)
    #     return {"page": page, "page_size": page_size, "items": items, "errors": []}


def get_engine():
    if not hasattr(g, "de"):
        g.de = DataEngine()
    return g.de


def close_de():
    de = g.pop("de", None)
    if de is not None:
        de.close()
