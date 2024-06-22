# from flask import Flask, jsonify
# from flask_cors import CORS

# app = Flask(__name__)
# cors = CORS(app, origins='*')

# @app.route("/api/users", methods=['GET'])
# def users():
#     return jsonify({
#         "users": [
#             'arpan',
#             'zach',
#             'jessie'
#         ]
#     })

# if __name__=="__main__":
#     app.run(debug=True, port=8080)

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

app = Flask(__name__)
cors = CORS(app, origins='*')

# Initialize Hume AI client
client = HumeBatchClient("r4qQLy6O83Hh6o7fytMHbVIoOGLViDIF2xIaxOujCBjUX6DE")

# Create a directory to save captured images if it doesn't exist
output_dir = "static/captured_images"
if not os.path.exists(output_dir):
    os.makedirs(output_dir)

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