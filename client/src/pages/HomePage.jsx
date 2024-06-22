import React, { useRef, useEffect, useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios'
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

const HomePage = () => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [capturedImage, setCapturedImage] = useState(null);
  const [predictions, setPredictions] = useState([]);
  // const [randomId, setRandomId] = useState(null);

  // const history = useHistory();
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
      {/* <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
  <div className="ml-auto">
    <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
      Details
    </button>
  </div>
</div> */}
<div className="fixed top-1/2 transform -translate-y-1/2 right-0 m-8">
  <button onClick={handleClick} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
    Details
  </button>
</div>



{/* <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
  <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ml-auto mr-12">
    Details
  </button>
</div> */}
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
