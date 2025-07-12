import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../api/api';
import { FaStar, FaClock, FaExchangeAlt, FaHandshake, FaUser, FaArrowLeft } from 'react-icons/fa';
import './OtherUserProfile.css';

const OtherUserProfile = () => {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [currentUserId, setCurrentUserId] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [profileRes, meRes] = await Promise.all([
          API.get(`/users/${id}`),
          API.get('/users/me', {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
          }),
        ]);
        setUser(profileRes.data);
        setCurrentUserId(meRes.data._id);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  if (loading) {
    return (
      <div className="profile-loading">
        <div className="spinner"></div>
        <p>Loading profile...</p>
      </div>
    );
  }

  if (!user) return <div className="profile-error">Profile not found</div>;

  const isSelf = currentUserId === user._id;


  const getGradient = (id) => {
    const colors = [
      'linear-gradient(135deg, #4361ee, #3f37c9)',
      'linear-gradient(135deg, #f72585, #b5179e)',
      'linear-gradient(135deg, #4cc9f0, #4895ef)',
      'linear-gradient(135deg, #560bad, #7209b7)',
      'linear-gradient(135deg, #f15bb5, #9b5de5)',
    ];
    return colors[id.charCodeAt(0) % colors.length];
  };

  return (
    <div className="profile-container">
      <div className="profile-header">
        <button className="back-btn" onClick={() => navigate(-1)}>
          <FaArrowLeft /> Back
        </button>
        <h1>{user.name}'s Profile</h1>
      </div>
      
      <div className="profile-card">
        <div className="profile-banner" style={{ background: getGradient(user._id) }}>
          <div className="profile-avatar">
            {user.profilePhoto ? (
              <img
                src={`http://localhost:5000/${user.profilePhoto}`}
                alt={user.name}
              />
            ) : (
              <div className="avatar-placeholder">
                <FaUser />
              </div>
            )}
          </div>
        </div>
        
        <div className="profile-info">
          <div className="profile-meta">
            <div className="rating-badge">
              <FaStar className="star-icon" />
              <span>{user.rating?.toFixed(1) || 'N/A'}</span>
              <span className="rating-text">/5 rating</span>
            </div>
            
            <div className="availability">
              <FaClock className="clock-icon" />
              <span>{user.availability || 'Not specified'}</span>
            </div>
          </div>
          
          <div className="skills-section">
            <div className="section-header">
              <FaExchangeAlt className="section-icon" />
              <h3>Skills Offered</h3>
            </div>
            <div className="skills-grid">
              {user.skillsOffered.map((skill, index) => (
                <div key={index} className="skill-tag offered">
                  {skill}
                </div>
              ))}
              {user.skillsOffered.length === 0 && (
                <p className="no-skills">No skills offered yet</p>
              )}
            </div>
          </div>
          
          <div className="skills-section">
            <div className="section-header">
              <FaExchangeAlt className="section-icon" />
              <h3>Skills Wanted</h3>
            </div>
            <div className="skills-grid">
              {user.skillsWanted.map((skill, index) => (
                <div key={index} className="skill-tag wanted">
                  {skill}
                </div>
              ))}
              {user.skillsWanted.length === 0 && (
                <p className="no-skills">No skills wanted yet</p>
              )}
            </div>
          </div>
          
          {!isSelf ? (
            <button
              className="request-btn"
              onClick={() => navigate(`/swap-request/${user._id}`)}
            >
              <FaHandshake className="btn-icon" />
              Request Swap
            </button>
          ) : (
            <div className="self-profile-note">
              <p>This is your own profile. You cannot request a swap with yourself.</p>
              <button className="edit-profile-btn" onClick={() => navigate('/profile')}>
                Edit Your Profile
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OtherUserProfile;