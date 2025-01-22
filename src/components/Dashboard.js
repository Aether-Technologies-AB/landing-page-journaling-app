import React from 'react';
import { Navigate, Link } from 'react-router-dom';
import { useFirebase } from '../contexts/FirebaseContext';
import { FaBook, FaCamera, FaBaby, FaChartLine, FaCog, FaPlus, FaCrown, FaArrowRight } from 'react-icons/fa';
import STRIPE_CONFIG from '../config/stripe';
import './Dashboard.css';

const Dashboard = () => {
  const { user, userData } = useFirebase();

  if (!user) {
    return <Navigate to="/login" />;
  }

  // Get display name from user auth or userData
  const displayName = user?.displayName || userData?.displayName || 'Parent';

  // Get subscription details
  const subscription = userData?.subscription || { plan: 'none', status: 'inactive' };
  const currentPlan = STRIPE_CONFIG.plans[subscription.plan] || STRIPE_CONFIG.plans.basic;

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
        {/* Subscription Status Card */}
        <section className="dashboard-card subscription-status">
          <div className="subscription-header">
            <FaCrown className="subscription-icon" />
            <h2>Your Subscription</h2>
          </div>
          
          <div className="subscription-details">
            <h3>{currentPlan.name}</h3>
            <p className="subscription-status-text">
              Status: <span className={`status-badge ${subscription.status}`}>
                {subscription.status === 'active' ? 'Active' : 'Inactive'}
              </span>
            </p>
            <ul className="subscription-features">
              {currentPlan.features.slice(0, 3).map((feature, index) => (
                <li key={index}>{feature}</li>
              ))}
            </ul>
            <Link to="/pricing" className="upgrade-button">
              {subscription.plan === 'premium' 
                ? 'View Plans' 
                : 'Upgrade Plan'} 
              <FaArrowRight />
            </Link>
          </div>
        </section>

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
                <div className="milestone-icon">
                  <FaBaby />
                </div>
                <div className="milestone-details">
                  <h3>{milestone.title}</h3>
                  <p>{milestone.type}</p>
                  <small>{milestone.date}</small>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="dashboard-card stats">
          <h2>Quick Stats</h2>
          <div className="stats-grid">
            <div className="stat-item">
              <FaCamera className="stat-icon" />
              <div className="stat-details">
                <h3>Photos</h3>
                <p>24</p>
              </div>
            </div>
            <div className="stat-item">
              <FaBook className="stat-icon" />
              <div className="stat-details">
                <h3>Stories</h3>
                <p>12</p>
              </div>
            </div>
            <div className="stat-item">
              <FaBaby className="stat-icon" />
              <div className="stat-details">
                <h3>Milestones</h3>
                <p>8</p>
              </div>
            </div>
            <div className="stat-item">
              <FaChartLine className="stat-icon" />
              <div className="stat-details">
                <h3>Growth</h3>
                <p>6</p>
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
