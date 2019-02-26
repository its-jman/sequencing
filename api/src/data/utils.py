import bson
from collections import Counter
from flask.json import JSONEncoder
from pymodm import MongoModel

from data import constants as c


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


def validate_record(record):
    seq = record.sequence
    desc = record.description

    if not seq or not desc:
        return False

    if seq[0] != "M" or seq[-1] != "*":
        return False

    if not set(seq).issubset(c.VALID_ALPHABET):
        return False

    # TODO: Figure out if this is proper to discard such sequences
    if "*" in seq[:-1] or "." in seq:
        return False

    return True


def get_sequence_distribution(seq):
    return dict(Counter(seq))


def get_sequence_amino_count(seq):
    return len(seq)


def _remove_unnecessary_son_fields(son):
    for key, val in son.items():
        # Remove field
        if key in c.REMOVED_FIELDS:
            son.pop(key)
        print("HERE")
        print(key)
        if key in c.RENAMED_FIELDS:
            print(key)
            son[c.RENAMED_FIELDS[key]] = son.pop(key)
        # Iterate recursively for any nested attributes
        elif isinstance(val, bson.son.SON):
            _remove_unnecessary_son_fields(val)


def convert_model(model):
    if type(model) == MongoModel:
        # Validate
        model.full_clean()
        # Convert to regular object, and remove unnecessary fields.
        son = model.to_son()
    else:
        son = model

    _remove_unnecessary_son_fields(son)

    return son
