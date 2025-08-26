import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "../adminStyles/adminActions.css";

const AdminActions = () => {
  const navigate = useNavigate();
  const dropdownRef = useRef(null);
  const [userInfo, setUserInfo] = useState({ name: "", profilePic: "" });
  const [menuOpen, setMenuOpen] = useState(false);

  // Fetch logged-in user info
  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/users/profile", {
          headers: { 
            Authorization: `Bearer ${localStorage.getItem("token")}` 
          }
        });
        const data = await res.json();
        setUserInfo({
          name: data.name,
          profilePic: data.profilePic || "https://i.pravatar.cc/150?img=3",
        });
      } catch (err) {
        console.error("Failed to fetch user info:", err);
      }
    };

    fetchUserInfo();
  }, []);

  // Close dropdown if clicked outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/", { replace: true });
  };

  const handleAccountSettings = () => {
    navigate("/account-settings");
  };

  const handleNavigate = (path) => {
    navigate(path);
    setMenuOpen(false);
  };

  return (
    <div className="admin-actions-container">
      {/* Profile section */}
      <div className="admin-profile">
        <img
          src={userInfo.profilePic}
          alt="Profile"
          className="admin-profile-pic"
        />
        <span className="admin-name">{userInfo.name}</span>
      </div>

      {/* Buttons / Dropdown section */}
      <div className="admin-buttons" ref={dropdownRef}>
        <button onClick={handleAccountSettings} className="admin-btn account-btn">
          Account Settings
        </button>

        <button 
          onClick={() => setMenuOpen(!menuOpen)} 
          className="admin-btn menu-btn"
        >
          Menu ▼
        </button>

        <button onClick={handleLogout} className="admin-btn logout-btn">
          Logout
        </button>

        {menuOpen && (
          <div className="admin-dropdown-menu">
            <div onClick={() => handleNavigate("/admin/policies")}>Policies</div>
            <div onClick={() => handleNavigate("/admin/training-modules")}>Training Modules</div>
            <div onClick={() => handleNavigate("/admin/analytics")}>Analytics</div>
            <div onClick={() => handleNavigate("/admin/reports")}>Reports</div>
            <div onClick={() => handleNavigate("/admin/notifications")}>Notifications</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminActions;
