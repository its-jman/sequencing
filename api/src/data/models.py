from pymodm import MongoModel, EmbeddedMongoModel, EmbeddedDocumentField, fields


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

    analysis = EmbeddedDocumentField(DatasetAnalysis, required=True)


class RecordAnalysis(EmbeddedMongoModel):
    distribution = fields.DictField(required=True)
    amino_count = fields.IntegerField(min_value=1, required=True)


class Record(MongoModel):
    description = fields.CharField(required=True)
    sequence = fields.CharField(required=True)
    discarded = fields.BooleanField(required=False)

    analysis = EmbeddedDocumentField(RecordAnalysis)
