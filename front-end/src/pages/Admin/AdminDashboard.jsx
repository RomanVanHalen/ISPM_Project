import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaUsers, FaChartLine, FaBell } from "react-icons/fa";
import Navbar from "../../components/Navbar";
import AdminActions from "./adminComponents/AdminActions";

import "./AdminDashboard.css";

function AdminDashboard() {
  const navigate = useNavigate();
  const [userCount, setUserCount] = useState(0);

  // Fetch user count from backend
  useEffect(() => {
    const fetchUserCount = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/users/count", {
          credentials: "include",
        });
        const data = await res.json();
        if (data.count !== undefined) setUserCount(data.count);
      } catch (err) {
        console.error("Failed to fetch user count:", err);
      }
    };

    fetchUserCount();
  }, []);

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

      {/* Wrapper for all dashboard content */}
      <div className="admin-dashboard-wrapper">
        <AdminActions />

        {/* Cards Container */}
        <div className="dashboard-cards">
          {/* Users Card */}
          <div
            className="dashboard-card"
            onClick={() => navigate("/admin/users")}
          >
            <div className="dashboard-card-icon">
              <FaUsers />
            </div>
            <div className="dashboard-card-title">Users</div>
            <div className="dashboard-card-count">{userCount}</div>
          </div>

          {/* Analytics Card */}
          <div
            className="dashboard-card"
            onClick={() => alert("Analytics page coming soon!")}
          >
            <div className="dashboard-card-icon">
              <FaChartLine />
            </div>
            <div className="dashboard-card-title">Analytics</div>
            <div className="dashboard-card-count">—</div>
          </div>

          {/* Notifications Card */}
          <div
            className="dashboard-card"
            onClick={() => alert("Notifications page coming soon!")}
          >
            <div className="dashboard-card-icon">
              <FaBell />
            </div>
            <div className="dashboard-card-title">Notifications</div>
            <div className="dashboard-card-count">—</div>
          </div>
        </div>
      </div>
    </>
  );
}

export default AdminDashboard;
