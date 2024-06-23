import React, { useState } from "react";
import axios from 'axios';
import './styling/login.css';
import { useNavigate } from "react-router-dom";

export default function NurseLoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const logInUser = async (event) => {
    event.preventDefault();

    if (username.length === 0) {
      alert("Username cannot be left blank!");
    } else if (password.length === 0) {
      alert("Password cannot be left blank!");
    } else {
      try {
        const response = await axios.post('http://localhost:8000/nurse-login', {
          username: username,
          password: password
        });

        sessionStorage.setItem('accessToken', response.data.access_token);
        navigate("/nurse");
      } catch (error) {
        console.log(error);
        if (error.response && error.response.status === 401) {
          alert("Invalid credentials");
        } else {
          alert("An error occurred. Please try again.");
        }
      }
    }
  };

  return (
    <div className="sign-container">
      <div className="row d-flex justify-content-center align-items-center h-100">
        <div className="col-md-6 col-lg-5 col-xl-4">
          <form onSubmit={logInUser}>
            <div className="d-flex flex-row align-items-center justify-content-center justify-content-lg-start mb-4">
              <p className="lead fw-bold mb-0">Log Into Your Account</p>
            </div>
            <div className="form-group mb-4">
              <label htmlFor="username">Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                id="username"
                className="form-control"
                placeholder="Enter a valid username"
                required
              />
            </div>
            <div className="form-group mb-4">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                id="password"
                className="form-control"
                placeholder="Enter password"
                required
              />
            </div>
            <div className="d-flex justify-content-between align-items-center mb-4">
              <div className="form-check">
                <input className="form-check-input" type="checkbox" value="" id="rememberMe" />
                <label className="form-check-label" htmlFor="rememberMe">Remember me</label>
              </div>
              <a href="#!" className="text-body">Forgot password?</a>
            </div>
            <div className="text-center text-lg-start">
              <button type="submit" className="btn btn-primary">Login</button>
              <p className="small fw-bold mt-2 mb-0">Don't have an account? <a href="/signup" className="link-danger">Register</a></p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}