import React, { useState, useEffect } from "react";
import Navbar from "../../components/Navbar"; 
import PoliciesHome from "./policiescomponents/PoliciesHome";
import Footer2 from "../../components/Footer2";
import "./Policiesdocuments.css";

export default function Policies() {
  const [user, setUser] = useState(null);
  const [showHome, setShowHome] = useState(true);
  const [selectedPolicy, setSelectedPolicy] = useState(null);
  const [policies, setPolicies] = useState([]);

  // Fetch user info (optional)
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setUser({ role: "employee", name: "Guest" });
    } else {
      // Optionally fetch user profile from backend
      setUser({ role: "admin", name: "Admin User" }); // Example
    }
  }, []);

  // Fetch policies dynamically from JSON
  useEffect(() => {
    const fetchPolicies = async () => {
      try {
        const res = await fetch("/policies.json"); // Adjust path if needed
        const data = await res.json();
        setPolicies(data);
      } catch (err) {
        console.error("Failed to fetch policies:", err);
      }
    };

    fetchPolicies();

    // Optional: auto-refresh every 10 seconds to get updated JSON
    const interval = setInterval(fetchPolicies, 10000);
    return () => clearInterval(interval);
  }, []);

  const handleContinue = () => setShowHome(false);

  if (showHome) return <PoliciesHome user={user} onContinue={handleContinue} />;

  return (
    <div className="shri-policies-page">
      <Navbar />

      <div className="shri-policies-container">
        {!selectedPolicy ? (
          <>
            <div className="shri-policies-header">
              <h1 className="shri-policies-main-title">Policies & Standards</h1>
            </div>

            <div className="shri-policies-list">
              {policies.map((policy, idx) => (
                <section
                  className="shri-policy-section"
                  key={idx}
                  onClick={() => setSelectedPolicy(policy)}
                  style={{ cursor: "pointer" }}
                >
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
                </section>
              ))}
            </div>
          </>
        ) : (
          <div className="shri-policy-detail">
            <button
              className="shri-back-btn"
              onClick={() => setSelectedPolicy(null)}
            >
              ← Back to Policies
            </button>
            <h2 className="shri-detail-title">{selectedPolicy.title}</h2>
            <p className="shri-detail-why"><strong>Why:</strong> {selectedPolicy.why}</p>
            <div className="shri-detail-elements">
              <strong>Key Elements:</strong>
              <ul>
                {selectedPolicy.keyElements.map((el, i) => (
                  <li key={i}>{el}</li>
                ))}
              </ul>
            </div>
            <div className="shri-detail-description">
              <strong>More Details:</strong>
              <pre>{selectedPolicy.details}</pre>
            </div>
          </div>
        )}
      </div>

      <Footer2 />
    </div>
  );
}
