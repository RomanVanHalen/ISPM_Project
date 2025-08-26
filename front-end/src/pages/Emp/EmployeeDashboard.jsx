import React, { useState, useEffect } from "react";
import { LogOut, User, Info } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";
import "./EmployeeDashboard.css";
import UserProfile from "./UserProfile";

export default function EmployeeDashboard() {
  const [user, setUser] = useState({ username: "", role: "" });
  const [trainings, setTrainings] = useState([]);
  const [availableCourses, setAvailableCourses] = useState([]);
  const [progress, setProgress] = useState(0);
  const [certificates, setCertificates] = useState(0);
  const [notifications, setNotifications] = useState([]);
  const [activeTab, setActiveTab] = useState("");
  const [visibleTabs, setVisibleTabs] = useState([]);
  const [animatedProgress, setAnimatedProgress] = useState([]);
  const [showProfile, setShowProfile] = useState(false);
  const navigate = useNavigate();

  const roleTabs = {
    employee: ["Trainings", "Courses", "Progress", "Notifications", "Policies"],
    admin: ["All Users", "Reports", "Policies"],
  };

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("token");
      if (!token) return navigate("/login", { replace: true });

      try {
        const res = await fetch("http://localhost:5000/api/users/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setUser({ username: data.username || data.name, role: data.role });
        setActiveTab(roleTabs[data.role]?.[0] || "Policies");
      } catch (err) {
        console.error(err);
      }
    };
    fetchUser();
  }, [navigate]);

  useEffect(() => {
    if (!user.role) return;

    const fetchDashboardData = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/dashboard", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        const data = await res.json();

        if (user.role === "employee") {
          setTrainings(data.trainings || []);
          setAvailableCourses(data.courses || []);
          setProgress(data.progress || 0);
          setCertificates(data.certificates || 0);
          setNotifications(data.notifications || []);
        } else if (user.role === "admin") {
          setTrainings(data.allTrainings || []);
          setAvailableCourses(data.allCourses || []);
          setNotifications(data.adminNotifications || []);
        }

        setAnimatedProgress(Array(data.trainings?.length || 0).fill(0));
      } catch (err) {
        console.error(err);
      }
    };

    fetchDashboardData();
  }, [user]);

  useEffect(() => {
    if (!user.role) return;
    setVisibleTabs([]);
    const allowedTabs = roleTabs[user.role] || [];
    let timeouts = [];
    allowedTabs.forEach((tab, index) => {
      const id = setTimeout(() => {
        setVisibleTabs((prev) => [...prev, tab]);
      }, index * 300);
      timeouts.push(id);
    });
    return () => timeouts.forEach((id) => clearTimeout(id));
  }, [user.role]);

  useEffect(() => {
    let timeoutIds = [];
    trainings.forEach((t, index) => {
      const delay = index * 500;
      const id = setTimeout(() => {
        setAnimatedProgress((prev) => {
          const newProgress = [...prev];
          newProgress[index] = t.progress;
          return newProgress;
        });
      }, delay);
      timeoutIds.push(id);
    });
    return () => timeoutIds.forEach((id) => clearTimeout(id));
  }, [trainings]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login", { replace: true });
  };

  return (
    <div className="siri-dashboard-container">
      <aside className="siri-sidebar">
        <div
          className="siri-sidebar-profile"
          onClick={() => setShowProfile(true)}
          style={{ cursor: "pointer" }}
        >
          <User className="siri-sidebar-user-icon" />
          <h3>{user.username || "Loading..."}</h3>
          <p>{user.role}</p>
        </div>

        <nav className="siri-sidebar-menu">
          {visibleTabs.map((tab) => (
            <button
              key={tab}
              className={activeTab === tab ? "siri-active-tab" : ""}
              onClick={() => {
                setActiveTab(tab);
                setShowProfile(false);
              }}
            >
              {tab}
            </button>
          ))}
        </nav>

        <button className="siri-logout-btn" onClick={handleLogout}>
          <LogOut /> Logout
        </button>
      </aside>

      <main className="siri-main-content">
        {showProfile ? (
          <div className="siri-card-section">
            <h2>User Profile</h2>
            <UserProfile user={user} />
          </div>
        ) : (
          <>
            {(activeTab === "Trainings" || activeTab === "All Users") && (
              <div className="siri-card-section">
                <h2>{activeTab}</h2>
                {trainings.length > 0 ? (
                  trainings.map((t, index) => (
                    <div key={t.id} className="siri-card siri-training-card">
                      <p>{t.title}</p>
                      <div className="siri-progress-container">
                        <div
                          className="siri-progress-bar"
                          style={{ width: `${animatedProgress[index]}%` }}
                        />
                      </div>
                      <button className="siri-card-btn">
                        {t.progress > 0 ? "Continue" : "Start"}
                      </button>
                    </div>
                  ))
                ) : (
                  <p>No trainings available.</p>
                )}
              </div>
            )}

            {(activeTab === "Courses" || activeTab === "Reports") && (
              <div className="siri-card-section">
                <h2>{activeTab}</h2>
                {availableCourses.length > 0 ? (
                  availableCourses.map((c, idx) => (
                    <div key={idx} className="siri-card">
                      <p>{c}</p>
                      <div className="siri-progress-container">
                        <div className="siri-progress-bar" style={{ width: "0%" }} />
                      </div>
                      <button className="siri-card-btn">Start</button>
                    </div>
                  ))
                ) : (
                  <p>No courses available.</p>
                )}
              </div>
            )}

            {activeTab === "Progress" && (
              <div className="siri-card-section">
                <h2>{activeTab}</h2>
                <div className="siri-progress-container">
                  <div
                    className="siri-progress-bar"
                    style={{ width: `${progress}%`, backgroundColor: "#2196f3" }}
                  />
                </div>
                <p>{progress}% Complete</p>
                <p>Certificates Earned: {certificates}</p>

                <h3>Working Progress</h3>
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={[
                        { name: "Completed", value: progress },
                        { name: "Remaining", value: 100 - progress },
                      ]}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      label
                    >
                      <Cell key="completed" fill="#4caf50" />
                      <Cell key="remaining" fill="#c8e6c9" />
                    </Pie>
                    <Tooltip />
                    <Legend verticalAlign="bottom" height={36} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            )}

            {activeTab === "Notifications" && (
              <div className="siri-card-section">
                <h2>Notifications</h2>
                {notifications.length > 0 ? (
                  notifications.map((note) => (
                    <div key={note.id} className="siri-card siri-notification-card">
                      <Info /> {note.message}
                    </div>
                  ))
                ) : (
                  <p>No notifications.</p>
                )}
              </div>
            )}

            {activeTab === "Policies" && (
              <div className="siri-card-section">
                <h2>Policies & Documents</h2>
                <ul>
                  {user.role === "admin" && <li>Manage User Policies</li>}
                  <li>Acceptable Use Policy</li>
                  <li>Data Protection Policy</li>
                  <li>Remote Work Security Policy</li>
                </ul>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}
