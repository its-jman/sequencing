import uuid
from flask import Flask
from flask_cors import CORS

import data
from routes import bp

app = Flask(__name__)
app.secret_key = str(uuid.uuid4())
app.config["DEBUG"] = True
app.config["CORS_HEADERS"] = "Content-Type"
app.json_encoder = data.utils.MongoEncoder

CORS(app)

app.register_blueprint(bp)


if __name__ == "__main__":
    # app.url_map.strict_slashes = False
    app.run(debug=True)
