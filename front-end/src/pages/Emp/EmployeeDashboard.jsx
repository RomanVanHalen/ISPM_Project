import React, { useState, useEffect } from "react";
import { LogOut } from "lucide-react";
import Navbar from "../../components/Navbar"; 
import Footer2 from "../../components/Footer2"; 
import UserProfile from "./UserProfile";
// Adjust path if needed
import axios from "axios";

import "./EmployeeDashboard.css";
import Welcome from "./Employeecomponents/Welcome";

export default function EmployeeDashboard() {
  const [user, setUser] = useState({ username: "", role: "" });
  const [showWelcome, setShowWelcome] = useState(true);
  const [currentTab, setCurrentTab] = useState("Trainings");
  const [trainings, setTrainings] = useState([]);
  const [courses, setCourses] = useState([]);
  const [progress, setProgress] = useState(0);
  const [notifications, setNotifications] = useState([]);

  const roleTabs = ["Trainings", "Courses", "Progress", "Notifications"];

  // Fetch user & dashboard data
  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        const profileRes = await axios.get("http://localhost:5000/api/users/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setUser({
          username: profileRes.data.username || profileRes.data.name,
          role: "Employee",
        });

        const dataRes = await axios.get("http://localhost:5000/api/dashboard", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setTrainings(dataRes.data.trainings || []);
        setCourses(dataRes.data.courses || []);
        setProgress(dataRes.data.progress || 0);
        setNotifications(dataRes.data.notifications || []);
      } catch (err) {
        console.error("Failed to fetch user data:", err);
      }
    };

    fetchUserData();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.reload();
  };

  // Show welcome screen first
  if (showWelcome) {
    return <Welcome user={user} onGoToPortal={() => setShowWelcome(false)} />;
  }

  return (
    <div className="dashboard-wrapper">
      <Navbar />

      <div className="dull-dashboard-container">
        {/* Sidebar */}
        <aside className="dull-sidebar">
          {/* User Info / Profile Link */}
          <div
            className="dull-sidebar-user"
            onClick={() => setCurrentTab("Profile")}
            style={{ cursor: "pointer" }}
          >
            <span className="dull-user-icon" role="img" aria-label="user">
              👤
            </span>
            <div className="dull-user-info-text">
              <p className="dull-username">{user.username || "Guest"}</p>
              <p className="dull-user-role">{user.role}</p>
            </div>
          </div>

          {/* Sidebar Menu */}
          <nav className="dull-sidebar-menu">
            {roleTabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setCurrentTab(tab)}
                className={currentTab === tab ? "active-tab" : ""}
              >
                {tab}
              </button>
            ))}
          </nav>

          {/* Logout Button */}
          <button className="dull-logout-btn" onClick={handleLogout}>
            <LogOut /> Logout
          </button>
        </aside>

        {/* Main Content */}
        <main className="dull-main-content">
          {currentTab === "Trainings" && (
            <div className="dull-card-section">
              <h2>Trainings</h2>
              <p>Total Trainings Assigned: {trainings.length}</p>
            </div>
          )}

          {currentTab === "Courses" && (
            <div className="dull-card-section">
              <h2>Courses</h2>
              <p>Total Courses Available: {courses.length}</p>
            </div>
          )}

          {currentTab === "Progress" && (
            <div className="dull-card-section">
              <h2>Overall Progress</h2>
              <p>Progress: {progress}%</p>
            </div>
          )}

          {currentTab === "Notifications" && (
            <div className="dull-card-section">
              <h2>Notifications</h2>
              {notifications.length === 0 ? (
                <p>No notifications</p>
              ) : (
                <ul>
                  {notifications.map((note, idx) => (
                    <li key={idx}>{note.message}</li>
                  ))}
                </ul>
              )}
            </div>
          )}

          {currentTab === "Profile" && (
            <UserProfile onClose={() => setCurrentTab("Trainings")} />
          )}
        </main>
      </div>

      {/* Footer */}
      <Footer2 />
    </div>
  );
}





