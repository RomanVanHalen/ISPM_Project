import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaShieldAlt, FaBars, FaTimes } from "react-icons/fa";
import "../styles/Navbar.css";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav className={`navbar ${isScrolled ? "navbar-scrolled" : ""}`}>
      <div className="nav-container">
        {/* Logo */}
        <div className="logo">
          <div className="logo-icon-wrapper">
            <div className="logo-icon">
              <FaShieldAlt />
            </div>
            <span className="logo-status"></span>
          </div>
          <div className="logo-text">
            <span className="logo-title">Cyber Warriors</span>
            <span className="logo-subtitle">Security Platform</span>
          </div>
        </div>

        {/* Desktop Links */}
        <ul className="nav-links">
          <li><Link to="/" className="nav-link active">Home</Link></li>
          <li><Link to="/policies" className="nav-link">Policies</Link></li>
          <li><Link to="/training" className="nav-link">Training</Link></li>
          <li><Link to="/reports" className="nav-link">Reports</Link></li>
          <li><Link to="/analytics" className="nav-link">Analytics</Link></li>
        </ul>

        {/* Mobile Menu Toggle */}
        <button className="mobile-menu-btn" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
          {isMobileMenuOpen ? <FaTimes /> : <FaBars />}
        </button>
      </div>

      {/* Mobile Nav */}
      {isMobileMenuOpen && (
        <div className="mobile-nav">
          <div className="mobile-nav-links">
            <Link to="/" onClick={() => setIsMobileMenuOpen(false)}>Home</Link>
            <Link to="/policies" onClick={() => setIsMobileMenuOpen(false)}>Policies</Link>
            <Link to="/training" onClick={() => setIsMobileMenuOpen(false)}>Training</Link>
            <Link to="/reports" onClick={() => setIsMobileMenuOpen(false)}>Reports</Link>
            <Link to="/analytics" onClick={() => setIsMobileMenuOpen(false)}>Analytics</Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
