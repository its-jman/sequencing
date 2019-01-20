from app import db


class BaseModel(db.Model):
    __abstract__ = True


class MyModel(BaseModel):
    __tablename__ = "my_table"

    pkey = db.Column(db.Integer, name="id", primary_key=True)
    user_filename = db.Column(db.String)
