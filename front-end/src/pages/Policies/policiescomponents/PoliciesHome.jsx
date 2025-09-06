import React from "react";
import Navbar from "../../../components/Navbar";
import Footer2 from "../../../components/Footer2"; // ✅ import footer
import "./PoliciesHome.css";
import awarenessImg from "../images/policy.png"; // <-- put your downloaded image in src

export default function PoliciesHome({ onContinue }) {
  return (
    <div className="yash-policies-home-container">
      {/* Navbar */}
      <Navbar />

      {/* Hero Section */}
      <section className="yash-policies-hero">
        <div className="yash-hero-content">
          <h1>Policies & Security Awareness</h1>
          <p>
            Our security policies guide everyone in the organization to protect
            data, stay compliant, and reduce risks. Explore these resources to
            strengthen your knowledge and safeguard our digital world.
          </p>
        </div>
      </section>

      {/* Awareness Image (instead of video) */}
      <section className="yash-policies-image">
        <div className="yash-image-card">
          <img src={awarenessImg} alt="Security Awareness" />
        </div>
      </section>

      {/* Feature Highlights */}
      <section className="yash-policies-features">
        <div className="yash-feature-card">
          <h3>Compliance</h3>
          <p>Understand and follow mandatory rules that protect our company.</p>
        </div>
        <div className="yash-feature-card">
          <h3>Security Awareness</h3>
          <p>Recognize threats and learn how to respond effectively.</p>
        </div>
        <div className="yash-feature-card">
          <h3>Productivity</h3>
          <p>Policies bring clarity, enabling smoother work without confusion.</p>
        </div>
        <div className="yash-feature-card">
          <h3>Risk Reduction</h3>
          <p>Strong policies lower the chances of costly incidents.</p>
        </div>
      </section>

      {/* Continue Button */}
      <section className="yash-policies-actions">
        <button className="yash-continue-btn" onClick={onContinue}>
          Continue to Policies
        </button>
      </section>

      {/* Footer */}
      <Footer2 />
    </div>
  );
}
