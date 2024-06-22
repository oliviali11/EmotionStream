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

from server.db import fetch_patient, fetch_patients, fetch_report, fetch_reports, fetch_reports_for, insert_report

app = Flask(__name__)
cors = CORS(app, origins='*')

# Create a directory to save captured images if it doesn't exist
output_dir = "static/captured_images"
if not os.path.exists(output_dir):
    os.makedirs(output_dir)

def _response(data):
    if data:
        return jsonify(data), 200
    else:
        return jsonify({"error": "Data not found"}), 404

@app.route('/')
def index():
    return render_template('index.html')

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


@app.route('/capture', methods=['POST'])
def capture():
    client = HumeBatchClient(os.environ.get("hume_key"))
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
    config = FaceConfig()
    job = client.submit_job(None, [config], files=filepaths)
    details = job.await_complete()

    # COMMENT OUT FOR NOW
    predictions_filename = f"static/predictions_{timestamp}.json"
    job.download_predictions(predictions_filename)
    
    return jsonify({"image_path": filename, "predictions_path": predictions_filename})
    #COMMENT OUT FOR NOW

    # predictions = []
    # for result in details.results:
    #     for prediction in result.predictions:
    #         predictions.append(prediction.expression) 
    
    # return jsonify(predictions=predictions)


    # # Hume AI analysis
    # config = FaceConfig()
    # image = Image.open(io.BytesIO(image_data))
    # job = client.submit_job_from_files([image], [config])
    
    # # Wait for job to complete
    # details = job.await_complete()
    
    # # Get predictions from details
    # predictions = details.predictions[0]

    # return jsonify(predictions)

if __name__ == '__main__':
    app.run(debug=True, port=8080)