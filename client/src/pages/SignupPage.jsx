import React, { useState } from 'react';
import axios from 'axios';
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
        navigate('/login');
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
    <div className="container h-100">
      <div className="container-fluid h-custom">
        <div className="row d-flex justify-content-center align-items-center h-100">
          <div className="col-md-8 col-lg-6 col-xl-4 offset-xl-1">
            <form>
              <div className="d-flex flex-row align-items-center justify-content-center justify-content-lg-start">
                <p className="lead fw-normal mb-0 me-3">Create Your Account</p>
              </div>

              <div className="form-outline mb-4">
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  id="form3Example1"
                  className="form-control form-control-lg"
                  placeholder="Enter your name"
                />
                <label className="form-label" htmlFor="form3Example1">
                  Name
                </label>
              </div>

              <div className="form-outline mb-4">
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  id="form3Example2"
                  className="form-control form-control-lg"
                  placeholder="Enter a valid username"
                />
                <label className="form-label" htmlFor="form3Example2">
                  Username
                </label>
              </div>

              <div className="form-outline mb-3">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  id="form3Example3"
                  className="form-control form-control-lg"
                  placeholder="Enter password"
                />
                <label className="form-label" htmlFor="form3Example3">
                  Password
                </label>
              </div>

              <div className="form-outline mb-3">
                <input
                  type="text"
                  value={uid}
                  onChange={(e) => setUid(e.target.value)}
                  id="form3Example4"
                  className="form-control form-control-lg"
                  placeholder="Enter UID"
                />
                <label className="form-label" htmlFor="form3Example4">
                  UID
                </label>
              </div>

              <div className="text-center text-lg-start mt-4 pt-2">
                <button
                  type="button"
                  className="btn btn-primary btn-lg"
                  onClick={registerUser}
                >
                  Signup
                </button>
                <p className="small fw-bold mt-2 pt-1 mb-0">
                  Already have an account?{' '}
                  <a href="/login" className="link-danger">
                    Login
                  </a>
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
