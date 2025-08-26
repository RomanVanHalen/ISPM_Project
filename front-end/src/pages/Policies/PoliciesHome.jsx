import React from "react";
import { Link } from "react-router-dom";
import Navbar from "../../components/Navbar";
import "./PoliciesHome.css";

export default function PoliciesHome() {
  return (
    <div className="yash-policies-home-container">
      <Navbar />

      {/* Hero Section */}
      <section className="yash-policies-hero">
        <div className="yash-hero-content">
          <h1>Policies & Security Awareness</h1>
          <p>
            Policies guide our organization toward a secure and compliant workplace.
            Learn key rules, responsibilities, and best practices to protect yourself and the company.
          </p>
        </div>
      </section>

      {/* Video Section */}
      <section className="yash-policies-video">
        <div className="yash-video-card">
          <iframe
            src="https://www.youtube.com/embed/dQw4w9WgXcQ"
            title="Policies Awareness Video"
            allowFullScreen
          ></iframe>
        </div>
      </section>

      {/* Feature Cards */}
      <section className="yash-policies-features">
        <div className="yash-feature-card">
          <h3>Compliance</h3>
          <p>Follow rules and legal requirements to keep the organization safe.</p>
        </div>
        <div className="yash-feature-card">
          <h3>Security Awareness</h3>
          <p>Understand threats and how to avoid them in your daily work.</p>
        </div>
        <div className="yash-feature-card">
          <h3>Productivity</h3>
          <p>Clear policies improve efficiency and reduce confusion.</p>
        </div>
        <div className="yash-feature-card">
          <h3>Risk Reduction</h3>
          <p>Minimize the chances of incidents through proactive learning.</p>
        </div>
      </section>

      {/* Continue Button */}
      <section className="yash-policies-actions">
        <Link to="/policies/docs" className="yash-continue-btn">
          Continue to Policies
        </Link>
      </section>
    </div>
  );
}
