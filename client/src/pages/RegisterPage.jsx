import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/api';
import {
  FaUser, FaEnvelope, FaLock, FaEye, FaEyeSlash, FaExchangeAlt
} from 'react-icons/fa';
import './RegisterPage.css';

const RegisterPage = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [msg, setMsg] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });

    if (name === 'password') {
      let strength = 0;
      if (value.length > 5) strength++;
      if (value.length > 7) strength++;
      if (/[A-Z]/.test(value)) strength++;
      if (/[0-9]/.test(value)) strength++;
      if (/[^A-Za-z0-9]/.test(value)) strength++;
      setPasswordStrength(Math.min(strength, 5));
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMsg('');

    if (form.password !== form.confirmPassword) {
      setMsg("Passwords don't match");
      setIsLoading(false);
      return;
    }

    try {
      const res = await API.post('/users/register', {
        name: form.name,
        email: form.email,
        password: form.password
      });

      localStorage.setItem('token', res.data.token);
      localStorage.setItem('userId', res.data.user._id);
      localStorage.setItem('isAdmin', res.data.user.isAdmin);
      localStorage.setItem('userName', res.data.user.name);

      setIsLoading(false);
      navigate(res.data.user.isAdmin ? '/admin' : '/');
    } catch (err) {
      setMsg(err.response?.data?.msg || 'Registration failed');
      setIsLoading(false);
    }
  };

  const getPasswordStrengthColor = () => {
    const colors = ['#ff4d4d', '#ff8c66', '#ffcc00', '#66cc66', '#00b300'];
    return passwordStrength > 0 ? colors[passwordStrength - 1] : '#e0e0e0';
  };

  return (
    <div className="register-container">
      <div className="register-card">
        <div className="register-header">
          <div className="logo">
            <FaExchangeAlt className="logo-icon" />
            <h1>SkillSwap</h1>
          </div>
          <h2>Create Your Account</h2>
          <p>Join our community of skill exchangers</p>
        </div>

        <form onSubmit={handleRegister} className="register-form">
          <div className="form-group">
            <div className="input-with-icon">
              <FaUser className="input-icon" />
              <input
                type="text"
                name="name"
                placeholder="Full Name"
                value={form.name}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <div className="input-with-icon">
              <FaEnvelope className="input-icon" />
              <input
                type="email"
                name="email"
                placeholder="Email Address"
                value={form.email}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <div className="input-with-icon">
              <FaLock className="input-icon" />
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Create Password"
                value={form.password}
                onChange={handleChange}
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

            <div className="password-strength">
              <div className="strength-bar">
                <div
                  className="strength-meter"
                  style={{
                    width: `${passwordStrength * 20}%`,
                    backgroundColor: getPasswordStrengthColor()
                  }}
                ></div>
              </div>
              <div className="strength-label">
                {passwordStrength === 0 && 'Password strength'}
                {passwordStrength === 1 && 'Weak'}
                {passwordStrength === 2 && 'Fair'}
                {passwordStrength === 3 && 'Medium'}
                {passwordStrength === 4 && 'Good'}
                {passwordStrength === 5 && 'Strong'}
              </div>
            </div>
          </div>

          <div className="form-group">
            <div className="input-with-icon">
              <FaLock className="input-icon" />
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                placeholder="Confirm Password"
                value={form.confirmPassword}
                onChange={handleChange}
                required
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>

          {msg && <div className="error-message">{msg}</div>}

          <button
            type="submit"
            className="register-btn"
            disabled={isLoading}
          >
            {isLoading ? <div className="spinner"></div> : 'Create Account'}
          </button>
        </form>

        <div className="login-link">
          Already have an account?
          <button type="button" onClick={() => navigate('/login')}>
            Sign in
          </button>
        </div>
      </div>

      <div className="register-graphics">
        <div className="graphic-element graphic-1"></div>
        <div className="graphic-element graphic-2"></div>
        <div className="graphic-element graphic-3"></div>
        <div className="graphic-element graphic-4"></div>
        <div className="graphic-text">
          <h3>Unlock Your Potential</h3>
          <p>Join thousands of users exchanging skills worldwide</p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
