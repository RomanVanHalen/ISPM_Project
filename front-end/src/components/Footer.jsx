import React from "react";
import { Link } from "react-router-dom";
import { FaShieldAlt } from "react-icons/fa";
import "../styles/Footer.css";

const Footer = () => (
  <footer className="bottom-cta">
    <div className="cta-bg-decoration"></div>
    <div className="cta-content">
      <h2>Join Cyber Warriors Today</h2>
      <p>Stay secure. Stay compliant. Stay ahead.</p>
      <Link to="/register" className="btn btn-cta">
        <FaShieldAlt className="btn-icon" /> Get Started
      </Link>
    </div>
  </footer>
);

export default Footer;
