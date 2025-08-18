import React from "react";
import Navbar from "../../components/Navbar";
import AdminActions from "./adminComponents/AdminActions";
import AdminUsers from "./adminComponents/AdminUsers";

import "./AdminDashboard.css";

function AdminDashboard() {
  return (
    <>
      <Navbar />

      {/* Animated background */}
      <div className="dashboard-bg">
        <div className="bubble"></div>
        <div className="bubble"></div>
        <div className="bubble"></div>
        <div className="bubble"></div>
        <div className="bubble"></div>
      </div>

      {/* Wrapper for all components stacked naturally */}
      <div className="admin-dashboard-wrapper">
        <AdminActions />
        <AdminUsers /> {/* Rendered below AdminActions */}
        {/* You can add more components here and they will stack nicely */}
      </div>
    </>
  );
}

export default AdminDashboard;
