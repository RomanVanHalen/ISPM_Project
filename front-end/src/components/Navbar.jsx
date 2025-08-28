import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
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
          <li>
            <NavLink
              to="/"
              end
              className={({ isActive }) =>
                isActive ? "nav-link active" : "nav-link"
              }
            >
              Home
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/policies"
              className={({ isActive }) =>
                isActive ? "nav-link active" : "nav-link"
              }
            >
              Policies
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/training"
              className={({ isActive }) =>
                isActive ? "nav-link active" : "nav-link"
              }
            >
              Training
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/reports"
              className={({ isActive }) =>
                isActive ? "nav-link active" : "nav-link"
              }
            >
              Reports & Analytics
            </NavLink>
          </li>
        </ul>

        {/* Mobile Menu Toggle */}
        <button
          className="mobile-menu-btn"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <FaTimes /> : <FaBars />}
        </button>
      </div>

      {/* Mobile Nav */}
      {isMobileMenuOpen && (
        <div className="mobile-nav">
          <div className="mobile-nav-links">
            <NavLink
              to="/"
              end
              className={({ isActive }) =>
                isActive ? "active" : ""
              }
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Home
            </NavLink>
            <NavLink
              to="/policies"
              className={({ isActive }) =>
                isActive ? "active" : ""
              }
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Policies
            </NavLink>
            <NavLink
              to="/training"
              className={({ isActive }) =>
                isActive ? "active" : ""
              }
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Training
            </NavLink>
            <NavLink
              to="/reports & analytics"
              className={({ isActive }) =>
                isActive ? "active" : ""
              }
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Reports
            </NavLink>

          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;

