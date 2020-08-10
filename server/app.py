from flask import Flask, render_template
from api import API_APP


app = Flask(__name__)
app.register_blueprint(API_APP, url_prefix='/api')


@app.route('/', methods=['GET'])
def index():
    return render_template('index.html')


if __name__ == "__main__":
    app.run(host="0.0.0.0", debug=True)
