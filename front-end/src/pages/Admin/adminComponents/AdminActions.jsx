import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "../adminStyles/adminActions.css";

const AdminActions = () => {
  const navigate = useNavigate();
  const dropdownRef = useRef(null);
  const [userInfo, setUserInfo] = useState({
    name: "",
    profilePic: "https://i.pravatar.cc/150?img=3",
  });
  const [menuOpen, setMenuOpen] = useState(false);

  // Function to fetch user info
  const fetchUserInfo = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/users/profile", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      const data = await res.json();

      const picUrl = data.profilePicture
        ? `${data.profilePicture}?t=${Date.now()}` // cache-buster
        : "https://i.pravatar.cc/150?img=3";

      setUserInfo({ name: data.name, profilePic: picUrl });
    } catch (err) {
      console.error("Failed to fetch user info:", err);
    }
  };

  // Fetch user info on mount
  useEffect(() => {
    fetchUserInfo();

    // Listen for profile picture updates from AccountSettings
    const handleProfileUpdate = (e) => {
      if (e.detail?.profilePic) {
        setUserInfo((prev) => ({
          ...prev,
          profilePic: `${e.detail.profilePic}?t=${Date.now()}`, // cache-buster
        }));
      } else {
        // fallback: refetch full user info
        fetchUserInfo();
      }
    };

    window.addEventListener("profileUpdated", handleProfileUpdate);
    return () => window.removeEventListener("profileUpdated", handleProfileUpdate);
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
      <div className="admin-profile">
        <img src={userInfo.profilePic} alt="Profile" className="admin-profile-pic" />
        <span className="admin-name">{userInfo.name}</span>
      </div>

      <div className="admin-buttons" ref={dropdownRef}>
        <button onClick={handleAccountSettings} className="admin-btn account-btn">
          Account Settings
        </button>

        <button onClick={() => setMenuOpen(!menuOpen)} className="admin-btn menu-btn">
          Menu ▼
        </button>

        <button onClick={handleLogout} className="admin-btn logout-btn">
          Logout
        </button>

        {menuOpen && (
          <div className="admin-dropdown-menu">
  <div onClick={() => handleNavigate("/policies")}>Policies</div>
  <div onClick={() => handleNavigate("/training")}>Training Modules</div>
  <div onClick={() => handleNavigate("/reports")}>Analytics</div>
  <div onClick={() => handleNavigate("/admin/users")}>User Management</div>
  <div onClick={() => handleNavigate("/account-settings")}>Account Settings</div>
</div>


         )}

      </div>
    </div>
  );
};

export default AdminActions;
