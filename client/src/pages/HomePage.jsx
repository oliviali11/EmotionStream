import React, { useRef, useEffect, useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios'
import { useNavigate } from 'react-router-dom';


const HomePage = () => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [capturedImage, setCapturedImage] = useState(null);
  const [predictions, setPredictions] = useState(null);

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
      fetchPredictions();

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

  const fetchPredictions = async () => {
    try {
      const response = await axios.get('http://localhost:8080/predictions/predictions.json');
      setPredictions(response.data); // Set predictions state with fetched data
      setError(null); // Clear any previous errors
    } catch (error) {
      console.error('Error fetching predictions:', error);
      setError("Failed to fetch predictions.");
    }
  };


  return (
    <div>
      <h1>Hume AI Emotion Visualizer</h1>
      <video ref={videoRef} width="640" height="480" autoPlay></video>
      <canvas ref={canvasRef} width="640" height="480" style={{ display: 'none' }}></canvas>

      <div className="fixed top-1/2 transform -translate-y-1/2 right-0 m-8">
  <div className="mb-4 space-y-2"> {/* Add margin bottom and space-y utility */}
  <button onClick={handleClick} className="shadow-md bg-purple-300 text-violet-500 hover:text-white rounded-md px-3 py-2 block w-full">
    Details
  </button>
  <button onClick={notifyReport} className="shadow-md bg-purple-300 text-violet-500 hover:text-white rounded-md px-3 py-2 block w-full">
    Report
  </button>
</div>
</div>

      {predictions ? (
        <div>
          <h2>Emotion Predictions</h2>
          <pre>{JSON.stringify(predictions, null, 2)}</pre>
        </div>
      ) : (
        <p>No predictions available</p>
      )}

    
      <ToastContainer />

    </div>
  );
};

export default HomePage;
