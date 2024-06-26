import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserNurse } from '@fortawesome/free-solid-svg-icons';
import { faHeart as faRegularHeart } from '@fortawesome/free-regular-svg-icons';
import './navbar.css';

const NavBar = () => {
  const navigate = useNavigate();

  return (
    <nav className='navbar'>
      <div className="navbar-brand">
        <h1 className="logo">Emotion Stream</h1>
      </div>
      <div className="navbar-links">
        <ul className="nav-links">
          <li><NavLink to="/patient-login">Patient</NavLink></li>
          <li><NavLink to="/nurse-login">Nurse</NavLink></li>
          <li><NavLink to="/about">About</NavLink></li>
        </ul>
      </div>
    </nav>
  );
};

export default NavBar;