import { Route, createBrowserRouter, createRoutesFromElements, RouterProvider } from 'react-router-dom';
import React from 'react'
import MainLayout from './layouts/MainLayout';
import HomePage from './pages/HomePage';
import NursePage from './pages/NursePage';
import PatientDetailsPage from './pages/PatientDetailsPage';

function App() {


  const router = createBrowserRouter(createRoutesFromElements(
    <Route path='/' element={<MainLayout/>}>
      <Route index element={<NursePage/>}/>
      <Route path='/patient-stream' element={<HomePage/>}/>
      <Route path='/patient-details/:id' element={<PatientDetailsPage/>}/>
    </Route>
    
  ))

  return <RouterProvider router={router}/>
  // return <h1>HUME</h1>
}

export default App 
