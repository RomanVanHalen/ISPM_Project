import React from "react";
import { FaLock, FaShieldAlt, FaFileAlt, FaWifi, FaUserShield, FaMobileAlt } from "react-icons/fa";
import "../styles/AwarenessSection.css";

const AwarenessSection = () => (
  <section className="awareness">
    <h2>Stay Cyber Aware</h2>
    <p>Learn the best practices to protect your organization and yourself online.</p>

    <div className="awareness-images">
      <div className="awareness-card">
        <div className="awareness-icon"><FaLock /></div>
        <h4>Use Strong Passwords</h4>
        <p>Create unique, complex passwords for all accounts</p>
      </div>

      <div className="awareness-card">
        <div className="awareness-icon"><FaShieldAlt /></div>
        <h4>Avoid Phishing Emails</h4>
        <p>Recognize and avoid suspicious email attempts</p>
      </div>

      <div className="awareness-card">
        <div className="awareness-icon"><FaFileAlt /></div>
        <h4>Protect Sensitive Data</h4>
        <p>Secure handling of confidential information</p>
      </div>

      {/* New Cards */}
      <div className="awareness-card">
        <div className="awareness-icon"><FaWifi /></div>
        <h4>Use Secure Wi‑Fi</h4>
        <p>Avoid public Wi‑Fi or use a VPN when connecting</p>
      </div>

      <div className="awareness-card">
        <div className="awareness-icon"><FaUserShield /></div>
        <h4>Enable Multi‑Factor Authentication</h4>
        <p>Add an extra layer of protection to your accounts</p>
      </div>

      <div className="awareness-card">
        <div className="awareness-icon"><FaMobileAlt /></div>
        <h4>Keep Software Updated</h4>
        <p>Regularly update apps and devices to patch security flaws</p>
      </div>
    </div>
  </section>
);

export default AwarenessSection;
