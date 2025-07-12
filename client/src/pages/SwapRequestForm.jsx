import React, { useEffect, useState } from 'react';
import API from '../api/api';
import { useParams, useNavigate } from 'react-router-dom';
import { FaExchangeAlt, FaHandshake, FaUser, FaArrowLeft, FaEnvelope, FaCheckCircle } from 'react-icons/fa';
import './SwapRequestForm.css';

const SwapRequestForm = () => {
  const { id } = useParams(); 
  const navigate = useNavigate();
  const [targetUser, setTargetUser] = useState(null);
  const [myProfile, setMyProfile] = useState(null);
  const [requestedSkill, setRequestedSkill] = useState('');
  const [offeredSkill, setOfferedSkill] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [validOfferedSkills, setValidOfferedSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const fetchProfiles = async () => {
      try {
        setLoading(true);
        const [targetRes, myRes] = await Promise.all([
          API.get(`/users/${id}`),
          API.get('/users/me', {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
          }),
        ]);
        setTargetUser(targetRes.data);
        setMyProfile(myRes.data);
        setLoading(false);
      } catch (err) {
        setError('Error fetching user profiles');
        console.error(err);
        setLoading(false);
      }
    };
    fetchProfiles();
  }, [id]);

  useEffect(() => {
    if (targetUser && myProfile) {
      const matching = myProfile.skillsOffered.filter(skill =>
        targetUser.skillsWanted.includes(skill)
      );
      setValidOfferedSkills(matching);
    }
  }, [targetUser, myProfile]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post('/swaps', {
        toUser: id,
        requestedSkill,
        offeredSkill,
        message,
      }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });

      setSuccess(true);
      setTimeout(() => {
        navigate('/');
      }, 2000);
    } catch (err) {
      setError("Failed to send request.");
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="swap-form-loading">
        <div className="spinner"></div>
        <p>Loading user details...</p>
      </div>
    );
  }

  if (success) {
    return (
      <div className="swap-success-container">
        <div className="swap-success-card">
          <FaCheckCircle className="success-icon" />
          <h2>Swap Request Sent!</h2>
          <p>Your request has been successfully sent to {targetUser.name}</p>
          <p>You'll be redirected to the homepage shortly...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="swap-request-container">
      <button className="back-btn" onClick={() => navigate(-1)}>
        <FaArrowLeft /> Back
      </button>
      
      <div className="swap-request-card">
        <div className="card-header">
          <div className="user-info">
            <div className="avatar">
              {targetUser?.profilePhoto ? (
                <img
                  src={`http://localhost:5000/${targetUser.profilePhoto}`}
                  alt={targetUser.name}
                />
              ) : (
                <FaUser />
              )}
            </div>
            <div className="names">
              <div className="from-to">
                <span className="from">{myProfile?.name}</span>
                <FaExchangeAlt className="exchange-icon" />
                <span className="to">{targetUser?.name}</span>
              </div>
              <h2>Request Skill Swap</h2>
            </div>
          </div>
        </div>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>
              <FaExchangeAlt className="input-icon" />
              What skill do you want from {targetUser?.name}?
            </label>
            <select
              value={requestedSkill}
              onChange={(e) => setRequestedSkill(e.target.value)}
              required
              className="form-select"
            >
              <option value="">Select their skill</option>
              {targetUser?.skillsOffered.map((skill, idx) => (
                <option key={idx} value={skill}>{skill}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>
              <FaExchangeAlt className="input-icon" />
              What will you offer in return?
            </label>
            <select
              value={offeredSkill}
              onChange={(e) => setOfferedSkill(e.target.value)}
              required
              className="form-select"
              disabled={validOfferedSkills.length === 0}
            >
              <option value="">Select your skill</option>
              {validOfferedSkills.length > 0 ? (
                validOfferedSkills.map((skill, idx) => (
                  <option key={idx} value={skill}>{skill}</option>
                ))
              ) : (
                <option disabled>No matching skills available</option>
              )}
            </select>
            {validOfferedSkills.length === 0 && (
              <div className="no-skills-warning">
                <p>You don't have any skills that {targetUser?.name} wants.</p>
                <p>Update your profile to add matching skills.</p>
              </div>
            )}
          </div>

          <div className="form-group">
            <label>
              <FaEnvelope className="input-icon" />
              Message (optional)
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder={`Write a message to ${targetUser?.name}...`}
              rows="4"
              className="form-textarea"
            />
          </div>

          <button 
            type="submit" 
            className="submit-btn"
            disabled={validOfferedSkills.length === 0}
          >
            <FaHandshake className="btn-icon" />
            Send Swap Request
          </button>
        </form>
      </div>
    </div>
  );
};

export default SwapRequestForm;