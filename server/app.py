import json
from flask import Flask, render_template, g, session
from flask_dotenv import DotEnv
from api import API_APP
from repository import DatabaseConnector


app = Flask(__name__)
env = DotEnv()
env.init_app(app)
app.register_blueprint(API_APP, url_prefix='/api')

DB_CONFIG = None


def read_db_config():
    global DB_CONFIG
    if DB_CONFIG is None:
        with open('config/config.json') as inf:
            DB_CONFIG = json.load(inf)
    return DB_CONFIG


@app.before_request
def connect_to_db():
    g.db = DatabaseConnector(**read_db_config())


@app.route('/', methods=['GET'])
def index():
    return render_template('index.html')


if __name__ == "__main__":
    app.run(host="0.0.0.0", debug=True)
