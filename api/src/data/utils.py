import bson
from flask.json import JSONEncoder


class MongoEncoder(JSONEncoder):
    def default(self, obj):
        if isinstance(obj, bson.ObjectId):
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
            if len(self._items) > 0:
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


REMOVED_FIELDS = ["_cls"]


def _remove_unnecessary_son_fields(son):
    for key, val in son.items():
        # Remove field
        if key in REMOVED_FIELDS:
            son.pop(key)
        # Iterate recursively for any nested attributes
        elif isinstance(val, bson.son.SON):
            _remove_unnecessary_son_fields(val)


def convert_model(model):
    # Validate
    model.full_clean()

    # Convert to regular object, and remove unnecessary fields.
    son = model.to_son()
    _remove_unnecessary_son_fields(son)

    return son
