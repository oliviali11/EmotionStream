import React, { useRef, useEffect, useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import NursePage from './NursePage';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faVideo } from '@fortawesome/free-solid-svg-icons';
import { library } from '@fortawesome/fontawesome-svg-core';

library.add(faVideo);

const PatientPage = () => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [capturedImage, setCapturedImage] = useState(null);
  const [predictions, setPredictions] = useState(null);
  const [negativeDetected, setNegativeDetected] = useState(false);

  const navigate = useNavigate();

  const [randomId, setRandomId] = useState(() => {
    const storedId = sessionStorage.getItem('randomId');
    if (storedId) {
      return parseInt(storedId, 10);
    } else {
      const newRandomId = Math.floor(Math.random() * 1000) + 1;
      sessionStorage.setItem('randomId', newRandomId.toString());
      return newRandomId;
    }
  });

  const handleClick = () => {
    navigate(`/patient-details/${randomId}`);
  };

  useEffect(() => {
    const intervalId = setInterval(captureImage, 1000);
    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
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

  const notifyReport = () => {
    toast.info('Nurse will be notified momentarily!', {
      position: 'top-right',
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
    // Logic to alert the nurse, for example, making an API call to notify the nurse
    console.log("Nurse has been alerted!");
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
      const response = await axios.post('http://localhost:8000/capture', {
        image: imageData
      });
      setPredictions(response.data.top_emotions);
      setNegativeDetected(response.data.negative_detected);
      if (response.data.negative_detected) {
        alertNurse();
      }
    } catch (error) {
      console.error("Error uploading image: ", error);
    }
  };

  const alertNurse = () => {
    toast.info('Nurse was notified of emotional discomfort!', {
        position: 'top-right',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    // Logic to alert the nurse, for example, making an API call to notify the nurse
    console.log("Nurse has been alerted!");
  };

  return (
    <div className='ml-4'>
      <div className="flex items-center">
        <h1 className="text-2xl font-bold mr-4 text-violet-500">Live Patient Stream</h1>
        <FontAwesomeIcon icon={['fa-solid', 'fa-video']} className="text-xl" />
      </div>
      <video ref={videoRef} width="640" height="480" autoPlay></video>
      <canvas ref={canvasRef} width="640" height="480" style={{ display: 'none' }}></canvas>

      <div className="fixed top-1/2 transform -translate-y-1/2 right-1/4 m-8">
        <div className="mb-4 space-y-2">
          <button onClick={notifyReport} className="shadow-md bg-purple-300 text-violet-500 hover:text-white rounded-md px-4 py-3 block w-full text-lg">
            Report
          </button>
        </div>
      </div>
      
      <ToastContainer />
    </div>
  );
};

export default PatientPage;