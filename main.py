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

@app.route('/create/add_data',methods=['POST', 'GET'])
def add_data():
    name="noName"
    data={}
    for key, value in request.form.items():
        if key=="name":
            print(value)
            name=value
        else:
            print(key+", "+value)
            data.update({key: value})
    # key = datastore_client.key(name)
    # entity=datastore.Entity(key=key)
    # entity.update({name:data})
    return render_template('home.html')

if __name__ == '__main__':
    app.run(debug=True)
