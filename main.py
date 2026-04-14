from flask import Flask, request, render_template
from google.cloud import datastore
import json

app = Flask(__name__)
datastore_client = datastore.Client()

@app.route('/')
def home():
    return render_template('home.html')

@app.route('/create')
def create():
    return render_template('create.html')

@app.route('/create/get_name/<the_name>',methods=['GET'])
def get_name(the_name):
    print(the_name)
    key=datastore_client.key("Name", the_name)
    if datastore_client.get(key) is None:
        return "T"
    return "F"


@app.route('/create/add_data',methods=['POST', 'GET'])
def add_data():
    name="noName"
    description="no description"
    data={}
    for key, value in request.form.items():
        if key=="name":
            name=value
        elif key== "description":
            description=value
        else:
            data.update({key: value})
    key = datastore_client.key("Name", name)
    entity=datastore.Entity(key=key)
    entity.update({
        'name': name,
        'description': description
    })
    datastore_client.put(entity)
    return render_template('home.html')

if __name__ == '__main__':
    app.run(debug=True)
