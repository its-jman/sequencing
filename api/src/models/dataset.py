from collections import defaultdict

from marshmallow import Schema, fields, post_load


class UploadMetaSchema(Schema):
    # id = fields.Str(required=True)
    name = fields.Str(required=True)
    user_filename = fields.Str(required=True)
    upload_time = fields.DateTime(required=True)

    class UploadMeta:
        def __init__(self, name, user_filename, upload_time):
            # self.id = dataset_id
            self.name = name
            self.user_filename = user_filename
            self.upload_time = upload_time

    @post_load
    def make_upload(self, data):
        # data['dataset_id'] = data.pop('id')
        return self.UploadMeta(**data)


class RecordsMetaSchema(Schema):
    alphabet = fields.Dict(
        required=True
    )  # Percentages based on sum of record->alphabet
    record_count = fields.Int(required=True)  # Total number of records NOT IGNORED
    ignored_count = fields.Int(required=True)  # Number of records that were ignored.
    amino_acid_count = fields.Int(required=True)  # Total letter count of records

    class RecordsMeta:
        def __init__(self, alphabet, amino_acid_count, record_count, ignored_count):
            self.alphabet = alphabet
            self.record_count = record_count
            self.ignored_count = ignored_count
            self.amino_acid_count = amino_acid_count

    @classmethod
    def from_records(cls, records):
        """
        Processes an []RecordSchema to give an overview of all of the data combined as RecordsMetaSchema

        :param records: []RecordSchema
        :return: RecordsMetaSchema
        """
        if records is None:
            return None

        amino_acid_count = 0
        record_count = 0
        ignored_count = 0
        full_alphabet = defaultdict(int)
        for record in records:
            if record.ignored:
                ignored_count += 1
            else:
                record_count += 1
                amino_acid_count += record.amino_acid_count
                for k, v in record.alphabet.items():
                    full_alphabet[k] += v

        return cls().load(
            {
                "alphabet": dict(full_alphabet),
                "amino_acid_count": amino_acid_count,
                "record_count": record_count,
                "ignored_count": ignored_count,
            }
        )

    @post_load
    def make_record_meta(self, data):
        return self.RecordsMeta(**data)


class DatasetSchema(Schema):
    id = fields.Str(required=True)

    upload_meta = fields.Nested(UploadMetaSchema, required=True)
    records_meta = fields.Nested(RecordsMetaSchema, required=True)

    errors = fields.Dict(required=True)
    valid = fields.Bool(required=True)
