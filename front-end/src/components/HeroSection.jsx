import React from "react";
import { Link } from "react-router-dom";
import { FaShieldAlt, FaUsers } from "react-icons/fa";
import "../styles/HeroSection.css";

const HeroSection = () => {
  // Floating particles
  const particles = Array.from({ length: 50 }, (_, i) => (
    <div
      key={i}
      className="particle"
      style={{
        top: `${Math.random() * 100}%`,
        left: `${Math.random() * 100}%`,
        animationDuration: `${2 + Math.random() * 3}s`
      }}
    ></div>
  ));

  return (
    <div className="landing-page">
      <header className="hero">
        <div className="hero-bg-pattern"></div>

        {/* Cyberpunk neon grid */}
        <div className="cyber-grid"></div>

        {/* Floating Particles */}
        <div className="falling-lines">{particles}</div>

        <div className="hero-content">
          <div className="hero-text">
            <div className="hero-badge">
              <div className="status-dot"></div>
              <span>All-inclusive Security Training</span>
            </div>
            <h1>Welcome to Cyber Warriors</h1>
            <p>
              Empowering employees to stay aware, stay compliant, and stay secure.
            </p>
            <div className="cta-buttons">
              <Link to="/login" className="btn btn-primary">
                <FaUsers className="btn-icon" /> Login
              </Link>
              <Link to="/register" className="btn btn-alt">
                <FaShieldAlt className="btn-icon" /> Register
              </Link>
            </div>
          </div>
          <div className="hero-image"></div>
        </div>
      </header>
    </div>
  );
};

export default HeroSection;
