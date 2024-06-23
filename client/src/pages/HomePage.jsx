import React, { useRef, useEffect, useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios'
import { useNavigate } from 'react-router-dom';
import NursePage from './NursePage';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faVideo } from '@fortawesome/free-solid-svg-icons';
import { library } from '@fortawesome/fontawesome-svg-core';
import './styling/home.css'

library.add(faVideo);

library.add(faVideo);

const HomePage = () => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [capturedImage, setCapturedImage] = useState(null);
  const [predictions, setPredictions] = useState(null);
  const [negativeDetected, setNegativeDetected] = useState(false);

  const navigate = useNavigate();

  const [randomId, setRandomId] = useState(() => {
    // Initialize randomId state with value from localStorage if available, else generate new random ID
    const storedId = localStorage.getItem('randomId');
    if (storedId) {
      return parseInt(storedId, 10); // Parse stored ID as integer
    } else {
      const newRandomId = Math.floor(Math.random() * 1000) + 1; // Generate random ID
      localStorage.setItem('randomId', newRandomId.toString()); // Store random ID in localStorage
      return newRandomId;
    }
  });

  const handleClick = () => {
    navigate(`/patient-details/${randomId}`);
  };

  useEffect(() => {
    const intervalId = setInterval(captureImage, 1000); // Capture image every 1 seconds

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
      // fetchPredictions();

  }, []);

  const notifyReport = () => {
    toast.info('Nurse will be notified momentarily!', {
      position: 'top-right',
      autoClose: 3000, // Auto close the toast after 3 seconds
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
  };

  const directSignup = () => {
    navigate('/signup');
  }

  const directLogin = () => {
    navigate('/login')
  }



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
      const response = await axios.post('http://localhost:8000/capture', {
        image: imageData
      });
      setPredictions(response.data.top_emotions);  // Update predictions state with response data
      setNegativeDetected(response.data.negative_detected);
    } catch (error) {
      console.error("Error uploading image: ", error);
    }
  };

  // const fetchPredictions = async () => {
  //   try {
  //     const response = await axios.get('http://localhost:8000/predictions/predictions.json');
  //     setPredictions(response.data); // Set predictions state with fetched data
  //     setError(null); // Clear any previous errors
  //   } catch (error) {
  //     console.error('Error fetching predictions:', error);
  //     setError("Failed to fetch predictions.");
  //   }
  // };


  return (
    <div className="patient-stream">
      <div className="header">
        <h1 className="title">Live Patient Stream</h1>
        <FontAwesomeIcon icon={faVideo} className="video-icon" />
      </div>

      <video ref={videoRef} className="video-element" autoPlay></video>
      <canvas ref={canvasRef} className="canvas-element"></canvas>

      <div className="actions">
        <div className="action-buttons">
          <button onClick={handleClick} className="btn btn-details">
            Details
          </button>
          <button onClick={notifyReport} className="btn btn-report">
            Report
          </button>
          <button onClick={directSignup} className="btn btn-signup">
            Sign Up!
          </button>
          <button onClick={directLogin} className="btn btn-login">
            Log in!
          </button>
        </div>
      </div>

      {predictions ? (
        <div className="emotion-display">
          <h2 className="section-title">Emotion Display</h2>
          <pre>{JSON.stringify(predictions, null, 2)}</pre>
        </div>
      ) : (
        <p>No predictions available</p>
      )}

      {negativeDetected && <NursePage negativeDetected={negativeDetected} patientID={randomId} />}
      
      <div id="toastContainer"></div>
    </div>
  );
};

export default HomePage;