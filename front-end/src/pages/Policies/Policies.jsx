import React, { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "../../components/Navbar";
import Footer2 from "../../components/Footer2";
import PoliciesHome from "./policiescomponents/PoliciesHome";
import "./Policiesdocuments.css";

export default function Policies() {
  const [user, setUser] = useState(null);
  const [showHome, setShowHome] = useState(true);
  const [policies, setPolicies] = useState([]);
  const [selectedPolicy, setSelectedPolicy] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      setUser({ role: "employee", name: "Guest" });
    } else {
      setUser({ role: "admin", name: "Admin User" });
    }

    // Fetch policies from backend
    const fetchPolicies = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/policies");
        setPolicies(res.data);
      } catch (err) {
        console.error("Failed to fetch policies:", err);
      }
    };

    fetchPolicies();
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
                  <p className="shri-policy-why">
                    <strong>Why:</strong> {policy.why}
                  </p>
                  <div className="shri-policy-elements">
                    <strong>Key Elements:</strong>
                    <ul>
                      {policy.keyElements.map((el, i) => (
                        <li key={i}>{el}</li>
                      ))}
                    </ul>
                  </div>
                  {policy.pdf && (
                    <p>
                      <a
                        href={policy.pdf}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        View PDF
                      </a>
                    </p>
                  )}
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
            <p className="shri-detail-why">
              <strong>Why:</strong> {selectedPolicy.why}
            </p>
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
            {selectedPolicy.pdf && (
              <p>
                <a
                  href={selectedPolicy.pdf}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Download/View PDF
                </a>
              </p>
            )}
          </div>
        )}
      </div>

      <Footer2 />
    </div>
  );
}


