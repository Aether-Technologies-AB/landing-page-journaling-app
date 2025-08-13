import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { FirebaseProvider } from './contexts/FirebaseContext';
import Header from './components/Header';
import LandingPage from './components/LandingPage';
import Login from './components/Login';
import Register from './components/Register';
import ForgotPassword from './components/ForgotPassword';
import Profile from './components/Profile';
import PricingPlans from './components/PricingPlans';
import Dashboard from './components/Dashboard';
import VoiceToText from './components/features/VoiceToText';
import DigitalBook from './components/features/DigitalBook';
import FamilySharing from './components/features/FamilySharing';
import PrivacyPolicy from './components/PrivacyPolicy';
import Footer from './components/Footer'; 
import './App.css';

function App() {
  return (
    <FirebaseProvider>
      <Router>
        <div className="app">
          <Header />
          <main>
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/pricing" element={<PricingPlans />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/features/voice-to-text" element={<VoiceToText />} />
              <Route path="/features/digital-book" element={<DigitalBook />} />
              <Route path="/features/family-sharing" element={<FamilySharing />} />
              <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </FirebaseProvider>
  );
}

export default App;
