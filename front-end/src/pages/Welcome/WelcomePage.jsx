import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import "./WelcomePage.css";
import welcomeImg from "../../images/welcome.png";

export default function WelcomePage() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

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
      } catch (err) {
        console.error(err);
        navigate("/login", { replace: true });
      }
    };
    fetchUser();
  }, [navigate]);

  const handleGoToPortal = () => {
    if (!user) return;
    if (user.role === "admin") navigate("/admin-dashboard");
    else navigate("/employee-dashboard");
  };

  if (!user) return null;

  return (
    <>
      <Navbar />
      <div className="dula-welcome-container">
        {/* Floating shapes */}
        <div className="dula-floating-shape dula-shape-1"></div>
        <div className="dula-floating-shape dula-shape-2"></div>
        <div className="dula-floating-shape dula-shape-3"></div>

        <div className="dula-welcome-card">
          <img src={welcomeImg} alt="Welcome" className="dula-welcome-image" />
          <h1 className="dula-welcome-title">Welcome, {user.username}!</h1>
          <p className="dula-welcome-role">Role: <strong>{user.role}</strong></p>
          <p className="dula-subtitle">Secure your digital world with Cyber Warriors</p>
          <button className="dula-portal-btn" onClick={handleGoToPortal}>
            Go to Your Portal
          </button>
        </div>
      </div>
    </>
  );
}
