from collections import Counter
from marshmallow import Schema, fields, post_load


class RecordSchema(Schema):
    id = fields.Str(required=True)
    description = fields.Str(required=True)
    sequence = fields.Str(required=True)
    alphabet = fields.Dict(required=True)
    amino_acid_count = fields.Int(required=True)
    ignored = fields.Bool(required=True)

    class Record:
        def __init__(
            self,
            record_id,
            description,
            sequence,
            alphabet,
            amino_acid_count,
            ignored=False,
        ):
            self.id = record_id
            self.description = description
            self.sequence = sequence
            self.alphabet = alphabet
            self.amino_acid_count = amino_acid_count
            self.ignored = ignored

    @classmethod
    def from_seq_record(cls, record):
        seq = str(record.seq).rstrip("*")
        ignored = seq.count("*") > 0
        return cls().load(
            {
                "id": record.id,
                "description": record.description,
                "sequence": seq,
                "alphabet": dict(Counter(seq)),
                "amino_acid_count": len(seq),
                "ignored": ignored,
            }
        )

    @post_load
    def make_record(self, data):
        data["record_id"] = data.pop("id")
        return self.Record(**data)
