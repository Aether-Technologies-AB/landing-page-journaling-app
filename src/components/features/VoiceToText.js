import React from 'react';
import { Link } from 'react-router-dom';
import { FaMicrophone, FaCloud, FaBook, FaArrowLeft } from 'react-icons/fa';
import './Features.css';

const VoiceToText = () => {
  return (
    <div className="feature-page">
      <Link to="/" className="back-link">
        <FaArrowLeft /> Back to Home
      </Link>
      
      <div className="feature-page-content">
        <h1>Voice to Text Magic</h1>
        
        <section className="feature-section">
          <h2>Transform Your Voice into Beautiful Text</h2>
          <p>
            Our advanced AI technology makes it effortless to preserve your family's precious stories. 
            Simply speak, and watch as your words transform into beautifully formatted text in real-time.
          </p>
        </section>

        <section className="feature-section">
          <h2>Key Features</h2>
          <div className="key-features">
            <div className="key-feature">
              <FaMicrophone className="feature-icon" />
              <h3>High-Quality Recording</h3>
              <p>Crystal-clear voice recording with noise reduction technology for perfect clarity.</p>
            </div>
            
            <div className="key-feature">
              <FaCloud className="feature-icon" />
              <h3>Real-Time Transcription</h3>
              <p>Watch your words appear on screen instantly with our powerful AI transcription.</p>
            </div>
            
            <div className="key-feature">
              <FaBook className="feature-icon" />
              <h3>Multiple Languages</h3>
              <p>Support for multiple languages to capture stories from all family members.</p>
            </div>
          </div>
        </section>

        <section className="feature-section">
          <h2>How It Works</h2>
          <ol className="how-it-works">
            <li>Open the app and tap the record button</li>
            <li>Start speaking naturally - share your stories, memories, or thoughts</li>
            <li>Watch as your words are transformed into text in real-time</li>
            <li>Edit and format the text if needed</li>
            <li>Save and share with your family</li>
          </ol>
        </section>

        <section className="feature-section cta-section">
          <h2>Start Preserving Your Memories Today</h2>
          <p>Don't let precious family stories fade away. Start recording and preserving them now.</p>
          <Link to="/register" className="cta-button">Get Started</Link>
        </section>
      </div>
    </div>
  );
};

export default VoiceToText;
