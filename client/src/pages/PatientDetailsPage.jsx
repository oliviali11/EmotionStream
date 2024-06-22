import React from 'react'
import { useParams } from 'react-router-dom';
import profileImage from '../assets/dummy450x450.jpg'

const PatientDetailsPage = () => {
const { id } = useParams();
  return (
    <div>
      <h1>Patient Detail Page</h1>
      <p>Displaying details for patient with ID: {id}</p>
      <img src={profileImage} alt="Profile Photo" />
    </div>
  )
}

export default PatientDetailsPage