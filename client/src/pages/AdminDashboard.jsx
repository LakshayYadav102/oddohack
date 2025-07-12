import React, { useEffect, useState } from 'react';
import { FaUser } from 'react-icons/fa';
import API from '../api/api';
import { FaChartBar, FaBullhorn, FaExchangeAlt, FaBan, FaTrash, FaUserSlash, FaFileDownload, FaCog, FaUsers, FaHandshake } from 'react-icons/fa';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const [swaps, setSwaps] = useState([]);
  const [report, setReport] = useState({});
  const [message, setMessage] = useState('');
  const [alert, setAlert] = useState({ message: '', type: '' });
  const [banEmail, setBanEmail] = useState('');
  const [rejectData, setRejectData] = useState({
    email: '',
    userId: '',
    skillType: '',
    skillName: '',
    offeredSkills: [],
    wantedSkills: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReports();
    fetchSwaps();
  }, []);

  const fetchReports = async () => {
    try {
      const res = await API.get('/admin/reports', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setReport(res.data);
      setLoading(false);
    } catch {
      setAlert({ message: 'Failed to load reports', type: 'error' });
      setLoading(false);
    }
  };

  const fetchSwaps = async () => {
    try {
      const res = await API.get('/admin/swaps', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setSwaps(res.data);
    } catch {
      setAlert({ message: 'Failed to load swaps', type: 'error' });
    }
  };

  const handleBanByEmail = async () => {
    try {
      await API.put('/admin/ban-email', { email: banEmail }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setAlert({ message: 'User banned by email', type: 'success' });
      setBanEmail('');
    } catch {
      setAlert({ message: 'Ban by email failed', type: 'error' });
    }
  };

  const handleSendMessage = async () => {
    try {
      await API.post('/admin/alert', { message }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setAlert({ message: 'Announcement sent!', type: 'success' });
      setMessage('');
    } catch {
      setAlert({ message: 'Failed to send announcement', type: 'error' });
    }
  };

  const downloadReportCSV = () => {
    const csv = `Metric,Value
Total Users,${report.totalUsers || 0}
Total Swaps,${report.totalSwaps || 0}
Accepted,${report.accepted || 0}
Rejected,${report.rejected || 0}
Pending,${report.pending || 0}`;

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'swap_report.csv';
    a.click();
  };

  const handleRejectSkill = async () => {
    const { userId, skillType, skillName } = rejectData;

    try {
      await API.put('/admin/reject-skill', { userId, skillType, skillName }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setAlert({ message: 'Skill removed successfully', type: 'success' });
      setRejectData({
        email: '',
        userId: '',
        skillType: '',
        skillName: '',
        offeredSkills: [],
        wantedSkills: []
      });
    } catch {
      setAlert({ message: 'Skill removal failed', type: 'error' });
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'Accepted': return '#4CAF50';
      case 'Rejected': return '#F44336';
      case 'Pending': return '#FFC107';
      default: return '#9E9E9E';
    }
  };

  return (
    <div className="admin-dashboard">
      <div className="admin-header">
        <div className="header-content">
          <FaCog className="header-icon" />
          <h1>Admin Dashboard</h1>
          <p>Manage platform users, swaps, and content</p>
        </div>
      </div>

      {alert.message && (
        <div className={`alert alert-${alert.type}`}>
          {alert.message}
        </div>
      )}

      {loading ? (
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading admin data...</p>
        </div>
      ) : (
        <div className="dashboard-grid">
          {/* Platform Stats */}
          <div className="dashboard-card stats-card">
            <div className="card-header">
              <FaChartBar className="card-icon" />
              <h2>Platform Statistics</h2>
              <button onClick={downloadReportCSV} className="download-btn">
                <FaFileDownload /> Download Report
              </button>
            </div>
            
            <div className="stats-grid">
              <div className="stat-item">
                <div className="stat-value">{report.totalUsers || 0}</div>
                <div className="stat-label">Total Users</div>
              </div>
              
              <div className="stat-item">
                <div className="stat-value">{report.totalSwaps || 0}</div>
                <div className="stat-label">Total Swaps</div>
              </div>
              
              <div className="stat-item">
                <div className="stat-value">{report.accepted || 0}</div>
                <div className="stat-label">Accepted</div>
              </div>
              
              <div className="stat-item">
                <div className="stat-value">{report.rejected || 0}</div>
                <div className="stat-label">Rejected</div>
              </div>
              
              <div className="stat-item">
                <div className="stat-value">{report.pending || 0}</div>
                <div className="stat-label">Pending</div>
              </div>
            </div>
          </div>

          {/* Announcement */}
          <div className="dashboard-card announcement-card">
            <div className="card-header">
              <FaBullhorn className="card-icon" />
              <h2>Platform Announcement</h2>
            </div>
            
            <div className="form-group">
              <label>Message to all users</label>
              <textarea
                rows="3"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Write your global message..."
              />
            </div>
            
            <button onClick={handleSendMessage} className="send-btn">
              <FaBullhorn /> Send Announcement
            </button>
          </div>

          {/* Ban User */}
          <div className="dashboard-card ban-card">
            <div className="card-header">
              <FaBan className="card-icon" />
              <h2>Ban User</h2>
            </div>
            
            <div className="form-group">
              <label>Enter user email to ban</label>
              <input
                type="email"
                placeholder="user@example.com"
                value={banEmail}
                onChange={(e) => setBanEmail(e.target.value)}
                className="ban-email-input"
              />
            </div>
            
            <button onClick={handleBanByEmail} className="ban-btn">
              <FaUserSlash /> Ban User
            </button>
          </div>

          {/* Remove Skill */}
          <div className="dashboard-card skill-card">
            <div className="card-header">
              <FaTrash className="card-icon" />
              <h2>Remove Inappropriate Skill</h2>
            </div>
            
            <div className="form-group">
              <label>Enter user email</label>
              <input
                type="email"
                placeholder="user@example.com"
                value={rejectData.email || ''}
                onChange={async (e) => {
                  const email = e.target.value;
                  setRejectData({ email }); // Reset first

                  try {
                    const res = await API.get('/admin/user-skills', {
                      params: { email },
                      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
                    });

                    setRejectData({
                      email,
                      userId: res.data.userId,
                      skillType: '',
                      skillName: '',
                      offeredSkills: res.data.skillsOffered,
                      wantedSkills: res.data.skillsWanted
                    });

                  } catch {
                    setAlert({ message: 'Failed to fetch user skills', type: 'error' });
                  }
                }}
              />
            </div>
            
            {rejectData.userId && (
              <>
                <div className="form-group">
                  <label>Skill Type</label>
                  <select
                    value={rejectData.skillType}
                    onChange={(e) => setRejectData({ ...rejectData, skillType: e.target.value, skillName: '' })}
                  >
                    <option value="">Select skill type</option>
                    <option value="offered">Offered Skills</option>
                    <option value="wanted">Wanted Skills</option>
                  </select>
                </div>

                {rejectData.skillType && (
                  <div className="form-group">
                    <label>Select skill to remove</label>
                    <select
                      value={rejectData.skillName}
                      onChange={(e) => setRejectData({ ...rejectData, skillName: e.target.value })}
                    >
                      <option value="">Select a skill</option>
                      {(rejectData.skillType === 'offered'
                        ? rejectData.offeredSkills
                        : rejectData.wantedSkills
                      ).map((skill, i) => (
                        <option key={i} value={skill}>
                          {skill}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {rejectData.skillName && (
                  <button onClick={handleRejectSkill} className="remove-btn">
                    <FaTrash /> Remove Skill
                  </button>
                )}
              </>
            )}
          </div>

          {/* All Swaps */}
          <div className="dashboard-card swaps-card">
            <div className="card-header">
              <FaExchangeAlt className="card-icon" />
              <h2>All Swaps</h2>
            </div>
            
            <div className="swaps-list">
              {swaps.length === 0 ? (
                <div className="no-swaps">
                  <FaHandshake className="no-swaps-icon" />
                  <p>No swaps recorded yet</p>
                </div>
              ) : (
                swaps.map((swap) => (
                  <div key={swap._id} className="swap-item">
                    <div className="swap-users">
                      <div className="user-from">
                        <div className="avatar">
                          <FaUser />
                        </div>
                        <div className="user-info">
                          <div className="user-name">{swap.fromUser.name}</div>
                          <div className="skill-offered">{swap.offeredSkill}</div>
                        </div>
                      </div>
                      
                      <FaExchangeAlt className="exchange-icon" />
                      
                      <div className="user-to">
                        <div className="avatar">
                          <FaUser />
                        </div>
                        <div className="user-info">
                          <div className="user-name">{swap.toUser.name}</div>
                          <div className="skill-requested">{swap.requestedSkill}</div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="swap-status" style={{ backgroundColor: getStatusColor(swap.status) }}>
                      {swap.status}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;