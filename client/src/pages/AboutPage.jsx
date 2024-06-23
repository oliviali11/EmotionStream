import React from 'react'
import './styling/about.css'
import homeImage from './imgs/homeimage.jpeg';
import bedImage from './imgs/bedelder.png';
import blackCross from './imgs/blackcross.png';
import { Link } from 'react-router-dom';


const AboutPage = () => {
  return (
      <div className='about-container'>
        <h1>Emotion Stream</h1>
          <p className="about-description">
          Empowering caregivers with real-time AI analysis of patient livestreams to promptly alert nurses of distress or pain indicators
          </p>
          <div className="auth-buttons">
            <Link to="/signup" className="auth-button">Nurse Sign Up</Link>
            <Link to="/nurse-login" className="auth-button">Nurse Log In</Link>
            <Link to="/patient-login" className="auth-button">Patient Log In</Link>
        </div>
          <img className='titleImage' src={homeImage} alt="Home Image" />
        <div class="middle-sec">
          <div class="middle-text">
            <p>Millions of elderly people suffer from strokes, heart attacks, and the like. In fact, nearly 50% of Americans overall have experienced such diseases. Many studies show that early detection and notification of heart failure—through careful attention to symptoms in susceptible populations—can be critical in saving lives; tools that assist in monitoring the most vulnerable patient demographics are crucial.</p>
          </div>
          <div class="rightImage">
            <img className='midImage' src={bedImage} alt="Bed Image"/>
          </div>
          
        </div>
        
        <div class="our-solution">
          <h1>Our Solution</h1>
          <p>We built an automated software to recognize facial expressions using Hume AI to alert nurses immediately if patients show signs of discomfort.</p>
          <div class="features">
            <div class="feature">
              <div class="heading">
                <img class="crossy" src={blackCross} alt="Bed Image" />
                <p>Facial Expression Measurement with Hume AI</p>
              </div>
              <small class="feature-small-text">Integrating the Hume API model for human expression to detect top negative emotions of patients in real time for occurrences of medical related emergencies</small>
            </div>
            <div class="feature">
              <div class="heading">
                <img class="crossy" src={blackCross} alt="Bed Image" />
                <p>Centralized Patient Database with MongoDB</p>
              </div>
              <small class="feature-small-text">Authentication system for registered nurses to log patient information and view patient emotion statuses</small>
            </div>
            <div class="feature">
              <div class="heading">
                <img class="crossy" src={blackCross} alt="Bed Image" />
                <p>Authenticated login</p>
              </div>
              <small class="feature-small-text">Efficient alert notification system for patient reports and communication to nurses for immediate assistance</small>
            </div>
             
            
          </div>
        
        </div>
        
          
      </div>
      
  );
}


export default AboutPage