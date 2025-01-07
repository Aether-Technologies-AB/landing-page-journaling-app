import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useFirebase } from '../contexts/FirebaseContext';
import './Header.css';

const Header = () => {
  const navigate = useNavigate();
  const { user, logout } = useFirebase();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <header className="header">
      <div className="header-content">
        <Link to="/" className="logo">
          ChildStory
        </Link>
        
        <nav className="nav-links">
          {user ? (
            <>
              <Link to="/dashboard">Dashboard</Link>
              <Link to="/pricing">Pricing</Link>
              <div className="user-menu">
                <span className="user-name">{user.displayName || 'User'}</span>
                <button onClick={handleLogout} className="logout-button">
                  Logout
                </button>
              </div>
            </>
          ) : (
            <>
              <Link to="/pricing">Pricing</Link>
              <Link to="/login" className="auth-link">Login</Link>
              <Link to="/register" className="auth-link highlight">
                Get Started
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
