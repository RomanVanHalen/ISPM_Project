import React from "react";
import Navbar from "../../../components/Navbar";
import Footer2 from "../../../components/Footer2"; // ✅ Adjust path if needed
import "./Welcome.css";

export default function Welcome({ user, onGoToPortal }) {
  return (
    <div className="welcome-page">
      {/* Navbar at top */}
      <Navbar />

      {/* Main Content */}
      <div className="welcome-container">
        <div className="welcome-card">
          <h1>Welcome, {user.username || "Employee"}!</h1>
          <p>
            Role: <strong>{user.role || "Employee"}</strong>
          </p>
          <p>Secure your digital world with Cyber Warriors</p>
          <button className="welcome-portal-btn" onClick={onGoToPortal}>
            Go to Portal
          </button>
        </div>
      </div>

      {/* Footer at bottom */}
      <Footer2 />
    </div>
  );
}

