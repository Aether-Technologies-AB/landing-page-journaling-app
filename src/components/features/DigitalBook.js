import React from 'react';
import { Link } from 'react-router-dom';
import { FaHeart, FaClock, FaDownload, FaArrowLeft } from 'react-icons/fa';
import './Features.css';

const DigitalBook = () => {
  return (
    <div className="feature-page">
      <Link to="/" className="back-link">
        <FaArrowLeft /> Back to Home
      </Link>
      
      <div className="feature-page-content">
        <h1>Digital Memory Book</h1>
        
        <section className="feature-section">
          <h2>Create Beautiful Digital Memory Books</h2>
          <p>
            Transform your transcribed memories into stunning digital books that can be shared, 
            printed, and treasured for generations to come. Add photos, organize by themes, 
            and create a lasting legacy of your family's story.
          </p>
        </section>

        <section className="feature-section">
          <h2>Key Features</h2>
          <div className="key-features">
            <div className="key-feature">
              <FaHeart className="feature-icon" />
              <h3>Photo Integration</h3>
              <p>Enhance your stories with photos, creating rich, visual memories that bring your words to life.</p>
            </div>
            
            <div className="key-feature">
              <FaClock className="feature-icon" />
              <h3>Timeline Organization</h3>
              <p>Organize your memories chronologically or by themes, making it easy to relive moments in context.</p>
            </div>
            
            <div className="key-feature">
              <FaDownload className="feature-icon" />
              <h3>Export & Print</h3>
              <p>Create beautiful PDFs or print physical copies to share with family members.</p>
            </div>
          </div>
        </section>

        <section className="feature-section">
          <h2>Book Features</h2>
          <ul className="feature-list">
            <li>Customizable layouts and themes</li>
            <li>Photo galleries and captions</li>
            <li>Chapter organization</li>
            <li>Table of contents generation</li>
            <li>Date and location tagging</li>
            <li>Collaborative editing</li>
            <li>High-quality printing options</li>
          </ul>
        </section>

        <section className="feature-section cta-section">
          <h2>Start Creating Your Family's Legacy</h2>
          <p>Turn your precious memories into beautiful books that will be cherished for generations.</p>
          <Link to="/register" className="cta-button">Create Your Book</Link>
        </section>
      </div>
    </div>
  );
};

export default DigitalBook;
