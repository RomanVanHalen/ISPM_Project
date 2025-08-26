import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom"; // ✅ added Link
import "./Policiesdocuments.css";

export default function Policies() {
  const navigate = useNavigate();
  const [user, setUser] = useState({ role: "employee", name: "John Doe" });

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
      keyElements: [
        "Ethical behavior guidelines.",
        "Respect for human rights.",
        "Environmental responsibility",
      ],
    },
    {
      title: "UN Convention on the Rights of the Child (UNCRC)",
      why: "As a child-focused NGO, all programs should be aligned with children’s rights.",
      keyElements: [
        "Right to education, health, and protection.",
        "No exploitation or discrimination.",
        "Child participation in decisions affecting them.",
      ],
    },
    {
      title: "GDPR (or Equivalent Local Data Protection Law)",
      why: "Protects personal information of children, families, and donors.",
      keyElements: [
        "Consent before collecting personal data.",
        "Right to access and delete data.",
        "Data breach notification requirements.",
      ],
    },
    {
      title: "Sphere Standards – Humanitarian Response Quality",
      why: "Ensures aid meets international quality & dignity standards.",
      keyElements: [
        "Minimum standards for food, shelter, health, and water.",
        "Community engagement.",
        "Accountability measures.",
      ],
    },
    {
      title: "ILO Labour Standards",
      why: "Ensures HR practices meet fair labor laws & protect staff rights.",
      keyElements: ["Fair wages.", "Safe working conditions.", "Non-discrimination in employment."],
    },
    {
      title: "ISO 37001 – Anti-Bribery Management",
      why: "NGOs handling donor funds must prove they’re corruption-free.",
      keyElements: [
        "Anti-corruption training.",
        "Internal reporting & audit mechanisms.",
        "Supplier/partner vetting.",
      ],
    },
    {
      title: "Child Safeguarding Alliance Guidelines",
      why: "Provides practical implementation of child protection principles for NGOs.",
      keyElements: [
        "Screening of staff & volunteers.",
        "Risk assessments in child programs.",
        "Safeguarding reporting framework.",
      ],
    },
    {
      title: "Disaster Recovery & Business Continuity Framework",
      why: "Ensures the NGO can keep operating during crises.",
      keyElements: [
        "Backup systems.",
        "Emergency communication plans.",
        "Continuity of critical child services.",
      ],
    },
  ];

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        const res = await fetch("http://localhost:5000/api/users/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const data = await res.json();
          setUser({ role: data.role || "employee", name: data.name || "User" });
        }
      } catch (err) {
        console.error("Failed to fetch user info:", err);
      }
    };

    fetchUser();
  }, []);

  return (
    <div className="policies-container">
      {/* Header with back button */}
      <div className="policies-header">
        <button className="back-btn" onClick={() => navigate("/policies")}>
          ← Back
        </button>
        <h1 className="policies-main-title">Policies & Standards</h1>

        {/* ✅ User Icon linked to EmpDashboard */}
        <Link to="/empdashboard" className="user-icon">
          <span role="img" aria-label="user">👤</span>
          <span className="user-name">Welcome, {user.name}</span>
        </Link>
      </div>

      {/* Policies list */}
      <div className="policies-list">
        {policies.map((policy, index) => (
          <div className="policy-card" key={index}>
            <h2 className="policy-title">{policy.title}</h2>
            <p className="policy-why">
              <strong>Why:</strong> {policy.why}
            </p>
            <div className="policy-elements">
              <strong>Key Elements:</strong>
              <ul>
                {policy.keyElements.map((el, idx) => (
                  <li key={idx}>{el}</li>
                ))}
              </ul>
            </div>

            {user.role === "admin" && (
              <div className="policy-admin-buttons">
                <button className="update-btn">Update</button>
                <button className="delete-btn">Delete</button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
