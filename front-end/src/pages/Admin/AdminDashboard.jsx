import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaUsers, FaChartLine, FaBell } from "react-icons/fa";
import AdminActions from "./adminComponents/AdminActions";
import AdminCharts from "./adminComponents/AdminCharts"; 
import api from "../../api/axiosInstance"; 
import "./AdminDashboard.css";

function AdminDashboard() {
  const navigate = useNavigate();
  const [userCount, setUserCount] = useState(0);
  const [loadingCount, setLoadingCount] = useState(true);

  // Fetch user count
  useEffect(() => {
    const fetchUserCount = async () => {
      try {
        setLoadingCount(true);
        const res = await api.get("/admin/count");
        if (res.data.count !== undefined) setUserCount(res.data.count);
      } catch (err) {
        console.error("Failed to fetch user count:", err.response?.data || err.message);
      } finally {
        setLoadingCount(false);
      }
    };

    fetchUserCount();
  }, []);

  return (
    <>
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
            <div className="dashboard-card-count">
              {loadingCount ? "..." : userCount}
            </div>
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

        {/* 📊 Admin Charts Section */}
        <div className="admin-charts-section">
          <AdminCharts />
        </div>
      </div>
    </>
  );
}

export default AdminDashboard;
