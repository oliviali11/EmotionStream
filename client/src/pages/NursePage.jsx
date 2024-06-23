import React from 'react'
import profileImage from '../assets/dummy450x450.jpg'
import { useState, useEffect } from 'react';
import axios from 'axios'

const NursePage = ({ negativeDetected, patientID }) => {
  const [patients, setPatients] = useState([]);

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const response = await axios.get('http://localhost:8000/patients');
        setPatients(response.data);
        console.log(patients)
      } catch (error) {
        console.error('Error fetching patients:', error);
      }
    };

    fetchPatients();
  }, []);

  const handleClick = () => {
    // Handle click event here, e.g., navigate to a different page
    window.location.href = '/patient-stream';
  };
  return (
    <div className='ml-4'>
    <h2 className="text-2xl font-bold text-violet-500 mb-4">Patients</h2>

    {negativeDetected ? (
        <div className="alert alert-info" role="alert">
          Patient #{patientID} is experiencing negative emotions -- please provide assistance!

        </div>
      ) : (
        <p>No negative emotions detected -- patient is stable. </p>
      )}
       <img
      src={profileImage}
      alt="Description of your image"
      onClick={handleClick}
      style={{ width: "250px",
        height: "250px"
       }} // Optional: Change cursor to pointer on hover
    />
    </div>
  )
}

export default NursePage