import React from "react";
import { Link } from "react-router-dom";
import { FaShieldAlt, FaUsers } from "react-icons/fa";
import "../styles/HeroSection.css";

const HeroSection = () => (
  <header className="hero">
    <div className="hero-bg-pattern"></div>
    <div className="hero-content">
      <div className="hero-badge">
        <div className="status-dot"></div>
        <span>Live Security Monitoring</span>
      </div>
      <h1>Welcome to Cyber Warriors</h1>
      <p>Empowering employees to stay aware, stay compliant, and stay secure.</p>
      <div className="cta-buttons">
        <Link to="/login" className="btn btn-primary"><FaUsers className="btn-icon" /> Login</Link>
        <Link to="/register" className="btn btn-alt"><FaShieldAlt className="btn-icon" /> Register</Link>
      </div>
    </div>
  </header>
);

export default HeroSection;
