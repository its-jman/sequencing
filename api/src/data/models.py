from pymodm import MongoModel, EmbeddedMongoModel, fields


class DatasetAnalysis(EmbeddedMongoModel):
    distribution = fields.DictField(required=True)
    record_count = fields.IntegerField(min_value=1, required=True)
    discarded_count = fields.IntegerField(min_value=0, required=True)
    amino_count = fields.IntegerField(min_value=1, required=True)


class Dataset(MongoModel):
    name = fields.CharField(required=True)
    data_format = fields.CharField(required=True)
    user_filename = fields.CharField(required=True)
    upload_time = fields.DateTimeField(required=True)

    analysis = fields.EmbeddedDocumentField(DatasetAnalysis, required=True)
    queries = fields.DictField(blank=True)


class RecordAnalysis(EmbeddedMongoModel):
    distribution = fields.DictField(required=True)
    amino_count = fields.IntegerField(min_value=1, required=True)


class Record(MongoModel):
    seq_id = fields.CharField(required=True)
    description = fields.CharField(required=True)
    sequence = fields.CharField(required=True)
    discarded = fields.BooleanField(required=False)

    analysis = fields.EmbeddedDocumentField(RecordAnalysis)
    queries = fields.DictField(blank=True)


class Query(MongoModel):
    raw_pattern = fields.CharField(required=True)
