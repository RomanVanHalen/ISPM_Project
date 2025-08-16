import React from "react";
import { Link } from "react-router-dom";
import { FaShieldAlt, FaUsers, FaBug, FaHackerNews, FaLock, FaSkullCrossbones, FaNetworkWired } from "react-icons/fa";
import "../styles/HeroSection.css";

// Cyber icons for falling effect
const icons = [FaBug, FaHackerNews, FaLock, FaSkullCrossbones, FaNetworkWired];

const HeroSection = () => {
  // Render multiple instances of icons randomly positioned
  const fallingIcons = Array.from({ length: 30 }, (_, index) => {
    const Icon = icons[Math.floor(Math.random() * icons.length)];
    return (
      <div
        key={index}
        className="falling-icon"
        style={{
          left: `${Math.random() * 90}%`,
          animationDuration: `${6 + Math.random() * 6}s`,
          fontSize: `${20 + Math.random() * 30}px`,
        }}
      >
        <Icon />
      </div>
    );
  });

  return (
    <header className="hero">
      <div className="hero-bg-pattern"></div>

      {/* Falling icons */}
      <div className="falling-icons">{fallingIcons}</div>

      <div className="hero-content">
        <div className="hero-text">
          <div className="hero-badge">
            <div className="status-dot"></div>
            <span>All-inclusive Security training</span>
          </div>
          <h1>Welcome to Cyber Warriors</h1>
          <p>Empowering employees to stay aware, stay compliant, and stay secure.</p>
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
  );
};

export default HeroSection;
