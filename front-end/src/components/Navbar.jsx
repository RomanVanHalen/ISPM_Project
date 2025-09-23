import React, { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { FaShieldAlt, FaBell, FaSignOutAlt, FaUser, FaCog } from "react-icons/fa";
import api from "../api/axiosInstance";
import "../styles/Navbar.css";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [user, setUser] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setIsLoading(true);
        // Check for token first
        const token = localStorage.getItem("token");
        if (token) {
          const res = await api.get("/users/profile");
          setUser(res.data);
          // Store user data in localStorage for consistency
          localStorage.setItem("user", JSON.stringify(res.data));
        } else {
          setUser(null);
          localStorage.removeItem("user");
        }
      } catch (err) {
        setUser(null);
        localStorage.removeItem("user");
      } finally {
        setIsLoading(false);
      }
    };
    
    // Check if we have user data in localStorage first
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
      setIsLoading(false);
    } else {
      fetchUser();
    }
    
    // Listen for storage events to sync across tabs
    const handleStorageChange = (e) => {
      if (e.key === "token" || e.key === "user") {
        fetchUser();
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    navigate("/", { replace: true });
    setDropdownOpen(false);
  };

  return (
    <nav className={`navbar ${isScrolled ? "navbar-scrolled" : ""}`}>
      <div className="nav-container">
        {/* ===== Logo ===== */}
        <div className="nav-left" onClick={() => navigate("/")}>
          <div className="logo-icon-wrapper">
            <FaShieldAlt className="logo-icon" />
          </div>
          <div className="logo-text">
            <span className="logo-title">Cyber Warriors</span>
            <span className="logo-subtitle">Security Platform</span>
          </div>
        </div>

        {/* ===== Center Links ===== */}
        <ul className="nav-links">
          <li>
            <NavLink to="/" end className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
              Home
            </NavLink>
          </li>
          <li>
            <NavLink to="/policies" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
              Policies
            </NavLink>
          </li>
          <li>
            <NavLink to="/training" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
              Training
            </NavLink>
          </li>
          <li>
            <NavLink to="/reports&analytics" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
              Reports & Analytics
            </NavLink>
          </li>
          {/* Admin-only link */}
          {user && user.role === "admin" && (
            <li>
              <NavLink to="/admin" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
                Admin
              </NavLink>
            </li>
          )}
        </ul>

        {/* ===== Right Icons ===== */}
        <div className="nav-actions">
          {isLoading ? (
            // Show loading skeleton while checking auth state
            <div className="auth-loading">
              <div className="loading-skeleton"></div>
            </div>
          ) : user ? (
            <>
              {/* Bell icon - only show for employees and admins */}
              {(user.role === "employee" || user.role === "admin") && (
                <button className="notification-btn" onClick={() => navigate("/notifications")}>
                  <FaBell />
                </button>
              )}

              {/* Profile circle / picture */}
              <div className="profile-wrapper">
                <div 
                  className={`profile-pic-container ${user.role === "admin" ? "admin-badge" : ""}`}
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                >
                  {user.profilePic ? (
                    <img
                      src={user.profilePic}
                      alt="Profile"
                      className="profile-pic"
                    />
                  ) : (
                    <div className="profile-circle">
                      <FaUser />
                    </div>
                  )}
                  {user.role === "admin" && (
                    <span className="admin-indicator" title="Admin User">
                      <FaCog />
                    </span>
                  )}
                </div>
                
                {dropdownOpen && (
                  <div className="profile-dropdown">
                    <div className="dropdown-user-info">
                      <span className="dropdown-username">{user.name}</span>
                      <span className="dropdown-userrole">{user.role}</span>
                    </div>
                    <hr className="dropdown-divider" />
                    <button 
                      className="dropdown-btn" 
                      onClick={() => {
                        navigate("/profile");
                        setDropdownOpen(false);
                      }}
                    >
                      <FaUser /> Profile
                    </button>
                    {user.role === "admin" && (
                      <button 
                        className="dropdown-btn" 
                        onClick={() => {
                          navigate("/admin");
                          setDropdownOpen(false);
                        }}
                      >
                        <FaCog /> Admin Panel
                      </button>
                    )}
                    <button className="dropdown-btn logout-btn" onClick={handleLogout}>
                      <FaSignOutAlt /> Logout
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            // Show login/signup buttons when no user is logged in
            <div className="auth-buttons">
              <button className="login-btn" onClick={() => navigate("/login")}>
                Login
              </button>
              <button className="signup-btn" onClick={() => navigate("/signup")}>
                Sign Up
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;