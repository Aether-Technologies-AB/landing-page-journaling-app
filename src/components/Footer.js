import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <p>&copy; {new Date().getFullYear()} Nest of Memories. All rights reserved.</p>
        <nav className="footer-nav">
          <Link to="/privacy-policy">Privacy Policy</Link>
        </nav>
      </div>
    </footer>
  );
};

export default Footer;
