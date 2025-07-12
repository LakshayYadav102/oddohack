import React, { useEffect, useState } from 'react';
import API from '../api/api';
import { FaExchangeAlt, FaFilter, FaUser, FaClock, FaStar, FaCheck, FaTimes, FaTrash } from 'react-icons/fa';
import './SwapManagementPage.css';

const SwapManagementPage = () => {
  const [swaps, setSwaps] = useState([]);
  const [filter, setFilter] = useState('All');
  const [msg, setMsg] = useState('');
  const [currentUserId, setCurrentUserId] = useState(localStorage.getItem('userId'));
  const [loading, setLoading] = useState(true);

  const fetchSwaps = async () => {
    try {
      setLoading(true);
      const res = await API.get('/swaps', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setSwaps(res.data.swaps);
      setCurrentUserId(res.data.userId); 
      setLoading(false);
    } catch (err) {
      setMsg('Error fetching swaps');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSwaps();
  }, []);

  const handleAction = async (id, action) => {
    try {
      await API.put(`/swaps/${id}`, { status: action }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      fetchSwaps();
    } catch (err) {
      setMsg('Action failed');
    }
  };

  const handleDelete = async (id) => {
    try {
      await API.delete(`/swaps/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      fetchSwaps();
    } catch (err) {
      setMsg('Delete failed');
    }
  };

  const handleRate = async (swapId, rating) => {
    try {
      await API.post('/swaps/rate', {
        swapId,
        rating: Number(rating)
      }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      alert('Rating submitted!');
      fetchSwaps();
    } catch (err) {
      alert('Rating failed');
    }
  };

  const filteredSwaps = swaps.filter((swap) => {
    if (filter === 'All') return true;
    return swap.status === filter;
  });

  // Function to get status color
  const getStatusColor = (status) => {
    switch(status) {
      case 'Accepted': return '#4CAF50';
      case 'Rejected': return '#F44336';
      case 'Pending': return '#FFC107';
      default: return '#9E9E9E';
    }
  };

  return (
    <div className="swap-management-container">
      <div className="swap-header">
        <div className="title-section">
          <FaExchangeAlt className="header-icon" />
          <h1>Swap Management</h1>
        </div>
        <p>Manage your skill exchange requests and track their status</p>
      </div>

      <div className="filters-container">
        <div className="filter-box">
          <FaFilter className="filter-icon" />
          <select 
            value={filter} 
            onChange={(e) => setFilter(e.target.value)}
            className="filter-select"
          >
            <option value="All">All Swaps</option>
            <option value="Pending">Pending</option>
            <option value="Accepted">Accepted</option>
            <option value="Rejected">Rejected</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading your swap requests...</p>
        </div>
      ) : (
        <div className="swap-list">
          {filteredSwaps.length === 0 ? (
            <div className="no-swaps">
              <div className="no-swaps-icon">🔍</div>
              <h3>No swap requests found</h3>
              <p>Try changing your filter or create new swap requests</p>
            </div>
          ) : (
            filteredSwaps.map((swap) => {
              const isIncoming = swap.toUser._id === currentUserId;
              const isOutgoing = swap.fromUser._id === currentUserId;
              const showRating =
                isOutgoing && swap.status === 'Accepted' && !swap.rated;

              return (
                <div key={swap._id} className={`swap-card ${isIncoming ? 'incoming' : 'outgoing'}`}>
                  <div className="card-header">
                    <div className="user-info">
                      <div className="avatar">
                        <FaUser />
                      </div>
                      <div className="names">
                        <div className="from-to">
                          <span className="from">{swap.fromUser.name}</span>
                          <FaExchangeAlt className="exchange-icon" />
                          <span className="to">{swap.toUser.name}</span>
                        </div>
                        <div className="swap-role">
                          <span className="role-badge">
                            {isIncoming ? 'Receiver' : 'Sender'}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="status-badge" style={{ backgroundColor: getStatusColor(swap.status) }}>
                      {swap.status}
                    </div>
                  </div>
                  
                  <div className="card-body">
                    <div className="skills-section">
                      <div className="skill-item">
                        <div className="skill-label">They offer:</div>
                        <div className="skill-value">{swap.offeredSkill}</div>
                      </div>
                      <div className="skill-item">
                        <div className="skill-label">You get:</div>
                        <div className="skill-value">{swap.requestedSkill}</div>
                      </div>
                    </div>
                    
                    <div className="date-section">
                      <FaClock className="clock-icon" />
                      <span>Requested on: {new Date(swap.createdAt).toLocaleDateString()}</span>
                    </div>
                    
                    {isIncoming && swap.status === 'Pending' && (
                      <div className="action-buttons">
                        <button 
                          className="btn accept-btn"
                          onClick={() => handleAction(swap._id, 'Accepted')}
                        >
                          <FaCheck /> Accept
                        </button>
                        <button 
                          className="btn reject-btn"
                          onClick={() => handleAction(swap._id, 'Rejected')}
                        >
                          <FaTimes /> Reject
                        </button>
                      </div>
                    )}
                    
                    {isOutgoing && swap.status === 'Pending' && (
                      <div className="waiting-message">
                        <p>Waiting for response from <strong>{swap.toUser.name}</strong></p>
                        <button 
                          className="btn delete-btn"
                          onClick={() => handleDelete(swap._id)}
                        >
                          <FaTrash /> Delete Request
                        </button>
                      </div>
                    )}
                    
                    {showRating && (
                      <div className="rating-section">
                        <div className="rating-prompt">
                          <FaStar className="star-icon" />
                          <span>Rate your experience with {swap.toUser.name}</span>
                        </div>
                        <div className="rating-stars">
                          {[1, 2, 3, 4, 5].map((r) => (
                            <button 
                              key={r} 
                              className="star-btn"
                              onClick={() => handleRate(swap._id, r)}
                            >
                              <FaStar className={`star ${r <= (swap.rating || 0) ? 'filled' : ''}`} />
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {msg && <div className="error-message">{msg}</div>}
    </div>
  );
};

export default SwapManagementPage;