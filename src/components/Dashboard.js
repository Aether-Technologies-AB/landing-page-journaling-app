import React from 'react';
import { Navigate } from 'react-router-dom';
import { useFirebase } from '../contexts/FirebaseContext';
import { FaBook, FaCamera, FaBaby, FaChartLine, FaCog, FaPlus } from 'react-icons/fa';
import './Dashboard.css';

const Dashboard = () => {
  const { user, userData } = useFirebase();

  if (!user) {
    return <Navigate to="/login" />;
  }

  // Get display name from user auth or userData
  const displayName = user?.displayName || userData?.displayName || 'Parent';

  const recentMilestones = [
    { date: '2025-01-08', title: 'First Steps', type: 'Movement' },
    { date: '2025-01-05', title: 'First Word: Mama', type: 'Speech' },
    { date: '2025-01-01', title: 'Started Crawling', type: 'Movement' },
  ];

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Welcome, {displayName}!</h1>
        <p className="last-login">Last login: {new Date().toLocaleDateString()}</p>
      </div>

      <div className="dashboard-grid">
        <section className="dashboard-card quick-add">
          <h2>Quick Add</h2>
          <div className="quick-add-buttons">
            <button className="quick-add-btn">
              <FaCamera />
              <span>Photo</span>
            </button>
            <button className="quick-add-btn">
              <FaBook />
              <span>Story</span>
            </button>
            <button className="quick-add-btn">
              <FaBaby />
              <span>Milestone</span>
            </button>
          </div>
        </section>

        <section className="dashboard-card recent-activity">
          <h2>Recent Milestones</h2>
          <div className="milestone-list">
            {recentMilestones.map((milestone, index) => (
              <div key={index} className="milestone-item">
                <div className="milestone-date">{milestone.date}</div>
                <div className="milestone-info">
                  <h3>{milestone.title}</h3>
                  <span className="milestone-type">{milestone.type}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="dashboard-card stats">
          <h2>Statistics</h2>
          <div className="stats-grid">
            <div className="stat-item">
              <FaCamera className="stat-icon" />
              <div className="stat-info">
                <span className="stat-value">24</span>
                <span className="stat-label">Photos</span>
              </div>
            </div>
            <div className="stat-item">
              <FaBook className="stat-icon" />
              <div className="stat-info">
                <span className="stat-value">12</span>
                <span className="stat-label">Stories</span>
              </div>
            </div>
            <div className="stat-item">
              <FaBaby className="stat-icon" />
              <div className="stat-info">
                <span className="stat-value">8</span>
                <span className="stat-label">Milestones</span>
              </div>
            </div>
          </div>
        </section>

        <section className="dashboard-card quick-links">
          <h2>Quick Links</h2>
          <div className="quick-links-grid">
            <button className="quick-link-btn">
              <FaChartLine />
              <span>Growth Charts</span>
            </button>
            <button className="quick-link-btn">
              <FaPlus />
              <span>Add Child</span>
            </button>
            <button className="quick-link-btn">
              <FaCog />
              <span>Settings</span>
            </button>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Dashboard;
