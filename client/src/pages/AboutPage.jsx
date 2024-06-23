import React from 'react'
import './styling/about.css'
import homeImage from './imgs/homeimage.jpeg';
import { useNavigate } from 'react-router-dom';


const AboutPage = () => {
  const navigate = useNavigate();

  const nurseSignup = () => {
    navigate('/signup');
  };

  const nurseLogin = () => {
    navigate('/nurse-login');
  };

  const patientLogin = () => {
    navigate('/patient-login');
  };

  return (
      <div className='about-container'>
        <h1>Emotion Stream</h1>
          <p className="about-description">
          Empowering caregivers with real-time AI analysis of elderly patient livestreams to promptly alert nurses of distress or pain indicators
          </p>
          <img className='titleImage' src={homeImage} alt="Home Image" />

          <div className='ml-4'>
            <div className="fixed top-1/2 transform -translate-y-1/2 right-1/4 m-8">
              <div className="mb-4 space-y-2">
                <button onClick={nurseSignup} className="shadow-md bg-purple-300 text-violet-500 hover:text-white rounded-md px-4 py-3 block w-full text-lg">
                  Nurse Sign Up
                </button>
                <button onClick={nurseLogin} className="shadow-md bg-purple-300 text-violet-500 hover:text-white rounded-md px-4 py-3 block w-full text-lg">
                  Nurse Log in
                </button>
                <button onClick={patientLogin} className="shadow-md bg-purple-300 text-violet-500 hover:text-white rounded-md px-4 py-3 block w-full text-lg">
                  Patient Log in
                </button>
              </div>
            </div>
          </div>
      </div>
  );
};


export default AboutPage