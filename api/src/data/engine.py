from flask import g
from Bio import SeqIO
from datetime import datetime
from collections import defaultdict, Counter

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
        )

        self.db = self.client.get_database(DataEngine.mongo_db_name)
        self._datasets = self.db.get_collection(DataEngine.datasets_cname)

    def gen_dataset_id(self):
        dataset_id = ObjectId()
        while str(dataset_id) in self.db.collection_names():
            dataset_id = ObjectId()

        return dataset_id

    def get_datasets(self):
        return list(self._datasets.find())

    def delete_dataset(self, dataset_id):
        dataset = self._datasets.find_one_and_delete({"_id": dataset_id})
        self.db.drop_collection(str(dataset_id))
        return dataset

    @staticmethod
    def _create_record(raw_record):
        seq = str(raw_record.seq)

        record = Record(description=raw_record.description, sequence=seq)
        if not seq or seq[0] != "M" or seq[-1] != "*" or "*" in seq[1:-1]:
            record.discarded = True
        else:
            record.analysis = RecordAnalysis(
                alphabet=dict(Counter(seq[1:-1])), amino_count=len(seq)
            )

        return record

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
        records_collection = self.db.get_collection(records_cname)

        alphabet = Counter()
        record_count = 0
        discarded_count = 0
        amino_count = 0

        records_iterator = SeqIO.parse(path, data_format)
        with utils.BulkWriter(records_collection.insert_many) as bw:
            for raw_record in records_iterator:
                record = self._create_record(raw_record)
                bw.insert(utils.convert_model(record))

                if record.discarded:
                    discarded_count += 1
                else:
                    if record.analysis:
                        record_count += 1
                        amino_count += record.analysis.amino_count
                        alphabet += record.analysis.alphabet
                    else:
                        discarded_count += 1
                        continue

        if record_count == 0:
            self.db.drop_collection(records_cname)
            print("Failure!")
        else:
            dataset.analysis = DatasetAnalysis(
                alphabet=dict(alphabet),
                record_count=record_count,
                discarded_count=discarded_count,
                amino_count=amino_count,
            )

            self._datasets.insert_one(utils.convert_model(dataset))


def get_engine():
    if not hasattr(g, "de"):
        g.de = DataEngine()
    return g.de


def close_de():
    de = g.pop("de", None)
    if de is not None:
        de.close()
