import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./Home.css";
import { FaShieldAlt, FaFileAlt, FaChalkboardTeacher, FaChartPie, FaLock, FaUsers, FaBars, FaTimes } from "react-icons/fa";

const Home = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="home-container">
      {/* Enhanced Modern Navbar */}
      <nav className={`navbar ${isScrolled ? "navbar-scrolled" : ""}`}>
        <div className="nav-container">
          {/* Enhanced Logo */}
          <div className="logo">
            <div className="logo-wrapper">
              <div className="logo-icon">
                <FaShieldAlt />
              </div>
              <div className="logo-status"></div>
            </div>
            <div className="logo-text">
              <span className="logo-title">Cyber Warriors</span>
              <span className="logo-subtitle">Security Platform</span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <ul className="nav-links">
            <li><Link to="/" className="nav-link active">Home</Link></li>
            <li><Link to="/policies" className="nav-link">Policies</Link></li>
            <li><Link to="/training" className="nav-link">Training</Link></li>
            <li><Link to="/reports" className="nav-link">Reports</Link></li>
            <li><Link to="/analytics" className="nav-link">Analytics</Link></li>
          </ul>

          {/* Mobile Menu Button */}
          <button
            className="mobile-menu-btn"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>

        {/* Mobile Navigation */}
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

      {/* Hero Section - Enhanced */}
      <header className="hero">
        {/* Background Pattern */}
        <div className="hero-bg-pattern"></div>

        <div className="hero-content">
          {/* Status Badge */}
          <div className="hero-badge">
            <div className="status-dot"></div>
            <span>Live Security Monitoring</span>
          </div>

          <h1>Welcome to Cyber Warriors</h1>
          <p>
            Empowering employees to stay aware, stay compliant, and stay secure.  
            Learn policies, complete training, and track compliance — all in one place.
          </p>
          <div className="cta-buttons">
            <Link to="/login" className="btn btn-primary">
              <FaUsers className="btn-icon" />
              Login
            </Link>
            <Link to="/register" className="btn btn-alt">
              <FaShieldAlt className="btn-icon" />
              Register
            </Link>
          </div>
        </div>
      </header>

      {/* Awareness Section - Enhanced */}
      <section className="awareness">
        <h2>Stay Cyber Aware</h2>
        <p>Learn the best practices to protect your organization and yourself online.</p>

        <div className="awareness-images">
          <div className="awareness-card">
            <div className="awareness-icon">
              <FaLock />
            </div>
            <h4>Use Strong Passwords</h4>
            <p>Create unique, complex passwords for all accounts</p>
          </div>
          <div className="awareness-card">
            <div className="awareness-icon">
              <FaShieldAlt />
            </div>
            <h4>Avoid Phishing Emails</h4>
            <p>Recognize and avoid suspicious email attempts</p>
          </div>
          <div className="awareness-card">
            <div className="awareness-icon">
              <FaFileAlt />
            </div>
            <h4>Protect Sensitive Data</h4>
            <p>Secure handling of confidential information</p>
          </div>
        </div>
      </section>

      {/* Features Section - Enhanced */}
      <section className="features">
        <div className="feature-card">
          <FaFileAlt className="feature-icon" />
          <h3>Policies</h3>
          <p>Access and acknowledge the latest security policies in one place.</p>
          <Link to="/policies" className="feature-btn">
            <span>View Policies</span>
            <div className="loading-spinner"></div>
          </Link>
        </div>

        <div className="feature-card">
          <FaChalkboardTeacher className="feature-icon" />
          <h3>Training</h3>
          <p>Improve awareness with interactive security training and quizzes.</p>
          <Link to="/training" className="feature-btn">
            <span>Start Training</span>
            <div className="loading-spinner"></div>
          </Link>
        </div>

        <div className="feature-card">
          <FaChartPie className="feature-icon" />
          <h3>Reports</h3>
          <p>Track compliance and generate real-time reports for your team.</p>
          <Link to="/reports" className="feature-btn">
            <span>View Reports</span>
            <div className="loading-spinner"></div>
          </Link>
        </div>
      </section>

      {/* Bottom CTA - Enhanced */}
      <footer className="bottom-cta">
        <div className="cta-bg-decoration"></div>
        <div className="cta-content">
          <h2>Join Cyber Warriors Today</h2>
          <p>Stay secure. Stay compliant. Stay ahead.</p>
          <Link to="/register" className="btn btn-cta">
            <FaShieldAlt className="btn-icon" />
            Get Started
          </Link>
        </div>
      </footer>

    </div>
  );
};

export default Home;
