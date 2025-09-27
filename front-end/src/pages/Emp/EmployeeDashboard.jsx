import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { LogOut } from "lucide-react";
import Navbar from "../../components/Navbar";
import Footer2 from "../../components/Footer2";
import axios from "axios";

import UserProfile from "./UserProfile";
import TrainingsTab from "./empcomponents.jsx/Trainingstab";
import ProgressTab from "./empcomponents.jsx/Progresstab";
import NotificationsContainer from "./empcomponents.jsx/Notificationscontainer"; // ✅ Updated import

import "./EmployeeDashboard.css";

export default function EmployeeDashboard() {
  const [user, setUser] = useState({ name: "", role: "", avatar: "" });
  const [currentTab, setCurrentTab] = useState("Trainings");
  const [trainings, setTrainings] = useState([]);
  const [progress, setProgress] = useState([]); // Optional if needed

  const navigate = useNavigate();
  const roleTabs = ["Trainings", "Progress", "Notifications"];

  // ---------------- Route guard + back button prevention ----------------
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/", { replace: true });
      return;
    }

    window.history.pushState(null, "", window.location.href);
    const handleBack = () => {
      navigate("/", { replace: true });
    };
    window.addEventListener("popstate", handleBack);

    return () => window.removeEventListener("popstate", handleBack);
  }, [navigate]);

  // ---------------- Fetch user and dashboard data ----------------
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const fetchUserAndDashboard = async () => {
      try {
        // User profile
        const profileRes = await axios.get("http://localhost:5000/api/users/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const profile = profileRes.data;
        setUser({
          name: profile.name || "Employee",
          role: profile.role || "employee",
          avatar: profile.profilePic
            ? `${profile.profilePic}?t=${Date.now()}`
            : "",
        });

        // Trainings
        const dataRes = await axios.get("http://localhost:5000/api/dashboard", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setTrainings(dataRes.data.trainings || []);

        // Optional: progress if returned from dashboard
        setProgress(dataRes.data.progress || []);
      } catch (err) {
        console.error("Dashboard fetch error:", err.response?.data || err.message);
        setTrainings([]);
        setProgress([]);
      }
    };

    fetchUserAndDashboard();
  }, []);

  // ---------------- Logout ----------------
  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/", { replace: true });
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
          >
            <img
              src={user.avatar || "https://via.placeholder.com/50?text=User"}
              alt="User Avatar"
              className="dull-user-avatar"
            />
            <div className="dull-user-info-text">
              <p className="dull-username">{user.name || "Guest"}</p>
              <p className="dull-user-role">{user.role}</p>
            </div>
          </div>

          {/* Sidebar Tabs */}
          <nav className="dull-sidebar-menu">
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
          <button className="dull-logout-btn" onClick={handleLogout}>
            <LogOut /> Logout
          </button>
        </aside>

        <main className="dull-main-content">
          {currentTab === "Trainings" && <TrainingsTab trainings={trainings} />}

          {currentTab === "Progress" && (
            <ProgressTab token={localStorage.getItem("token")} progress={progress} />
          )}

          {/* ✅ Notifications tab now uses NotificationsContainer */}
          {currentTab === "Notifications" && <NotificationsContainer />}

          {currentTab === "Profile" && (
            <UserProfile
              onClose={() => setCurrentTab("Trainings")}
              onProfileUpdate={(updatedUser) =>
                setUser({
                  name: updatedUser.username || updatedUser.name || "Employee",
                  role: updatedUser.role || "employee",
                  avatar: updatedUser.avatar
                    ? `${updatedUser.avatar}?t=${Date.now()}`
                    : "https://via.placeholder.com/50?text=User",
                })
              }
            />
          )}
        </main>
      </div>

      <Footer2 />
    </div>
  );
}
