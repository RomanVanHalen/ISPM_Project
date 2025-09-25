import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import PoliciesHome from "./policiescomponents/PoliciesHome";
import Footer2 from "../../components/Footer2";
import "./Policiesdocuments.css";

export default function Policies() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [showHome, setShowHome] = useState(true);
  const [policies, setPolicies] = useState([]);
  const [selectedPolicy, setSelectedPolicy] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 1. Authentication & back button prevention
  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/", { replace: true });
        return;
      }

      try {
        const res = await axios.get("http://localhost:5000/api/users/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser({ role: res.data.role || "employee", name: res.data.name || "User" });
      } catch (err) {
        setError("Could not load policies. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [navigate]);

  // 2. Fetch policies
  useEffect(() => {
    const fetchPolicies = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/policies");
        if (Array.isArray(res.data)) setPolicies(res.data);
        else setPolicies([]);
      } catch (err) {
        setError("Could not load policies. Please try again later.");
      }
    };

    fetchPolicies();
  }, []);

  const handleContinue = () => setShowHome(false);

  // ✅ Function to log PDF view
  const handleViewPDF = async (policy) => {
    try {
      await axios.post(
        "http://localhost:5000/api/policy-views",
        { policyId: policy._id },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
    } catch (err) {
      console.error("Failed to log PDF view:", err);
    }
  };

  if (showHome) return <PoliciesHome user={user} onContinue={handleContinue} />;

  return (
    <div className="shri-policies-page">
      <Navbar />
      <div className="shri-policies-container">
        {loading ? (
          <p>Loading policies...</p>
        ) : error ? (
          <p style={{ color: "red" }}>{error}</p>
        ) : !selectedPolicy ? (
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
                          onClick={async (e) => {
                            e.preventDefault();
                            await handleViewPDF(policy);
                            window.open(
                              policy.pdf.startsWith("http")
                                ? policy.pdf
                                : `http://localhost:5000${policy.pdf}`,
                              "_blank"
                            );
                          }}
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
                  onClick={async (e) => {
                    e.preventDefault();
                    await handleViewPDF(selectedPolicy);
                    window.open(
                      selectedPolicy.pdf.startsWith("http")
                        ? selectedPolicy.pdf
                        : `http://localhost:5000${selectedPolicy.pdf}`,
                      "_blank"
                    );
                  }}
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
