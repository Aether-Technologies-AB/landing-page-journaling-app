import React from 'react';
import { Link } from 'react-router-dom';
import { FaLock, FaShare, FaCloud, FaArrowLeft } from 'react-icons/fa';
import './Features.css';

const FamilySharing = () => {
  return (
    <div className="feature-page">
      <Link to="/" className="back-link">
        <FaArrowLeft /> Back to Home
      </Link>
      
      <div className="feature-page-content">
        <h1>Secure Family Sharing</h1>
        
        <section className="feature-section">
          <h2>Share Memories Securely with Family</h2>
          <p>
            Keep your family connected through shared memories while maintaining complete control 
            over privacy and access. Our secure sharing features make it easy to collaborate 
            with family members while keeping your memories safe.
          </p>
        </section>

        <section className="feature-section">
          <h2>Key Features</h2>
          <div className="key-features">
            <div className="key-feature">
              <FaLock className="feature-icon" />
              <h3>Privacy Controls</h3>
              <p>Granular privacy settings let you control exactly who can access which memories.</p>
            </div>
            
            <div className="key-feature">
              <FaShare className="feature-icon" />
              <h3>Family Collaboration</h3>
              <p>Invite family members to add their own stories and photos to build a complete family history.</p>
            </div>
            
            <div className="key-feature">
              <FaCloud className="feature-icon" />
              <h3>Cloud Backup</h3>
              <p>Your memories are safely stored and backed up in the cloud, accessible anywhere.</p>
            </div>
          </div>
        </section>

        <section className="feature-section">
          <h2>Sharing Features</h2>
          <ul className="feature-list">
            <li>Invite family members via email</li>
            <li>Set custom access permissions</li>
            <li>Collaborative editing options</li>
            <li>Comment and react to memories</li>
            <li>Activity notifications</li>
            <li>Family tree integration</li>
            <li>Secure data encryption</li>
          </ul>
        </section>

        <section className="feature-section cta-section">
          <h2>Connect Your Family Through Shared Memories</h2>
          <p>Start sharing your family's story in a secure and meaningful way.</p>
          <Link to="/register" className="cta-button">Start Sharing</Link>
        </section>
      </div>
    </div>
  );
};

export default FamilySharing;
