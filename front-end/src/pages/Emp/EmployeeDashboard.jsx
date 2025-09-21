import React, { useState, useEffect } from "react";
import { LogOut } from "lucide-react";
import Navbar from "../../components/Navbar";
import Footer2 from "../../components/Footer2";
import axios from "axios";
import UserProfile from "./UserProfile"; 
import "./EmployeeDashboard.css";

export default function EmployeeDashboard() {
  const [user, setUser] = useState({ name: "", role: "", avatar: "" });
  const [currentTab, setCurrentTab] = useState("Trainings");
  const [trainings, setTrainings] = useState([]);
  const [courses, setCourses] = useState([]);
  const [progress, setProgress] = useState(0);
  const [notifications, setNotifications] = useState([]);

  const roleTabs = ["Trainings", "Courses", "Progress", "Notifications"];

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        const profileRes = await axios.get("http://localhost:5000/api/users/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const profile = profileRes.data;

        setUser({
          name: profile.name || "Employee",
          role: profile.role || "employee",
          avatar: profile.profilePic
            ? `${profile.profilePic}?t=${Date.now()}`
            : "", // fallback empty string if no profilePic
        });
      } catch (err) {
        console.error("Profile fetch error:", err.response?.data || err.message);
        setUser({ name: "Employee", role: "employee", avatar: "" });
      }

      try {
        const dataRes = await axios.get("http://localhost:5000/api/dashboard", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setTrainings(dataRes.data.trainings || []);
        setCourses(dataRes.data.courses || []);
        setProgress(dataRes.data.progress || 0);
        setNotifications(dataRes.data.notifications || []);
      } catch (err) {
        console.error("Dashboard fetch error:", err.response?.data || err.message);
        setTrainings([]);
        setCourses([]);
        setProgress(0);
        setNotifications([]);
      }
    };

    fetchUserData();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.reload();
  };

  return (
    <div className="dashboard-wrapper">
      <Navbar />

      <div className="dull-dashboard-container">
        <aside className="dull-sidebar">
          {/* Sidebar User Info */}
          <div
            className="dull-sidebar-user"
            onClick={() => setCurrentTab("Profile")}
            style={{ cursor: "pointer", display: "flex", alignItems: "center", gap: "10px" }}
          >
            {user.avatar ? (
              <img
                src={user.avatar}
                alt="User Avatar"
                className="dull-user-avatar"
                style={{ width: "50px", height: "50px", borderRadius: "50%", objectFit: "cover" }}
              />
            ) : (
              <img
                src="https://via.placeholder.com/50?text=User"
                alt="Default Avatar"
                className="dull-user-avatar"
                style={{ width: "50px", height: "50px", borderRadius: "50%", objectFit: "cover" }}
              />
            )}
            <div className="dull-user-info-text">
              <p className="dull-username" style={{ margin: 0 }}>{user.name || "Guest"}</p>
              <p className="dull-user-role" style={{ margin: 0 }}>{user.role}</p>
            </div>
          </div>

          {/* Sidebar Tabs */}
          <nav className="dull-sidebar-menu" style={{ marginTop: "20px" }}>
            {roleTabs.map((tab) => (
              <button
                key={tab}
                className={currentTab === tab ? "active-tab" : ""}
                onClick={() => setCurrentTab(tab)}
              >
                {tab}
              </button>
            ))}
          </nav>

          {/* Logout */}
          <button className="dull-logout-btn" onClick={handleLogout} style={{ marginTop: "auto" }}>
            <LogOut /> Logout
          </button>
        </aside>

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

          {/* Profile Tab */}
          {currentTab === "Profile" && (
            <UserProfile
              onClose={() => setCurrentTab("Trainings")}
              onProfileUpdate={(updatedUser) => {
                setUser({
                  name: updatedUser.username || updatedUser.name || "Employee",
                  role: updatedUser.role || "employee",
                  avatar: updatedUser.avatar
                    ? `${updatedUser.avatar}?t=${Date.now()}`
                    : "https://via.placeholder.com/50?text=User",
                });
              }}
            />
          )}
        </main>
      </div>

      <Footer2 />
    </div>
  );
}
