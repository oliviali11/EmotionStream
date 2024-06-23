import { Route, createBrowserRouter, createRoutesFromElements, RouterProvider } from 'react-router-dom';
import React from 'react'
import MainLayout from './layouts/MainLayout';
import HomePage from './pages/HomePage';
import NursePage from './pages/NursePage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import PrivateRoute from './components/PrivateRoute';
import PatientDetailsPage from './pages/PatientDetailsPage';
import AboutPage from './pages/AboutPage';
import NavBar from './components/NavBar';

function App() {
  const router = createBrowserRouter(createRoutesFromElements(
    <Route path='/' element={<MainLayout/>}>
      <Route index element={<NursePage/>}/>
      <Route path='/patient-stream' element={<HomePage/>}/>
      <Route path='/patient-details/:id' element={<PatientDetailsPage/>}/>
      <Route path="/login" element={<LoginPage/>} />
      <Route path="/signup" element={<SignupPage/>} />
      <Route path="/about" element={<AboutPage/>}/>
      <Route
          path="/nurse"
          element={
          <PrivateRoute>
              <NursePage />
          </PrivateRoute>
          }
          />
    </Route>
    
  ))

  return <RouterProvider router={router}/>
  // return <h1>HUME</h1>
}

export default App 