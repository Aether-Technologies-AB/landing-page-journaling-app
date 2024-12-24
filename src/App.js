import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import './App.css';
import Header from './components/Header';
import LandingPage from './components/LandingPage';
import Login from './components/Login';
import Register from './components/Register';
import AuthSection from './components/AuthSection';

// Make sure to use the key directly from the environment variable
const stripePromise = loadStripe('pk_test_51QZ0kuD7Q44d00zm21KxWEpW192dgrtcJ4SUmZoDubve4UlGlgQeEsrxr9m2qstU6afU0y8dZVfesCQbp2xLgzaE00ZwYUL2fF');

function App() {
  const [user, setUser] = useState(null);

  const handleAuthSuccess = (userData) => {
    setUser(userData);
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('token');
  };

  return (
    <Router>
      <Elements stripe={stripePromise}>
        <div className="App">
          <Header user={user} onLogout={handleLogout} />
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route 
              path="/login" 
              element={user ? <Navigate to="/" /> : <Login onLogin={setUser} />} 
            />
            <Route 
              path="/register" 
              element={user ? <Navigate to="/" /> : <Register onRegister={setUser} />} 
            />
            <Route 
              path="/auth" 
              element={user ? <Navigate to="/" /> : <AuthSection onAuthSuccess={handleAuthSuccess} />} 
            />
          </Routes>
        </div>
      </Elements>
    </Router>
  );
}

export default App;
