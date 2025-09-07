import React, { useState, useEffect } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { FaShieldAlt, FaBars, FaTimes, FaUserCircle, FaBell, FaSignOutAlt } from "react-icons/fa"; 
import "../styles/Navbar.css";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  //  Check login status
  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    navigate("/"); // go back home
  };

  return (
    <nav className={`navbar ${isScrolled ? "navbar-scrolled" : ""}`}>
      <div className="nav-container">
        {/* Logo */}
        <div className="logo">
          <div className="logo-icon-wrapper">
            <div className="logo-icon"><FaShieldAlt /></div>
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
            <NavLink to="/" end className={({ isActive }) =>
              isActive ? "nav-link active" : "nav-link"
            }>
              Home
            </NavLink>
          </li>
          <li>
            <NavLink to="/policies" className={({ isActive }) =>
              isActive ? "nav-link active" : "nav-link"
            }>
              Policies
            </NavLink>
          </li>
          <li>
            <NavLink to="/training" className={({ isActive }) =>
              isActive ? "nav-link active" : "nav-link"
            }>
              Training
            </NavLink>
          </li>
          <li>
            <NavLink to="/reports" className={({ isActive }) =>
              isActive ? "nav-link active" : "nav-link"
            }>
              Reports & Analytics
            </NavLink>
          </li>

          {/*  Show Profile + Notifications + Logout ONLY when logged in */}
          {isLoggedIn && (
            <>
              <li className="nav-profile">
                <button
                  className="nav-link profile-btn"
                  onClick={() => navigate("/employee-dashboard")}
                  title="Dashboard"
                >
                  <FaUserCircle size={22} />
                </button>
              </li>
              <li className="nav-profile">
                <button
                  className="nav-link profile-btn"
                  onClick={() => navigate("/notifications")}
                  title="Notifications"
                >
                  <FaBell size={20} />
                </button>
              </li>
              <li className="nav-profile">
                <button
                  className="nav-link profile-btn"
                  onClick={handleLogout}
                  title="Logout"
                >
                  <FaSignOutAlt size={20} />
                </button>
              </li>
            </>
          )}
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
            <NavLink to="/" end onClick={() => setIsMobileMenuOpen(false)}>
              Home
            </NavLink>
            <NavLink to="/policies" onClick={() => setIsMobileMenuOpen(false)}>
              Policies
            </NavLink>
            <NavLink to="/training" onClick={() => setIsMobileMenuOpen(false)}>
              Training
            </NavLink>
            <NavLink to="/reports" onClick={() => setIsMobileMenuOpen(false)}>
              Reports
            </NavLink>

            {/* Profile + Notifications + Logout for Mobile */}
           {isLoggedIn && (
  <>
    <Link
      to="/employee-dashboard"
      className="mobile-nav-link"
      onClick={() => setIsMobileMenuOpen(false)}
      title="Employee Dashboard"
    >
      <FaUserCircle size={18} style={{ marginRight: "8px" }} />
      Dashboard
    </Link>
                <Link
                  to="/notifications"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  🔔 Notifications
                </Link>
                <button
                  className="mobile-logout-btn"
                  onClick={() => {
                    handleLogout();
                    setIsMobileMenuOpen(false);
                  }}
                >
                  🚪 Logout
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;


