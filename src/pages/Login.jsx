import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { useAuth } from '../context/AuthContext';
import { useAddress } from '../context/AddressContext';
import { FaEye, FaEyeSlash } from 'react-icons/fa'; 

const Login = () => {
  const navigate = useNavigate();
  const { login, user } = useAuth();
  const { fetchDefaultAddress } = useAddress();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');


  useEffect(() => {
    if (user) {
      if (user.role === 'Admin') {
        navigate('/admin');
      } else {
        navigate('/');
      }
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('https://localhost:7234/api/Account/login', {
        email,
        password,
      });
  
      const token = response.data.token;
      const decodedToken = jwtDecode(token);
      const userRole = decodedToken['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];

      localStorage.setItem('token', token);
      localStorage.setItem('role', userRole); 

      login(token);
      await fetchDefaultAddress();
  
      if (userRole === 'Admin') {
        navigate('/admin');
      } else {
        navigate('/');
      }
    } catch (error) {
      console.error('Login error:', error);
      if (error.response && error.response.status === 400) {
        setError('Invalid email or password');
      } else {
        setError('An unexpected error occurred');
      }
    }
  };
    

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
      <div className="card p-4 shadow" style={{ width: '100%', maxWidth: '400px' }}>
        <h2 className="text-center mb-4">Login</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label>Email</label>
            <input
              type="email"
              className="form-control"
              placeholder="Enter email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="mb-3 position-relative">
            <label>Password</label>
            <input
              type={showPassword ? 'text' : 'password'}
              className="form-control"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <span
              onClick={() => setShowPassword(!showPassword)}
              style={{
                position: 'absolute',
                right: '10px',
                top: '70%',
                transform: 'translateY(-50%)',
                cursor: 'pointer',
                color: '#888',
              }}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>

          {error && <div className="alert alert-danger">{error}</div>}

          <button className="btn btn-primary w-100" type="submit">
            Log In
          </button>

          <p className="mt-3 text-center">
            Don’t have an account?{' '}
            <Link to="/register" className="text-primary">
              Register here
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
