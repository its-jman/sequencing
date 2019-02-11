from flask import g
from Bio import SeqIO
from datetime import datetime
from collections import Counter

from pymongo import MongoClient
from pymongo.errors import BulkWriteError
from bson.objectid import ObjectId

from data import utils
from data.models import Dataset, DatasetAnalysis, Record, RecordAnalysis


class DataEngine:
    mongo_db_name = "sequencing"
    datasets_cname = "datasets"

    def __init__(self):
        self.client = MongoClient(
            "mongodb://localhost:27017/",
            username="myuser",
            password="mypass",
            authSource="admin",
            socketTimeoutMS=6000,
            connectTimeoutMS=6000,
        )

        self.db = self.client.get_database(DataEngine.mongo_db_name)
        self._datasets = self.db.get_collection(DataEngine.datasets_cname)

    def gen_dataset_id(self):
        dataset_id = ObjectId()
        while str(dataset_id) in self.db.collection_names():
            dataset_id = ObjectId()

        return dataset_id

    def get_datasets(self, page=0, page_size=100):
        offset = page * page_size
        cursor = self._datasets.find().skip(offset).limit(page_size)
        return list(cursor)

    def get_dataset_records(self, dataset_id, page, page_size):
        records_cname = str(dataset_id)
        records_collection = self.db.get_collection(records_cname)

        offset = page * page_size
        cursor = records_collection.find().skip(offset).limit(page_size)
        return list(cursor)

    def delete_dataset(self, dataset_id):
        dataset = self._datasets.find_one_and_delete({"_id": dataset_id})
        self.db.drop_collection(str(dataset_id))
        return dataset

    @staticmethod
    def _create_record(raw_record):
        seq = str(raw_record.seq)

        record = Record(description=raw_record.description, sequence=seq)
        if not utils.validate_record(record):
            record.discarded = True
        else:
            record.analysis = RecordAnalysis(
                distribution=utils.get_sequence_distribution(seq),
                amino_count=utils.get_sequence_amino_count(seq),
            )

        return record

    def _create_and_insert_records(self, records_cname, records_iterator):
        records_collection = self.db.get_collection(records_cname)
        analysis = {
            "discarded_count": 0,
            "record_count": 0,
            "amino_count": 0,
            "distribution": Counter(),
        }

        with utils.BulkWriter(records_collection.insert_many) as bw:
            for raw_record in records_iterator:
                record = self._create_record(raw_record)
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
        dataset = Dataset(
            _id=dataset_id,
            name=name,
            data_format=data_format,
            user_filename=user_filename,
            upload_time=datetime.utcnow(),
        )

        records_cname = str(dataset_id)

        records_iterator = SeqIO.parse(path, data_format)
        analysis = self._create_and_insert_records(records_cname, records_iterator)

        if analysis["record_count"] == 0:
            self.db.drop_collection(records_cname)
            print("Failure!")
        else:
            dataset.analysis = DatasetAnalysis(**analysis)
            self._datasets.insert_one(utils.convert_model(dataset))


def get_engine():
    if not hasattr(g, "de"):
        g.de = DataEngine()
    return g.de


def close_de():
    de = g.pop("de", None)
    if de is not None:
        de.close()
