import React from 'react'
import { useParams } from 'react-router-dom';
import profileImage from '../assets/dummy450x450.jpg'
import { useState, useEffect } from 'react';
import axios from 'axios'

const PatientDetailsPage = () => {
const { id } = useParams();
const [reports, setReports] = useState([]);

    useEffect(() => {
        const fetchReports = async () => {
            try {
                const response = await axios.get(`http://localhost:8000/reports/patient/${id}`);
                setReports(response.data);
            } catch (error) {
                console.error('Error fetching reports:', error);
            }
        };

        fetchReports();
    }, [id]);
  return (
    <div>
      <h1>Patient Detail Page</h1>
      <p>Displaying details for patient with ID: {id}</p>
      <img src={profileImage} alt="Profile Photo" />
    </div>
  )
}

export default PatientDetailsPage