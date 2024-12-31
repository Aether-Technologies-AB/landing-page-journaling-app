import React from 'react';
import { Navigate } from 'react-router-dom';
import './Dashboard.css';

const Dashboard = ({ user, isAuthenticated }) => {
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return (
    <div className="dashboard">
      <h1>Welcome, {user?.name}!</h1>
      <div className="dashboard-content">
        <section className="dashboard-section">
          <h2>Your Account</h2>
          <div className="account-info">
            <p><strong>Email:</strong> {user?.email}</p>
            <p><strong>Member Since:</strong> {new Date().toLocaleDateString()}</p>
          </div>
        </section>
        
        <section className="dashboard-section">
          <h2>Quick Actions</h2>
          <div className="quick-actions">
            <button className="dashboard-button">Record Story</button>
            <button className="dashboard-button">View Stories</button>
            <button className="dashboard-button">Settings</button>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Dashboard;
