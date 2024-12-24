import React from 'react';
import { Link } from 'react-router-dom';

const Header = ({ user, onLogout }) => {
  return (
    <header className="app-header">
      <div className="header-content">
        <Link to="/" className="logo">
          <h1>ChildStory</h1>
        </Link>
        <nav className="nav-links">
          {user ? (
            <div className="user-section">
              <span>Welcome, {user.name}</span>
              <button className="logout-button" onClick={onLogout}>Logout</button>
            </div>
          ) : (
            <div className="auth-links">
              <Link to="/login" className="auth-link">Login</Link>
              <Link to="/register" className="auth-button">Get Started</Link>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
