import React, { useState, useEffect } from "react";
import { Bell, LogOut, User } from "lucide-react";

import "./EmployeeDashboard.css";
import UserProfile from "./UserProfile";

export default function EmployeeDashboard() {
  const [showProfile, setShowProfile] = useState(false);
  const [trainings, setTrainings] = useState([]);
  const [progress, setProgress] = useState(0);
  const [certificates, setCertificates] = useState(0);
  const [notifications, setNotifications] = useState([]);
  const [userName, setUserName] = useState(""); // store user's name

  const token = localStorage.getItem("authToken");

  useEffect(() => {
    if (!token) return;

    // ✅ Fetch user profile
    fetch("http://localhost:5000/api/users/profile", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("Profile data:", data); // debug
        if (data.name) {
          setUserName(data.name);
        } else if (data.message) {
          // extract name from message string
          const nameMatch = data.message.match(/Welcome (\w+),/);
          if (nameMatch) setUserName(nameMatch[1]);
        }
      })
      .catch((err) => console.error("Profile fetch error:", err));

    // ✅ Fetch trainings
    fetch("http://localhost:5000/api/trainings", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => setTrainings(data))
      .catch((err) => console.error("Trainings fetch error:", err));

    // ✅ Fetch progress
    fetch("http://localhost:5000/api/progress", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        setProgress(data.progress);
        setCertificates(data.certificates);
      })
      .catch((err) => console.error("Progress fetch error:", err));

    // ✅ Fetch notifications
    fetch("http://localhost:5000/api/notifications", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => setNotifications(data))
      .catch((err) => console.error("Notifications fetch error:", err));
  }, [token]);

  return (
    <div className="anya-employee-portal">
      {/* Navbar */}
      <header className="anya-navbar">
        <div className="anya-navbar-left">
          <h1>My Company</h1>
        </div>

        {/* Show "Welcome, [UserName]" */}
        <div className="anya-navbar-center">
          <h2>{userName ? `Welcome, ${userName}` : "Loading..."}</h2>
        </div>

        <div className="anya-navbar-actions">
          <div className="anya-notification">
            <Bell className="anya-icon" />
            <span className="anya-badge">{notifications.length}</span>
          </div>
          <div className="anya-user-logout">
            <User
              className="anya-icon"
              onClick={() => setShowProfile(true)}
              style={{ cursor: "pointer" }}
            />
            <LogOut
              className="anya-icon"
              onClick={() => {
                localStorage.removeItem("authToken");
                window.location.href = "/login";
              }}
              style={{ cursor: "pointer" }}
            />
          </div>
        </div>
      </header>

      {/* Main Content */}
      {showProfile ? (
        <UserProfile onClose={() => setShowProfile(false)} />
      ) : (
        <main className="anya-content-grid">
          {/* Trainings */}
          <div className="anya-card">
            <h2>My Trainings</h2>
            <div className="anya-training-list">
              {trainings.map((training) => (
                <div key={training.id} className="anya-training-item">
                  <p>{training.title}</p>
                  <div className="anya-progress-container">
                    <div
                      className="anya-progress-bar"
                      style={{
                        width: `${training.progress}%`,
                        backgroundColor: "#4caf50",
                        height: "10px",
                        borderRadius: "5px",
                      }}
                    ></div>
                  </div>
                  <button className="anya-btn">
                    {training.progress > 0 ? "Continue" : "Start"}
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Progress */}
          <div className="anya-card">
            <h2>My Progress</h2>
            <div className="anya-progress-container">
              <div
                className="anya-progress-bar"
                style={{
                  width: `${progress}%`,
                  backgroundColor: "#2196f3",
                  height: "10px",
                  borderRadius: "5px",
                }}
              ></div>
            </div>
            <p className="anya-progress-text">{progress}% Complete</p>
            <p className="anya-certificates">
              Certificates Earned: {certificates}
            </p>
          </div>

          {/* Notifications */}
          <div className="anya-card">
            <h2>Notifications</h2>
            <div className="anya-notification-list">
              {notifications.map((note) => (
                <div key={note.id} className="anya-notification-item">
                  {note.message}
                </div>
              ))}
            </div>
          </div>
        </main>
      )}
    </div>
  );
}
