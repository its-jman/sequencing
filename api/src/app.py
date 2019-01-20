from flask import Flask
from flask_cors import CORS

from routes.datasets import datasets_routes
from routes.search import search_routes

app = Flask(__name__)

app.config['DEBUG'] = True
app.secret_key = "A0Zr98j/3yX R~XHH!jmN]LWX/,?RT"

CORS(app)

app.register_blueprint(datasets_routes)
app.register_blueprint(search_routes)


if __name__ == "__main__":
    # app.url_map.strict_slashes = False
    app.run(debug=True)
