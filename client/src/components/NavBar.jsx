import React from 'react'
import { NavLink } from 'react-router-dom'

const NavBar = () => {
    const linkClass = ({isActive}) => isActive ? 'shadow-md bg-black text-emerald-500 hover:bg-gray-900 hover:text-white rounded-md px-3 py-2' : 'shadow-md text-emerald-500 hover:bg-gray-900 hover:text-white rounded-md px-3 py-2'
  return (
    <nav className='flex justify-between items-center px-4 py-2'>
        <div className="md:ml-auto">
            <div className="flex space-x-2">
                <NavLink to="/" className={linkClass}>Home</NavLink>
                <NavLink to="/nurse" className={linkClass}>Nurse</NavLink>
            </div>
        </div>
    </nav>
  )
}

export default NavBar