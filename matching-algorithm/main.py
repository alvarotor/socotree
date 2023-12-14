from waitress import serve
import flask
from flask_cors import CORS
from flask import request
from matching_functions import Matcher
from event_matching import EMatcher
import sys

app = flask.Flask(__name__)
CORS(app)
versionStr = "version del codigo actual"


@app.route('/match', methods=['POST'])
def match():
    matcher = Matcher()
    matcher.matching()
    # Returns HTTP Response with {"success": true}
    return flask.jsonify(success=True)


@app.route('/ematch', methods=['POST'])
def ematch():
    #full_url = request.url
    dashboard = request.args.get('dashboard', default=False, type=bool)
    event_id = request.args.get('eventid')
    circlesize = request.args.get('circlesize', type=int, default=2)
    recircle = request.args.get('recircle', default=False, type=bool)
    ageflag = request.args.get('age', default=False, type=bool)
    prematch = request.args.get('prematch', default=False, type=bool)
    langflag = request.args.get('lang', default=False, type=bool)
    try:
        #print(f'\n\nRequest: {full_url}\n')
        ematcher = EMatcher(dashboard, event_id, circlesize, recircle, ageflag, prematch, langflag)
        total_users, n_circles = ematcher.matching()
        return flask.jsonify(success=True, total_users=total_users, circles=n_circles)
    except:
        return flask.jsonify(success=False, error=f'Errortype: {sys.exc_info()[0]}\n - {sys.exc_info()[1]} in line {sys.exc_info()[2].tb_lineno}')


@app.route("/")
def index():
    # Route to check that its working
    return "<h1>Matching algorithm</h1>"


@app.route("/version")
def version():
    # Route to check that its working
    return versionStr


if __name__ == "__main__":
    serve(app, host="0.0.0.0", port=5000)
