import re

import bson
from collections import Counter
from flask.json import JSONEncoder
from pymodm import MongoModel

from data import models, constants as c


class MongoEncoder(JSONEncoder):
    def default(self, obj):
        if isinstance(obj, bson.ObjectId):
            return str(obj)
        elif issubclass(obj.__class__, MongoModel):
            return convert_model(obj)
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
    """
    This do any necessary processing of a sequence, such as ignoring the START/STOP codons and excluding special
    characters from the rest of the sequence

    :param seq:
    :return:
    """
    return len(seq)


def convert_raw_record(raw_record):
    seq = str(raw_record.seq)

    record = models.Record(
        seq_id=raw_record.id, description=raw_record.description, sequence=seq
    )
    if not validate_record(record):
        record.discarded = True
    else:
        record.analysis = models.RecordAnalysis(
            distribution=get_sequence_distribution(seq),
            amino_count=get_sequence_amino_count(seq),
        )
        record.queries = {}

    return record


def convert_raw_pattern(raw_pattern):
    raw_pattern = raw_pattern.upper()
    if (
        raw_pattern is None
        or not isinstance(raw_pattern, str)
        or not re.match(r"^[A-Z0-9{},]{2,120}$", raw_pattern)
    ):
        return None

    raw_pattern = raw_pattern.replace("X", "[A-Z]")
    raw_pattern = re.sub(r"(\d+)-(\d+)", r"{\1,\2}", raw_pattern)
    # Replace numbers in string as long as they have not already been put in curly braces (by previous regexp)
    raw_pattern = re.sub(r"(\d+)(?![\d,]*})", r"{\1}", raw_pattern)

    return raw_pattern


def compile_regex(pattern):
    if pattern is None:
        return None

    try:
        out = re.compile(pattern)
    except re.error:
        out = None
    return out


def get_sequence_matches(query_re, sequence):
    matches = list(query_re.finditer(sequence))
    mapped_matches = list(map(lambda m: [m.span()[0], m.span()[1]], matches))
    return mapped_matches


def _remove_unnecessary_son_fields(son):
    for key, val in son.items():
        # Remove field
        if key in c.REMOVED_FIELDS:
            son.pop(key)
        # if key in c.RENAMED_FIELDS:
        #     son[c.RENAMED_FIELDS[key]] = son.pop(key)
        # Iterate recursively for any nested attributes
        elif isinstance(val, bson.son.SON):
            _remove_unnecessary_son_fields(val)


def convert_model(model):
    if issubclass(model.__class__, MongoModel):
        # Validate
        model.full_clean()
        # Convert to regular object
        son = model.to_son()
    else:
        son = model

    _remove_unnecessary_son_fields(son)

    return son
