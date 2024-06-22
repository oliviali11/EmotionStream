import React from 'react'
import NavBar from '../components/NavBar'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import {Outlet} from 'react-router-dom'

const MainLayout = () => {
  return (
    <>
    <NavBar/>
    <Outlet/>
    <ToastContainer />
    </>
  )
}

export default MainLayout