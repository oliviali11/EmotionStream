import json
from flask import Flask, render_template, request, jsonify
# import cv2
import os
import base64
from hume import HumeBatchClient
from hume.models.config import FaceConfig
import time
from flask_cors import CORS
import io
from PIL import Image
import bson
from bson import json_util

from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi
from urllib.parse import quote_plus
import datetime

mongo_uri = "mongodb+srv://user:12345@emotionstream.9iou8ty.mongodb.net/?retryWrites=true&w=majority&appName=EmotionStream"

client = MongoClient(mongo_uri)
db = client.get_database("emotion_stream")
patients = db.get_collection("patients")
reports = db.get_collection("reports")

def fetch_patients():
    return patients.find()

def fetch_patient(pid):
    return patients.find_one(pid)

def fetch_reports():
    return reports.find()

def fetch_reports_for(pid):
    return reports.find({"pid": pid})

def fetch_report(rid):
    return reports.find_one(rid)

def insert_report(emotion: str, score: float, pid):
    return reports.insert_one({
        "patient_id": pid,
        "timestamp": datetime.datetime.now(datetime.UTC),
        "emotion": emotion,
        "score": score
    })

app = Flask(__name__)
cors = CORS(app, origins='*')

# Create a directory to save captured images if it doesn't exist
output_dir = "static"
if not os.path.exists(output_dir):
    os.makedirs(output_dir)

def parse_json(data):
    return json.loads(json_util.dumps(data))

def _response(data):
    if data:
        return jsonify(parse_json(list(data))), 200
    else:
        return jsonify({"error": "Data not found"}), 404

# return all patients
@app.route('/patients', methods=['GET'])
def get_patients():
    return _response(fetch_patients())

# return patient with p_id
@app.route('/patients/<pid>', methods=['GET'])
def get_patient(pid):
    return _response(fetch_patient(pid))

# generate new report
@app.route('/reports/new', methods=['POST'])
def create_report():
    if request.is_json:
        data = request.get_json()
        result = insert_report(data['emotion'], data['score'], data['pid'])
        if result.inserted_id:
            jsonify(result.inserted_id), 400
        else:
            jsonify({"error": "Create failed"}), 400
    else:
        return jsonify({"error": "Invalid JSON"}), 400

# return all reports
@app.route('/reports', methods=['GET'])
def get_reports():
    return _response(fetch_reports())

# return reports for patient pid
@app.route('/reports/all/<pid>', methods=['GET'])
def get_reports_for(pid):
    return _response(fetch_reports_for(pid))
    
# return report with r_id
@app.route('/reports/<rid>', methods=['GET'])
def get_report(rid):
    return _response(fetch_report(rid))

threshold = 0.5
min_seconds = 4
negative_emotions = ['Anger', 'Anxiety', 'Distress', 'Fear', 'Horror', 'Pain', 'Sadness', 'Surprise (negative)']
neg_emotionscores = {}
neg_emotionsaverages = {}

def add_new_emotionscores(predictedemotions):
    for emotion in predictedemotions:
        if emotion['name'] in negative_emotions:
            if emotion['name'] in neg_emotionscores.keys():
                if len(neg_emotionscores[emotion['name']]) == min_seconds:
                    neg_emotionscores[emotion['name']].pop(0)
                    neg_emotionscores[emotion['name']].append(emotion['score'])
                    emotionavg = sum(neg_emotionscores[emotion['name']]) / min_seconds
                    print("AVERAGE", emotion['name'], emotionavg)
                    if emotionavg > threshold:
                        neg_emotionsaverages[emotion['name']] = emotionavg
                    elif emotion['name'] in neg_emotionsaverages.keys():
                        del neg_emotionsaverages[emotion['name']]
                    
                else:
                    neg_emotionscores[emotion['name']].append(emotion['score'])
            else:
                neg_emotionscores[emotion['name']] = [emotion['score']]
    sorted_avgs = dict(sorted(neg_emotionsaverages.items(), key=lambda item: item[1], reverse=True))
    if len(list(sorted_avgs)) >= 3:
        return list(sorted_avgs.items())[:3]
    elif len(list(sorted_avgs)) > 0:
        return list(sorted_avgs.items())
    else:
        return ["Everything looks good!"]

@app.route('/capture', methods=['POST'])
def capture():
    client = HumeBatchClient("r4qQLy6O83Hh6o7fytMHbVIoOGLViDIF2xIaxOujCBjUX6DE")
    data = request.get_json()
    image_data = data['image']
    image_data = image_data.split(',')[1]  # Remove the data:image/jpeg;base64, part
    image_data = base64.b64decode(image_data)
    
    # Generate a unique filename
    timestamp = int(time.time())
    filename = os.path.join(output_dir, f'captured_image.jpg')
    
    with open(filename, 'wb') as f:
        f.write(image_data)
    
    # Hume AI analysis
    filepaths = [filename]
    config = FaceConfig(identify_faces=True)
    job = client.submit_job(None, [config], files=filepaths)
    details = job.await_complete()

    # COMMENT OUT FOR NOW
    predictions_filename = "static/predictions.json"
    running_preds = "static/all_predictions.json"
    job.download_predictions(predictions_filename)

    with open(predictions_filename, 'r') as f:
        predictions_data = json.load(f)
    
    top_emotions = add_new_emotionscores(predictions_data[0]['results']['predictions'][0]['models']['face']['grouped_predictions'][0]['predictions'][0]['emotions'])

    return jsonify(top_emotions)

@app.route('/')
def index():
    return render_template('index.html')

if __name__ == "__main__":
    app.run(port=8000, debug=True)
