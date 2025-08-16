import React from 'react';
import '../styles/Footer2.css';

const Footer2 = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        {/* Main Footer Content */}
        <div className="footer-content">
          {/* Company Info */}
          <div className="footer-section">
            <h3>Cyber Warriors</h3>
            <p>Empowering organizations with comprehensive cyber security awareness training</p>
          </div>

          {/* Quick Links */}
          <div className="footer-section">
            <h4>Quick Links</h4>
            <ul className="footer-links">
              <li><a href="#home">Home</a></li>
              <li><a href="#about">About Us</a></li>
              <li><a href="#resources">Resources</a></li>
              <li><a href="#contact">Contact</a></li>
            </ul>
          </div>

          {/* Training Programs */}
          <div className="footer-section">
            <h4>Training Programs</h4>
            <ul className="footer-links">
              <li><a href="#phishing">Phishing Awareness</a></li>
              <li><a href="#password">Password Security</a></li>
              <li><a href="#social-engineering">Social Engineering</a></li>
              <li><a href="#incident-response">Incident Response</a></li>
            </ul>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="footer-bottom">
          <p>&copy; 2025 Cyber Warriors. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer2;