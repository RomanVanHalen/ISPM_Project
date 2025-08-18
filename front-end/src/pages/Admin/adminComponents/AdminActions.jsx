import React from "react";
import { useNavigate } from "react-router-dom";
import "../adminStyles/adminActions.css"; // import the styles

const AdminActions = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token"); // clear auth
    navigate("/", { replace: true }); // back to homepage
  };

  const handleAccountSettings = () => {
    navigate("/account-settings");
  };

  return (
    <div className="admin-actions-container">
      <button onClick={handleAccountSettings} className="admin-btn account-btn">
        Account Settings
      </button>
      <button onClick={handleLogout} className="admin-btn logout-btn">
        Logout
      </button>
    </div>
  );
};

export default AdminActions;
