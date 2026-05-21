import os
import pathlib

import requests
from flask import Flask, request, render_template, url_for, redirect, session, abort
from google.cloud import datastore
from google.oauth2 import id_token
from google_auth_oauthlib.flow import Flow
from pip._vendor import cachecontrol
import google.auth.transport.requests
import json

os.environ["OAUTHLIB_INSECURE_TRANSPORT"] = "1"

app = Flask(__name__)
app.secret_key="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"

datastore_client = datastore.Client()


GOOGLE_CLIENT_ID="580089379987-n97sm30so7enum4g3ok6rt2kssuglfar.apps.googleusercontent.com"
client_secrets_file=os.path.join(pathlib.Path(__file__).parent, "client_secret.json")

flow = Flow.from_client_secrets_file(
    client_secrets_file=client_secrets_file,
    scopes=["openid","https://www.googleapis.com/auth/userinfo.email"],
    redirect_uri="http://127.0.0.1:5000/callback"
)

@app.route('/login')
def login():
    authorization_url, state=flow.authorization_url()
    session["state"] = state
    return redirect(authorization_url)


@app.route("/callback")
def callback():
    flow.fetch_token(authorization_response=request.url)

    save_state=session.get("state")
    return_state=request.args.get("state")
    if not save_state:
        return redirect(url_for("login"))
    if not save_state==return_state:
        abort(500)

    credentials=flow.credentials
    request_session=requests.session()
    cached_session=cachecontrol.CacheControl(request_session)
    token_request=google.auth.transport.requests.Request(session=cached_session)

    id_info = id_token.verify_oauth2_token(
        id_token=credentials._id_token,
        request=token_request,
        audience=GOOGLE_CLIENT_ID
    )

    session["google_id"]=id_info.get("sub")
    session["name"] = id_info.get("name")
    return redirect("/protected_area")

@app.route('/logout')
def logout():
    session.clear()
    return redirect("/")

def login_is_required(function):
    def wrapper(*args, **kwargs):
        if "google_id" not in session:
            return abort(401)
        else:
            return function()
    return wrapper

@app.route('/protected_area')
@login_is_required
def protected_area():
    return f"Hello {session['name']}! <br/> <a href='logout'><button>Logout</button></a>"

@app.route('/')
def home():
    query = datastore_client.query(kind='Set')
    sets = []
    for entity in query.fetch():
        cardset = dict(entity)
        sets.append(cardset)
    return render_template('home.html', sets=sets)


@app.route('/create')
def create():
    return render_template('create.html')


@app.route('/create/get_name/<the_name>', methods=['GET'])
def get_name(the_name):
    key = datastore_client.key("Set", the_name)
    if datastore_client.get(key) is None:
        return "T"
    return "F"


@app.route('/view_set/<set_id>', methods=['GET'])
def view_set(set_id):
    key = datastore_client.key('Set', set_id)
    entity = datastore_client.get(key)

    if not entity:
        return "Item not found", 404

    cardset = dict(entity)
    return render_template('view_set.html', cardset=cardset)


@app.route('/flashcards/<set_id>', methods=['GET'])
def flashcards(set_id):
    key = datastore_client.key('Set', set_id)
    entity = datastore_client.get(key)

    if not entity:
        return "Item not found", 404

    cardset = dict(entity)
    return render_template('flashcards.html', cardset=cardset)


@app.route('/create/add_data', methods=['POST', 'GET'])
def add_data():
    name = "noName"
    description = "no description"
    data = {}
    lengths = []
    for key, value in request.form.items():
        if key == "name":
            name = value
        elif key == "description":
            description = value
        else:
            data.update({key: value})
            if key[0] == 'q':
                if len(lengths) < (int(key[1:(key.index(','))])):
                    lengths.append(0)
                lengths[int(key[1:(key.index(','))]) - 1] = int(key[((key.index(',')) + 1):])

    key = datastore_client.key("Set", name)
    entity = datastore.Entity(key=key)
    entity.update({
        'name': name,
        'description': description,
        'data': json.dumps(data),
        'lengths': json.dumps(lengths)
    })
    print(json.dumps(data))
    datastore_client.put(entity)
    return redirect(url_for('home'))


if __name__ == '__main__':
    app.run(debug=True)
