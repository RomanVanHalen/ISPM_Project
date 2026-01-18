import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import Footer2 from "../../components/Footer2";
import AuthPrompt from "../../components/Unregister";
import PoliciesHome from "./policiescomponents/PoliciesHome";
import "./Policiesdocuments.css";

export default function Policies() {
  const navigate = useNavigate();
  const [role, setRole] = useState("guest");
  const [showHome, setShowHome] = useState(true);
  const [policies, setPolicies] = useState([]);
  const [selectedPolicy, setSelectedPolicy] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch user role
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
        setRole(data?.role === "employee" || data?.role === "admin" ? data.role : "guest");
      } catch (err) {
        console.error(err);
        setRole("guest");
      } finally {
        setLoading(false);
      }
    };

    fetchUserRole();
  }, []);

  // Fetch all policies
  useEffect(() => {
    const fetchPolicies = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/policies");
        setPolicies(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.error(err);
        setError("Could not load policies. Please try again later.");
      }
    };
    fetchPolicies();
  }, []);

  const handleContinue = () => setShowHome(false);

  // Log PDF view
  const handleViewPdf = async (policy) => {
    const pdfUrl = policy.pdf.startsWith("http")
      ? policy.pdf
      : `http://localhost:5000${policy.pdf}`;
    const token = localStorage.getItem("token");

    try {
      if (token && policy._id) {
        await axios.post(
          "http://localhost:5000/api/policy-views",
          { policyId: policy._id },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        console.log("PDF view logged for policy:", policy._id);
      }
    } catch (err) {
      console.error("Failed to log PDF view:", err);
    } finally {
      window.open(pdfUrl, "_blank"); // always open PDF
    }
  };

  if (loading) return <p>Loading policies...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;
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
                      <h2>{policy.title}</h2>
                    </div>
                    <p><strong>Why:</strong> {policy.why}</p>
                    {Array.isArray(policy.keyElements) && (
                      <ul>
                        {policy.keyElements.map((el, i) => <li key={i}>{el}</li>)}
                      </ul>
                    )}
                    {policy.pdf && (
                      <button onClick={() => handleViewPdf(policy)}>
                        View PDF
                      </button>
                    )}
                  </section>
                ))
              )}
            </div>
          </>
        ) : (
          <div className="shri-policy-detail">
            <button onClick={() => setSelectedPolicy(null)}>← Back to Policies</button>
            <h2>{selectedPolicy.title}</h2>
            <p><strong>Why:</strong> {selectedPolicy.why}</p>
            {Array.isArray(selectedPolicy.keyElements) && (
              <ul>
                {selectedPolicy.keyElements.map((el, i) => <li key={i}>{el}</li>)}
              </ul>
            )}
            {selectedPolicy.details && <pre>{selectedPolicy.details}</pre>}
            {selectedPolicy.pdf && (
              <button onClick={() => handleViewPdf(selectedPolicy)}>View PDF</button>
            )}
          </div>
        )}
      </div>
      <Footer2 />
    </div>
  );
}
