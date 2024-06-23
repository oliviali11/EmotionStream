import React from 'react'
import { NavLink } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faVideo } from '@fortawesome/free-solid-svg-icons';
// import { library } from '@fortawesome/fontawesome-svg-core';
import { faUserNurse } from '@fortawesome/free-solid-svg-icons';
import { faHeart as faRegularHeart } from '@fortawesome/free-regular-svg-icons';

// library.add(faVideo);

const NavBar = () => {
    const linkClass = ({isActive}) => isActive ? 'shadow-md bg-purple-300 text-violet-500 hover:text-white rounded-md px-3 py-2' : 'shadow-md bg-white text-purple-300 hover:bg-purple-300 hover:text-violet-500 rounded-md px-3 py-2'
  return (
    <nav className='flex justify-between items-center px-4 py-2'>
      <div className="flex items-center justify-center flex-1">
                <h1 className="text-4xl font-bold text-purple-800 mr-4">Emotion Stream</h1>
                <FontAwesomeIcon icon={faUserNurse} size="2x" style={{ color: 'lightskyblue' }} />
                <FontAwesomeIcon icon={faRegularHeart} size="2x" style={{ color: 'red' }} />
            </div>
        <div className="md:ml-auto">
            <div className="flex space-x-2">
                <NavLink to="/patient-stream" className={linkClass}>Home Stream</NavLink>
                <NavLink to="/" className={linkClass}>Nurse</NavLink>
                <NavLink to="/about" className={linkClass}>About</NavLink>
            </div>
        </div>
    </nav>
  )
}

export default NavBar