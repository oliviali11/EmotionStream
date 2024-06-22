import { Route, createBrowserRouter, createRoutesFromElements, RouterProvider } from 'react-router-dom';
import React from 'react'
import MainLayout from './layouts/MainLayout';
import HomePage from './pages/HomePage';
import NursePage from './pages/NursePage';

function App() {


  const router = createBrowserRouter(createRoutesFromElements(
    <Route path='/' element={<MainLayout/>}>
      <Route index element={<HomePage/>}/>
      <Route path='/nurse' element={<NursePage/>}/>
    </Route>
    
  ))

  return <RouterProvider router={router}/>
  // return <h1>HUME</h1>
}

export default App 
