from flask import g
from mongoengine import connect
from pymongo import MongoClient
from pymongo import errors


dataset_validator = {
    "$jsonSchema": {
        "bsonType": "object",
        "required": ["name", "year"],
        "properties": {
            "name": {
                "bsonType": "string",
                "description": "must be a string and is required",
            },
            "gender": {
                "bsonType": "string",
                "description": "must be a string and is not required",
            },
            "year": {
                "bsonType": "int",
                "minimum": 2017,
                "maximum": 3017,
                "exclusiveMaximum": False,
                "description": "must be an integer in [ 2017, 3017 ] and is required",
            },
        },
    }
}


class DataEngine:
    mongo_db_name = "sequencing"
    datasets_cname = "datasets"

    def __init__(self):
        pass
        # connect()
        # self.client = MongoClient(
        #     "mongodb://localhost:27017/",
        #     username="myuser",
        #     password="mypass",
        #     authSource="admin",
        # )
        #
        # self.db = self.client.get_database(DataEngine.mongo_db_name)
        # self._datasets = self.db.get_collection(DataEngine.datasets_cname)

    def __enter__(self):
        return self

    def __exit__(self, exc_type, exc_val, exc_tb):
        self.close()
        return True

    def create_dataset(self, dataset):
        try:
            result = self._datasets.insert_one(dataset)
        except errors.WriteError as e:
            print(e)
            print(e.code)
            print(e.details)
        print(result)

    def get_dataset(self, d_id):
        """

        :param d_id:
        :return:
        """
        pass

    def close(self):
        self.client.close()


def init_db():
    """
    Ensure database is created, along with the `datasets` collection and schema.

    Iterate through each to build the corresponding `dataset-collection` with a baseline schema. No... Do this in a
    separate script where it also builds the associated field values to be updated...
    Well.. That is actually just a migration from an ORM-like framework. To use that functionality use something that is
    already implemented... (MongoEngine, PyModM, etc...)

    FOR NOW: Just set the schema for the datasets collection. Updates to the -old_data itself, along with any updates to
    record collections should be dealt with by a seperate script that is run a single time.
    :return:
    """
    with DataEngine() as de:
        try:
            de.db.create_collection(
                name=DataEngine.datasets_cname, validator=dataset_validator
            )
        except errors.CollectionInvalid:
            print(
                'Collection already exists or is invalid: "%s"'
                % DataEngine.datasets_cname
            )

        de.db.command(
            {"collMod": DataEngine.datasets_cname, "validator": dataset_validator}
        )


def get_engine():
    if not hasattr(g, "de"):
        g.de = DataEngine()
    return g.de


def close_de(a):
    de = g.pop("de", None)
    if de is not None:
        de.close()
