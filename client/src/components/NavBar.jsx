import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserNurse } from '@fortawesome/free-solid-svg-icons';
import { faHeart as faRegularHeart } from '@fortawesome/free-regular-svg-icons';
import './navbar.css';

const NavBar = () => {
  const navigate = useNavigate();

  const handleNurseClick = (e) => {
    e.preventDefault();
    const isAuthenticated = !!sessionStorage.getItem('accessToken');
    if (isAuthenticated) {
      navigate('/nurse');
    } else {
      navigate('/nurse-login');
    }
  };

  const handlePatientClick = (e) => {
    e.preventDefault();
    const isAuthenticated = !!sessionStorage.getItem('accessToken');
    if (isAuthenticated) {
      navigate('/patient');
    } else {
      navigate('/patient-login');
    }
  };

  return (
    <nav className='navbar'>
      <div className="navbar-brand">
        <h1 className="logo">Emotion Stream</h1>
        <div className="icons">
          <FontAwesomeIcon icon={faUserNurse} style={{ color: 'lightskyblue' }} />
          <FontAwesomeIcon icon={faRegularHeart} style={{ color: 'red' }} />
        </div>
      </div>
      <div className="navbar-links">
        <ul className="nav-links">
          <li><NavLink to="/patient-login" onClick={handlePatientClick}>Patient</NavLink></li>
          <li><NavLink to="/nurse-login" onClick={handleNurseClick}>Nurse</NavLink></li>
          <li><NavLink to="/about">About</NavLink></li>
        </ul>
      </div>
    </nav>
  );
};

export default NavBar;
