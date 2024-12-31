import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import Header from './components/Header';
import LandingPage from './components/LandingPage';
import Login from './components/Login';
import Register from './components/Register';
import PricingPlans from './components/PricingPlans';
import Dashboard from './components/Dashboard'; 
import './App.css';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Check if user is logged in on component mount
    const token = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');
    if (token && savedUser) {
      setIsAuthenticated(true);
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const handleLogin = (userData) => {
    setIsAuthenticated(true);
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsAuthenticated(false);
    setUser(null);
  };

  const handleRegister = (userData) => {
    setIsAuthenticated(true);
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  return (
    <Router>
      <div className="app">
        <Header 
          isAuthenticated={isAuthenticated} 
          onLogout={handleLogout}
          user={user}
        />
        <main>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route 
              path="/login" 
              element={
                <Login 
                  onLogin={handleLogin} 
                  isAuthenticated={isAuthenticated}
                />
              } 
            />
            <Route 
              path="/register" 
              element={
                <Register 
                  onRegister={handleRegister}
                  isAuthenticated={isAuthenticated}
                />
              } 
            />
            <Route 
              path="/dashboard" 
              element={
                <Dashboard 
                  user={user}
                  isAuthenticated={isAuthenticated}
                />
              } 
            />
            <Route path="/pricing" element={<PricingPlans />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
