import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUser, FaLock, FaEye, FaEyeSlash, FaExchangeAlt } from 'react-icons/fa';
import API from '../api/api';
import './LoginPage.css';

const LoginPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [msg, setMsg] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await API.post('/users/login', { email, password });

      localStorage.setItem('token', res.data.token);
      localStorage.setItem('userId', res.data.user._id);
      localStorage.setItem('isAdmin', res.data.user.isAdmin);
      localStorage.setItem('userName', res.data.user.name);

      setIsLoading(false);

      if (res.data.user.isAdmin) {
        navigate('/admin');
      } else {
        navigate('/');
      }
    } catch (err) {
      setMsg(err.response?.data?.msg || 'Login failed');
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <div className="logo">
            <FaExchangeAlt className="logo-icon" />
            <h1>SkillSwap</h1>
          </div>
          <h2>Welcome Back</h2>
          <p>Sign in to continue your skill exchange journey</p>
        </div>

        <form onSubmit={handleLogin} className="login-form">
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <div className="input-with-icon">
              <FaUser className="input-icon" />
              <input
                type="email"
                id="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <div className="input-with-icon">
              <FaLock className="input-icon" />
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>

          {msg && <div className="error-message">{msg}</div>}

          <button type="submit" className="login-btn" disabled={isLoading}>
            {isLoading ? <div className="spinner"></div> : <span>Sign In</span>}
          </button>
        </form>

        <div className="register-link">
          Don't have an account?
          <button type="button" onClick={() => navigate('/register')}>
            Create account
          </button>
        </div>
      </div>

      <div className="login-graphics">
        <div className="graphic-element graphic-1"></div>
        <div className="graphic-element graphic-2"></div>
        <div className="graphic-element graphic-3"></div>
        <div className="graphic-element graphic-4"></div>
        <div className="graphic-text">
          <h3>Unlock New Skills</h3>
          <p>Connect with talented individuals and exchange your expertise</p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
