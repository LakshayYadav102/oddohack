import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaExchangeAlt, FaUser, FaSignOutAlt } from 'react-icons/fa';
import './Navbar.css';

const Navbar = () => {
  const navigate = useNavigate();

  const isLoggedIn = localStorage.getItem('token');
  const isAdmin = localStorage.getItem('isAdmin') === 'true';
  const userName = localStorage.getItem('userName') || 'User';

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('isAdmin');
    localStorage.removeItem('userName');
    localStorage.removeItem('profilePic');
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <Link to="/" className="logo">
          <FaExchangeAlt className="logo-icon" />
          <span>SkillSwap</span>
        </Link>
      </div>

      <div className="navbar-center">
        <Link to="/" className="nav-link">
          <span>Home</span>
        </Link>
        {isLoggedIn && (
          <Link to="/swaps" className="nav-link">
            <span>Swap Request</span>
          </Link>
        )}
        {isLoggedIn && (
          <Link to="/profile" className="nav-link">
            <span>My Profile</span>
          </Link>
        )}
        {isAdmin && (
          <Link to="/admin" className="nav-link admin-link">
            <span>Admin Dashboard</span>
          </Link>
        )}
      </div>

      <div className="navbar-right">
        {isLoggedIn ? (
          <div className="user-dropdown">
            <div className="user-avatar">
              <FaUser className="avatar-icon" />
            </div>
            <div className="dropdown-content">
              <div className="user-info">
                <div className="avatar">
                  <FaUser className="avatar-icon" />
                </div>
                <div>
                  <div className="user-name">{userName}</div>
                  {isAdmin && <div className="admin-badge">Admin</div>}
                </div>
              </div>
              <div className="dropdown-divider"></div>
              <Link to="/profile" className="dropdown-item">
                <FaUser className="dropdown-icon" />
                <span>My Profile</span>
              </Link>
              <div className="dropdown-divider"></div>
              <button onClick={handleLogout} className="dropdown-item logout-btn">
                <FaSignOutAlt className="dropdown-icon" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        ) : (
          <Link to="/login" className="login-btn">
            Login
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;