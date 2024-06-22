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
import json

app = Flask(__name__)
cors = CORS(app, origins='*')

# Initialize Hume AI client
client = HumeBatchClient("r4qQLy6O83Hh6o7fytMHbVIoOGLViDIF2xIaxOujCBjUX6DE")

# Create a directory to save captured images if it doesn't exist
output_dir = "static/captured_images"
if not os.path.exists(output_dir):
    os.makedirs(output_dir)

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
                    print("AVERAGE", emotionavg)
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
    

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/capture', methods=['POST'])
def capture():
    data = request.get_json()
    image_data = data['image']
    image_data = image_data.split(',')[1]  # Remove the data:image/jpeg;base64, part
    image_data = base64.b64decode(image_data)
    
    # Generate a unique filename
    timestamp = int(time.time())
    filename = os.path.join(output_dir, f'captured_image_{timestamp}.jpg')
    
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
    
    # top_emotions = add_new_emotionscores(predictions_data[0]['results']['predictions'][0]['models']['face']['grouped_predictions'][0]['predictions'][0]['emotions'])

    # return jsonify(top_emotions)
    top_emotions = add_new_emotionscores(predictions_data[0]['results']['predictions'][0]['models']['face']['grouped_predictions'][0]['predictions'][0]['emotions'])

    return jsonify(top_emotions)

if __name__ == '__main__':
    app.run(debug=True, port=8080)