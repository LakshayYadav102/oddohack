import React, { useEffect, useState } from 'react';
import API from '../api/api';
import { useNavigate } from 'react-router-dom';
import { FaSearch, FaStar, FaClock, FaHandshake, FaExchangeAlt, FaFilter, FaUser } from 'react-icons/fa';
import './HomePage.css';

const HomePage = () => {
  const [profiles, setProfiles] = useState([]);
  const [availability, setAvailability] = useState('');
  const [skill, setSkill] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const token = localStorage.getItem('token');

  const fetchProfiles = async () => {
    try {
      setLoading(true);
      const res = await API.get(`/users/public`, {
        params: { availability, skill, page }
      });

      const filtered = res.data.profiles.filter(
        (user) => user.isPublic && !user.isAdmin
      );

      setProfiles(filtered);
      setTotalPages(res.data.totalPages);
      setLoading(false);
    } catch (err) {
      console.log(err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfiles();
  }, [availability, skill, page]);

  // Function to generate gradient based on user ID
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
    <div className="home-container">
      {/* Header */}
      <header className="home-header">
        <div className="logo">
          <FaExchangeAlt className="logo-icon" />
          <h1>SkillSwap</h1>
        </div>
        <div className="user-controls">
          <div className="filter-dropdown">
            <FaFilter className="filter-icon" />
            <select 
              onChange={(e) => setAvailability(e.target.value)} 
              value={availability}
            >
              <option value="">All Availability</option>
              <option value="weekends">Weekends</option>
              <option value="evenings">Evenings</option>
              <option value="weekdays">Weekdays</option>
            </select>
          </div>
          <div className="avatar">
            <FaUser />
          </div>
        </div>
      </header>

      {/* Page Title */}
      <div className="page-title">
        <h2>Find Skill Partners</h2>
        <p>Connect with talented individuals and exchange your skills</p>
      </div>

      {/* Search and Filters */}
      <div className="search-filter-container">
        <div className="search-box">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search by skill (e.g. Photoshop, Excel)"
            value={skill}
            onChange={(e) => setSkill(e.target.value)}
          />
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Finding skilled partners...</p>
        </div>
      )}

      {/* Profile Cards */}
      {!loading && profiles.length > 0 && (
        <div className="cards-grid">
          {profiles.map((user) => (
            <div className="card" key={user._id}>
              <div 
                className="card-header" 
                style={{ background: getGradient(user._id) }}
              >
                <div className="profile-img">
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
              
              <div className="card-body">
                <div className="card-title">
                  <h3>{user.name}</h3>
                  {user.location && <div className="location">{user.location}</div>}
                </div>
                
                <div className="skills-section">
                  <div className="section-title">Offered Skills</div>
                  <div className="skills-list">
                    {user.skillsOffered.slice(0, 3).map((skill, index) => (
                      <span key={index} className="skill-tag">{skill}</span>
                    ))}
                    {user.skillsOffered.length > 3 && (
                      <span className="skill-tag">+{user.skillsOffered.length - 3} more</span>
                    )}
                  </div>
                </div>
                
                <div className="skills-section">
                  <div className="section-title">Wanted Skills</div>
                  <div className="skills-list">
                    {user.skillsWanted.slice(0, 3).map((skill, index) => (
                      <span key={index} className="skill-tag wanted">{skill}</span>
                    ))}
                    {user.skillsWanted.length > 3 && (
                      <span className="skill-tag wanted">+{user.skillsWanted.length - 3} more</span>
                    )}
                  </div>
                </div>
                
                <div className="availability">
                  <FaClock className="clock-icon" />
                  <span>{user.availability}</span>
                </div>
                
                <div className="rating">
                  <FaStar className="star-icon" />
                  <span>{user.rating?.toFixed(1) || 'N/A'}/5</span>
                  <span className="reviews">({user.reviewCount || 0} reviews)</span>
                </div>
              </div>
              
              <div className="card-footer">
                {token ? (
                  <button 
                    className="btn btn-primary"
                    onClick={() => navigate(`/profile/${user._id}`)}
                  >
                    <FaHandshake className="btn-icon" />
                    Request Swap
                  </button>
                ) : (
                  <button 
                    className="btn btn-login"
                    onClick={() => navigate('/login')}
                  >
                    Login to Request
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* No Results */}
      {!loading && profiles.length === 0 && (
        <div className="no-results">
          <div className="no-results-icon">🔍</div>
          <h3>No matching profiles found</h3>
          <p>Try adjusting your search filters</p>
        </div>
      )}

      {/* Pagination */}
      {!loading && profiles.length > 0 && totalPages > 1 && (
        <div className="pagination">
          <button 
            className={`pagination-btn ${page === 1 ? 'disabled' : ''}`}
            onClick={() => setPage(prev => Math.max(1, prev - 1))}
            disabled={page === 1}
          >
            &lt;
          </button>
          
          {[...Array(Math.min(5, totalPages)).keys()].map((n) => {
            const pageNum = n + 1;
            return (
              <button
                key={pageNum}
                onClick={() => setPage(pageNum)}
                className={`pagination-btn ${page === pageNum ? 'active' : ''}`}
              >
                {pageNum}
              </button>
            );
          })}
          
          {totalPages > 5 && (
            <span className="pagination-ellipsis">...</span>
          )}
          
          <button 
            className={`pagination-btn ${page === totalPages ? 'disabled' : ''}`}
            onClick={() => setPage(prev => Math.min(totalPages, prev + 1))}
            disabled={page === totalPages}
          >
            &gt;
          </button>
        </div>
      )}
    </div>
  );
};

export default HomePage;