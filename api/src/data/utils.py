from bson import ObjectId
from flask.json import JSONEncoder


class MongoEncoder(JSONEncoder):
    def default(self, obj):
        if isinstance(obj, ObjectId):
            return str(obj)
        return super().default(obj)


class BulkWriter:
    def __init__(self, flush, num=1500):
        self._flush = flush
        self._num = num
        self._items = []

    def __enter__(self):
        return self

    def __exit__(self, exc_type, exc_val, exc_tb):
        self.flush()

    def flush(self, full=True):
        if full or len(self._items) >= self._num:
            self._flush(self._items)
            self._items = []

    def insert(self, item):
        self._items.append(item)
        self.flush(full=False)


def validate_file(input_file):
    errors = []
    if input_file is None or input_file.filename == "":
        errors.append("Missing file part")

    return errors


def convert_model(model):
    model.full_clean()
    return model.to_son()
