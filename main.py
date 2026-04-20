from flask import Flask, request, render_template, url_for, redirect
from google.cloud import datastore
import json

app = Flask(__name__)
datastore_client = datastore.Client()

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

@app.route('/create/get_name/<the_name>',methods=['GET'])
def get_name(the_name):
    key=datastore_client.key("Set", the_name)
    if datastore_client.get(key) is None:
        return "T"
    return "F"

@app.route('/view_set/<set_id>',methods=['GET'])
def view_set(set_id):
    key = datastore_client.key('Set', set_id)
    entity = datastore_client.get(key)

    if not entity:
        return "Item not found", 404

    item = dict(entity)
    return render_template('view_set.html', item=item)

@app.route('/flashcards/<set_id>',methods=['GET'])
def flashcards(set_id):
    key = datastore_client.key('Set', set_id)
    entity = datastore_client.get(key)

    if not entity:
        return "Item not found", 404

    item = dict(entity)
    return render_template('flashcards.html', item=item)


@app.route('/create/add_data',methods=['POST', 'GET'])
def add_data():
    name="noName"
    description="no description"
    data={}
    lengths=[]
    for key, value in request.form.items():
        if key=="name":
            name=value
        elif key== "description":
            description=value
        else:
            data.update({key: value})
            if len(lengths)< (int(data[key][1:(data[key].index(':'))])):
                lengths.append(1)
            else:
                lengths[int(data[key][1:(data[key].index(':'))])]=int(data[key][((data[key].index(':'))+1):])
    print(lengths)

    key = datastore_client.key("Set", name)
    entity=datastore.Entity(key=key)
    entity.update({
        'name': name,
        'description': description,
        'data': data,
        'lengths': lengths
    })
    datastore_client.put(entity)
    return redirect(url_for('home'))

if __name__ == '__main__':
    app.run(debug=True)
