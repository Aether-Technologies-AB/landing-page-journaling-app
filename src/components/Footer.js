import React from 'react';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <p>&copy; {new Date().getFullYear()} Nest of Memories. All rights reserved.</p>
        <nav className="footer-nav">
          <a href="/privacy-policy">Privacy Policy</a>
        </nav>
      </div>
    </footer>
  );
};

export default Footer;
