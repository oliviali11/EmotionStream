import React from 'react'
import './about.css'
import homeImage from './imgs/homeimage.jpeg';


const AboutPage = () => {
  return (
      <div className='about-container'>
        <h1>Emotion Stream</h1>
          <p className="about-description">
          Empowering caregivers with real-time AI analysis of elderly patient livestreams to promptly alert nurses of distress or pain indicators
          </p>
          <img src="./imgs/homeimage.jpeg" alt="Home Image" />
      </div>
  );
}


export default AboutPage