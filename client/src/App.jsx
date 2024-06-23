import { Route, createBrowserRouter, createRoutesFromElements, RouterProvider } from 'react-router-dom';
import React from 'react'
import MainLayout from './layouts/MainLayout';
import NursePage from './pages/NursePage';
import NurseLoginPage from './pages/NurseLoginPage';
import PatientLoginPage from './pages/PatientLoginPage';
import PatientPage from './pages/PatientPage';
import SignupPage from './pages/SignupPage';
import PrivateRoute from './components/PrivateRoute';
import AboutPage from './pages/AboutPage';
import NavBar from './components/NavBar';

function App() {
  const router = createBrowserRouter(createRoutesFromElements(
    <Route path='/' element={<MainLayout/>}>
      <Route index element={<AboutPage/>}/>
      <Route path="/nurse-login" element={<NurseLoginPage/>} />
      <Route path="/patient-login" element={<PatientLoginPage/>} />
      <Route path="/patient" element={<PatientPage/>} />
      <Route path="/signup" element={<SignupPage/>} />
      <Route path="/nurse" element={<NursePage/>} />
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