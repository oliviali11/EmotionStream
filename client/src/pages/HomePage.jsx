import React, { useRef, useEffect, useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios'

const HomePage = () => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [capturedImage, setCapturedImage] = useState(null);
  const [predictions, setPredictions] = useState([]);

  useEffect(() => {
    const intervalId = setInterval(captureImage, 5000); // Capture image every 5 seconds

    // Clean-up function to clear the interval when component unmounts
    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    // Access the device camera and stream to video element
    navigator.mediaDevices.getUserMedia({ video: true })
      .then(stream => {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      })
      .catch(err => {
        console.error(`Error: ${err}`);
        toast.error('Error accessing webcam');
      });
  }, []);


  const captureImage = () => {
    if (videoRef.current) {
      const context = canvasRef.current.getContext('2d');
      canvasRef.current.width = videoRef.current.videoWidth;
      canvasRef.current.height = videoRef.current.videoHeight;
      context.drawImage(videoRef.current, 0, 0, canvasRef.current.width, canvasRef.current.height);
      const imageData = canvasRef.current.toDataURL('image/jpeg');
      setCapturedImage(imageData);
      sendImageToBackend(imageData);
    }
  };

  const sendImageToBackend = async (imageData) => {
    try {
      const response = await axios.post('http://localhost:8080/capture', {
        image: imageData
      });
      setPredictions(response.data);  // Update predictions state with response data
    } catch (error) {
      console.error("Error uploading image: ", error);
    }
  };


  return (
    <div>
      <h1>Hume AI Emotion Visualizer</h1>
      <video ref={videoRef} width="640" height="480" autoPlay></video>
      <button id="capture-button" onClick={captureImage}>Capture Photo</button>
      <canvas ref={canvasRef} width="640" height="480" style={{ display: 'none' }}></canvas>
      {/* {predictions.length > 0 ? (
        <div>
          <h2>Emotion Predictions</h2>
          <ul>
            {predictions.map((prediction, index) => (
              <li key={index}>{prediction}</li>
            ))}
          </ul>
        </div>
      ) : (
        <p>No predictions available</p>
      )} */}

      {predictions && (
        <div>
          <h2>Emotion Predictions</h2>
          <pre>{JSON.stringify(predictions, null, 2)}</pre>
          {/* {predictions.length > 0 ? (
        <div>
          <h2>Emotion Predictions</h2>
          <ul>
            {predictions.map((prediction, index) => (
              <li key={index}>{prediction}</li>
            ))}
          </ul>
        </div>
      ) : (
        <p>No predictions available</p>
      )} */}
        </div>
      )}
      
      <ToastContainer />

    </div>
  );
};

export default HomePage;
