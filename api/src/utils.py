import os
import json

from Bio import SeqIO
from Bio.Alphabet import generic_nucleotide
from marshmallow import ValidationError
from collections import namedtuple

import config
from models.record import RecordSchema


def should_update(path: str, update_time: float):
    if not os.path.exists(path):
        return True
    file_update_time = os.path.getmtime(path)
    return file_update_time > update_time


def allowed_file(filename):
    return (
        "." in filename
        and filename.rsplit(".", 1)[1].lower() in config.ALLOWED_EXTENSIONS
    )


def get_directory_list(folder, join=True):
    """
    Lists the provided folder to find each single file/folder within.
    :return:set of each file name. (as full path if join is True)
    """
    return {os.path.join(folder, name) if join else name for name in os.listdir(folder)}


def parse_fasta_stream(tmp_path):
    schema = RecordSchema()
    records = {}

    seq_records = SeqIO.parse(tmp_path, "fasta", alphabet=generic_nucleotide)
    for seq_record in seq_records:
        record = schema.from_seq_record(seq_record)

        extra_index = 0
        while record.id in records:
            extra_index += 1
            record.id = "%s-(%s)" % (record.id, extra_index)
        records[record.id] = record

    records_out = list(records.values())
    # records = list(map(lambda record: schema.from_seq_record(record), seq_records))
    if len(records_out) == 0:
        raise ValueError("Nothing able to be read from file")
    return sorted(records_out, key=lambda r: r.id)


ParsedResult = namedtuple("ParsedResult", ("data", "errors"))


def parse_schema_file(schema, path: str):
    errors = []
    if not os.path.exists(path):
        result = None
        errors.append("[%s] does not exist." % path)
    else:
        with open(path, "r") as fp:
            try:
                json_data = json.load(fp)
                result = schema.load(json_data)
            except json.JSONDecodeError as e:
                result = None
                errors.append("[%s] could parsed into JSON. %s" % (path, e))
            except ValidationError as e:
                result = None
                err_messages = list(map(lambda err: str(err), e.messages.items()))
                errors.extend(err_messages)

    if errors:
        print("Error parsing schema file [%s]:" % path)
        for error in errors:
            print("   ", error)

    return ParsedResult(data=result, errors=errors)


class Pagination:
    def __init__(self, request, default_start=0, default_limit=50):
        start = request.args.get("start", default_start)
        limit = request.args.get("limit", default_limit)

        self.start = start
        self.limit = limit
