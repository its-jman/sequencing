from flask import Flask
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate, MigrateCommand

from routes.datasets import datasets_routes
from routes.search import search_routes


POSTGRES = {
    "user": "myuser",
    "pw": "mypass",
    "db": "sequencing",
    "host": "localhost",
    "port": "5432",
}

app = Flask(__name__)
app.config["DEBUG"] = True
app.secret_key = "A0Zr98j/3yX R~XHH!jmN]LWX/,?RT"

app.config["SQLALCHEMY_DATABASE_URI"] = (
    "postgresql://%(user)s:%(pw)s@%(host)s:%(port)s/%(db)s" % POSTGRES
)

db = SQLAlchemy(app)
import models.models

db.create_all()

migrate = Migrate(app, db)
CORS(app)

app.register_blueprint(datasets_routes)
app.register_blueprint(search_routes)


if __name__ == "__main__":
    # app.url_map.strict_slashes = False
    app.run(debug=True)
