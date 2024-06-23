import React, { useState } from 'react';
import axios from 'axios';
import './styling/signin.css'
import { useNavigate } from 'react-router-dom';

const SignupPage = () => {
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [uid, setUid] = useState('');

  const navigate = useNavigate();

  const registerUser = () => {
    if (!name || !username || !password || !uid) {
      alert('All fields are required!');
      return;
    }

    console.log('Sending request with:', { name, username, password, uid });

    axios.post('http://127.0.0.1:8000/signup', {
      name,
      username,
      password,
      uid,
    })
    .then((response) => {
      console.log('Response:', response);
      if (response.status === 201) {
        navigate('/nurse-login');
      } else {
        alert('Signup failed');
      }
    })
    .catch((error) => {
      console.error('Error:', error);
      if (error.response) {
        console.error('Response data:', error.response.data);
        if (error.response.status === 409) {
          alert('Username already exists');
        } else {
          alert('Signup failed');
        }
      } else {
        alert('Signup failed');
      }
    });
  };

  return (
    <div className="sign-container">
      <h1>Sign In Here</h1>
      <form>
        <div className="form-group">
          <label htmlFor="name">Name</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="form-control"
            placeholder="Enter your name"
          />
        </div>

        <div className="form-group">
          <label htmlFor="username">Username</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="form-control"
            placeholder="Enter a valid username"
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="form-control"
            placeholder="Enter password"
          />
        </div>

        <div className="form-group">
          <label htmlFor="uid">UID</label>
          <input
            type="text"
            id="uid"
            value={uid}
            onChange={(e) => setUid(e.target.value)}
            className="form-control"
            placeholder="Enter UID"
          />
        </div>

        <button
          type="button"
          className="btn btn-primary btn-lg"
          onClick={registerUser}
        >
          Signup
        </button>

        <p className="small mt-3">
          Already have an account?{' '}
          <a href="/nurse-login" className="link-danger">
            Login
          </a>
        </p>
      </form>
    </div>
  );
};

export default SignupPage;
