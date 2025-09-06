import React, { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "../../components/Navbar"; 
import PoliciesHome from "./policiescomponents/PoliciesHome";
import Footer2 from "../../components/Footer2";
import "./Policiesdocuments.css";

export default function Policies() {
  const [user, setUser] = useState(null);
  const [showHome, setShowHome] = useState(true);

  const policies = [
    {
      title: "ISO 27001 / ISO 27000 Series – Information Security Management",
      why: "They’ll be holding sensitive child and donor data — breaches could be devastating.",
      keyElements: [
        "Risk assessment and security controls.",
        "Data encryption (at rest & in transit).",
        "Access control & authentication.",
        "Incident response procedures",
      ],
    },
    {
      title: "ISO 9001 – Quality Management System",
      why: "Builds trust with partners & donors through consistent program delivery quality.",
      keyElements: ["Process improvement.", "Documented procedures.", "Regular audits"],
    },
    {
      title: "ISO 26000 – Social Responsibility",
      why: "Reinforces NGO ethics, human rights, and sustainable development goals.",
      keyElements: ["Ethical behavior guidelines.", "Respect for human rights.", "Environmental responsibility"],
    },
    {
      title: "UN Convention on the Rights of the Child (UNCRC)",
      why: "As a child-focused NGO, all programs should be aligned with children’s rights.",
      keyElements: ["Right to education, health, and protection.", "No exploitation or discrimination.", "Child participation in decisions affecting them."],
    },
    {
      title: "GDPR (or Equivalent Local Data Protection Law)",
      why: "Protects personal information of children, families, and donors.",
      keyElements: ["Consent before collecting personal data.", "Right to access and delete data.", "Data breach notification requirements."],
    },
    {
      title: "Sphere Standards – Humanitarian Response Quality",
      why: "Ensures aid meets international quality & dignity standards.",
      keyElements: ["Minimum standards for food, shelter, health, and water.", "Community engagement.", "Accountability measures."],
    },
    {
      title: "ILO Labour Standards",
      why: "Ensures HR practices meet fair labor laws & protect staff rights.",
      keyElements: ["Fair wages.", "Safe working conditions.", "Non-discrimination in employment."],
    },
    {
      title: "ISO 37001 – Anti-Bribery Management",
      why: "NGOs handling donor funds must prove they’re corruption-free.",
      keyElements: ["Anti-corruption training.", "Internal reporting & audit mechanisms.", "Supplier/partner vetting."],
    },
    {
      title: "Child Safeguarding Alliance Guidelines",
      why: "Provides practical implementation of child protection principles for NGOs.",
      keyElements: ["Screening of staff & volunteers.", "Risk assessments in child programs.", "Safeguarding reporting framework."],
    },
    {
      title: "Disaster Recovery & Business Continuity Framework",
      why: "Ensures the NGO can keep operating during crises.",
      keyElements: ["Backup systems.", "Emergency communication plans.", "Continuity of critical child services."],
    },
  ];

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setUser({ role: "employee", name: "Guest" });
        return;
      }

      try {
        const res = await axios.get("http://localhost:5000/api/users/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser({ role: res.data.role || "employee", name: res.data.name || "User" });
      } catch (err) {
        console.error("Failed to fetch user info:", err);
        setUser({ role: "employee", name: "Guest" });
      }
    };
    fetchUser();
  }, []);

  const handleContinue = () => setShowHome(false);

  if (showHome) return <PoliciesHome user={user} onContinue={handleContinue} />;

  return (
    <div className="shri-policies-container">
      <Navbar />

      <div className="shri-policies-header" style={{ marginTop: "20px" }}>
        <h1 className="shri-policies-main-title">Policies & Standards</h1>
        <div className="shri-user-info">
          <span role="img" aria-label="user">👤</span>
          <span className="shri-user-name">Welcome, {user?.name || "Guest"}</span>
        </div>
      </div>

      <div className="shri-policies-list">
        {policies.map((policy, idx) => (
          <section className="shri-policy-section" key={idx}>
            <div className="shri-policy-header">
              <h2 className="shri-policy-title">{policy.title}</h2>
            </div>
            <p className="shri-policy-why"><strong>Why:</strong> {policy.why}</p>
            <div className="shri-policy-elements">
              <strong>Key Elements:</strong>
              <ul>
                {policy.keyElements.map((el, i) => <li key={i}>{el}</li>)}
              </ul>
            </div>
            {user?.role === "admin" && (
              <div className="shri-policy-admin-buttons">
                <button className="shri-update-btn">Update</button>
                <button className="shri-delete-btn">Delete</button>
              </div>
            )}
          </section>
        ))}
      </div>

      <Footer2 />
    </div>
  );
}
