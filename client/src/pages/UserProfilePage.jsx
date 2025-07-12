import React, { useState, useEffect } from 'react';
import { FaClock } from 'react-icons/fa';
import API from '../api/api';
import { useNavigate } from 'react-router-dom';
import { FaUser, FaSave, FaUndo, FaUpload, FaTrash, FaLightbulb, FaGlobe, FaLock } from 'react-icons/fa';
import './ProfilePage.css';

const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const [skillsOffered, setSkillsOffered] = useState('');
  const [skillsWanted, setSkillsWanted] = useState('');
  const [photoFile, setPhotoFile] = useState(null);
  const [msg, setMsg] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [photoPreview, setPhotoPreview] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setIsLoading(true);
        const res = await API.get('/users/me');
        setUser(res.data);
        setSkillsOffered(res.data.skillsOffered.join(', '));
        setSkillsWanted(res.data.skillsWanted.join(', '));
        setIsLoading(false);
      } catch (err) {
        setMsg('Failed to load profile');
        setIsLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleInputChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    try {
      const updated = {
        ...user,
        skillsOffered: skillsOffered.split(',').map(s => s.trim()),
        skillsWanted: skillsWanted.split(',').map(s => s.trim())
      };
      const res = await API.put('/users/me', updated);
      setMsg('Profile updated successfully!');
      setUser(res.data);
    } catch (err) {
      setMsg('Update failed. Please try again.');
    }
  };

  const handlePhotoUpload = async () => {
    try {
      const formData = new FormData();
      formData.append('profilePhoto', photoFile);
      const res = await API.post('/users/upload-photo', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setUser(res.data.user);
      setMsg('Photo uploaded successfully!');
      setPhotoFile(null);
      setPhotoPreview(null);
    } catch (err) {
      setMsg('Photo upload failed. Please try again.');
    }
  };

  const handleRemovePhoto = async () => {
    try {
      const res = await API.put('/users/me', { profilePhoto: '' });
      setUser(res.data);
      setMsg('Photo removed successfully!');
    } catch (err) {
      setMsg('Failed to remove photo. Please try again.');
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setPhotoFile(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setPhotoPreview(null);
    }
  };

  if (isLoading) {
    return (
      <div className="profile-loading">
        <div className="spinner"></div>
        <p>Loading your profile...</p>
      </div>
    );
  }

  return (
    <div className="profile-container">
      <div className="profile-header">
        <h1><FaUser className="header-icon" /> My Profile</h1>
        <p>Manage your personal information and skill preferences</p>
      </div>

      <div className="profile-layout">
        {/* Left - Profile Photo Section */}
        <div className="profile-photo-section">
          <div className="photo-container">
            <div className="photo-wrapper">
              {photoPreview ? (
                <img src={photoPreview} alt="Preview" className="profile-photo" />
              ) : user.profilePhoto ? (
                <img 
                  src={`http://localhost:5000/${user.profilePhoto}`} 
                  alt="Profile" 
                  className="profile-photo" 
                />
              ) : (
                <div className="avatar-placeholder">
                  <FaUser />
                </div>
              )}
            </div>
            
            <div className="photo-actions">
              <label className="file-upload-btn">
                <FaUpload className="icon" /> Upload Photo
                <input 
                  type="file" 
                  onChange={handleFileChange} 
                  accept="image/*"
                  style={{ display: 'none' }}
                />
              </label>
              
              <button 
                onClick={handleRemovePhoto} 
                className="remove-photo-btn"
                disabled={!user.profilePhoto}
              >
                <FaTrash className="icon" /> Remove
              </button>
            </div>
            
            {photoFile && (
              <div className="upload-prompt">
                <p>New photo selected: {photoFile.name}</p>
                <button onClick={handlePhotoUpload} className="upload-confirm-btn">
                  <FaUpload className="icon" /> Confirm Upload
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Right - Profile Form */}
        <div className="profile-form">
          <div className="form-section">
            <h3><FaUser className="section-icon" /> Personal Information</h3>
            <div className="form-group">
              <label>Full Name</label>
              <input 
                name="name" 
                value={user.name} 
                onChange={handleInputChange} 
                placeholder="Enter your full name"
              />
            </div>
            
            <div className="form-group">
              <label>Location</label>
              <input 
                name="location" 
                value={user.location || ''} 
                onChange={handleInputChange} 
                placeholder="City, Country"
              />
            </div>
          </div>
          
          <div className="form-section">
            <h3><FaLightbulb className="section-icon" /> Skills</h3>
            <div className="form-group">
              <label>Skills I Offer (comma separated)</label>
              <textarea 
                value={skillsOffered} 
                onChange={(e) => setSkillsOffered(e.target.value)} 
                placeholder="e.g., Graphic Design, Web Development, Photography"
                rows="3"
              />
            </div>
            
            <div className="form-group">
              <label>Skills I Want (comma separated)</label>
              <textarea 
                value={skillsWanted} 
                onChange={(e) => setSkillsWanted(e.target.value)} 
                placeholder="e.g., Spanish Lessons, Cooking, Digital Marketing"
                rows="3"
              />
            </div>
          </div>
          
          <div className="form-section">
            <h3><FaClock className="section-icon" /> Availability & Privacy</h3>
            <div className="form-group">
              <label>Availability</label>
              <select name="availability" value={user.availability} onChange={handleInputChange}>
                <option value="">-- Select Availability --</option>
                <option value="weekdays">Weekdays</option>
                <option value="weekends">Weekends</option>
                <option value="evenings">Evenings</option>
              </select>
            </div>
            
            <div className="form-group">
              <label>Profile Visibility</label>
              <div className="visibility-toggle">
                <button 
                  type="button"
                  className={`toggle-option ${user.isPublic ? 'active' : ''}`}
                  onClick={() => setUser({ ...user, isPublic: true })}
                >
                  <FaGlobe /> Public
                </button>
                <button 
                  type="button"
                  className={`toggle-option ${!user.isPublic ? 'active' : ''}`}
                  onClick={() => setUser({ ...user, isPublic: false })}
                >
                  <FaLock /> Private
                </button>
              </div>
              <div className="visibility-info">
                {user.isPublic 
                  ? "Your profile is visible to all users" 
                  : "Your profile is only visible to you"}
              </div>
            </div>
          </div>
          
          <div className="form-actions">
            <button onClick={handleSave} className="save-btn">
              <FaSave /> Save Profile
            </button>
            <button onClick={() => navigate('/')} className="discard-btn">
              <FaUndo /> Discard Changes
            </button>
          </div>
          
          {msg && (
            <div className={`message ${msg.includes('success') ? 'success' : 'error'}`}>
              {msg}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;