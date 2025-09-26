import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Footer2 from "../../components/Footer2";
import PoliciesHome from "./policiescomponents/PoliciesHome";
import "./Policiesdocuments.css";
import Navbar from "../../components/Navbar";
import AuthPrompt from "../../components/Unregister"; // reuse from Training.jsx

export default function Policies() {
  const navigate = useNavigate();
  const [role, setRole] = useState("guest");
  const [showHome, setShowHome] = useState(true);
  const [policies, setPolicies] = useState([]);
  const [selectedPolicy, setSelectedPolicy] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 1. Fetch user role if token exists
  useEffect(() => {
    const fetchUserRole = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setRole("guest");
        setLoading(false);
        return;
      }

      try {
        const res = await fetch("http://localhost:5000/api/users/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();

        if (data?.role === "employee" || data?.role === "admin") {
          setRole(data.role);
        } else {
          setRole("guest");
        }
      } catch (err) {
        console.error("Failed to fetch user info:", err);
        setRole("guest");
      } finally {
        setLoading(false);
      }
    };

    fetchUserRole();
  }, []);

  // 2. Fetch all policies (accessible to everyone)
  useEffect(() => {
    const fetchPolicies = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/policies");
        if (Array.isArray(res.data)) setPolicies(res.data);
        else setPolicies([]);
      } catch (err) {
        console.error("Failed to fetch policies:", err);
        setError("Could not load policies. Please try again later.");
      }
    };

    fetchPolicies();
  }, []);

  const handleContinue = () => setShowHome(false);

  if (loading) return <p>Loading policies...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  // Show AuthPrompt for guests (optional, can remove later)
  if (role === "guest") {
    return (
      <div className="shri-policies-page">
        <Navbar />
        <AuthPrompt
          onLogin={() => navigate("/login")}
          onRegister={() => navigate("/register")}
        />
        <Footer2 />
      </div>
    );
  }

  if (showHome) return <PoliciesHome userRole={role} onContinue={handleContinue} />;

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
              {policies.length === 0 ? (
                <p>No policies available.</p>
              ) : (
                policies.map((policy) => (
                  <section
                    className="shri-policy-section"
                    key={policy._id}
                    style={{ cursor: "pointer" }}
                    onClick={() => setSelectedPolicy(policy)}
                  >
                    <div className="shri-policy-header">
                      <h2 className="shri-policy-title">{policy.title || "Untitled Policy"}</h2>
                    </div>
                    {policy.why && (
                      <p className="shri-policy-why">
                        <strong>Why:</strong> {policy.why}
                      </p>
                    )}
                    {Array.isArray(policy.keyElements) && policy.keyElements.length > 0 && (
                      <div className="shri-policy-elements">
                        <strong>Key Elements:</strong>
                        <ul>
                          {policy.keyElements.map((el, i) => (
                            <li key={i}>{el}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {policy.pdf && (
                      <p>
                        <a
                          href={
                            policy.pdf.startsWith("http")
                              ? policy.pdf
                              : `http://localhost:5000${policy.pdf}`
                          }
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          View PDF
                        </a>
                      </p>
                    )}
                  </section>
                ))
              )}
            </div>
          </>
        ) : (
          <div className="shri-policy-detail">
            <button className="shri-back-btn" onClick={() => setSelectedPolicy(null)}>
              ← Back to Policies
            </button>
            <h2 className="shri-detail-title">{selectedPolicy.title || "Untitled Policy"}</h2>
            {selectedPolicy.why && (
              <p className="shri-detail-why">
                <strong>Why:</strong> {selectedPolicy.why}
              </p>
            )}
            {Array.isArray(selectedPolicy.keyElements) && selectedPolicy.keyElements.length > 0 && (
              <div className="shri-detail-elements">
                <strong>Key Elements:</strong>
                <ul>
                  {selectedPolicy.keyElements.map((el, i) => (
                    <li key={i}>{el}</li>
                  ))}
                </ul>
              </div>
            )}
            {selectedPolicy.details && (
              <div className="shri-detail-description">
                <strong>More Details:</strong>
                <pre>{selectedPolicy.details}</pre>
              </div>
            )}
            {selectedPolicy.pdf && (
              <p>
                <a
                  href={
                    selectedPolicy.pdf.startsWith("http")
                      ? selectedPolicy.pdf
                      : `http://localhost:5000${selectedPolicy.pdf}`
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  View PDF
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
