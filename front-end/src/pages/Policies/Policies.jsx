import React, { useState, useEffect } from "react"; 
import axios from "axios";
import Navbar from "../../components/Navbar";
import { useNavigate } from "react-router-dom";
import Footer2 from "../../components/Footer2";
import PoliciesHome from "./PoliciesComponents/PoliciesHome";
import AuthPrompt from "../Analytics&Reports/Components/Unregister";
// ✅ Import here
import "./Policiesdocuments.css";

export default function Policies() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [showHome, setShowHome] = useState(true);
  const [policies, setPolicies] = useState([]);
  const [selectedPolicy, setSelectedPolicy] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [unregistered, setUnregistered] = useState(false); // track unregistered users

  // Authentication & back button prevention
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/", { replace: true });
    } else {
      // Fetch user info from backend to check registration status
      axios.get("http://localhost:5000/api/users/profile", {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(res => {
        const profile = res.data;
        setUser({ role: profile.role, name: profile.name });
        if (profile.status === "unregistered") {
          setUnregistered(true); // mark unregistered
        }
      })
      .catch(err => {
        console.error("Error fetching profile:", err);
        navigate("/", { replace: true });
      });
    }

    // Prevent caching/back navigation
    window.history.pushState(null, "", window.location.href);
    window.onpopstate = function () {
      navigate("/", { replace: true });
    };
  }, [navigate]);

  // Fetch policies
  useEffect(() => {
    const fetchPolicies = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/policies");
        if (Array.isArray(res.data)) setPolicies(res.data);
        else setPolicies([]);
      } catch (err) {
        setError("Could not load policies. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchPolicies();
  }, []);

  const handleContinue = () => setShowHome(false);

  // ✅ If user is unregistered, show AuthPrompt
  if (unregistered) return <AuthPrompt />;

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
                policies.map((policy, idx) => (
                  <section
                    className="shri-policy-section"
                    key={idx}
                    onClick={() => setSelectedPolicy(policy)}
                    style={{ cursor: "pointer" }}
                  >
                    <div className="shri-policy-header">
                      <h2 className="shri-policy-title">{policy.title || "Untitled Policy"}</h2>
                    </div>
                    {policy.why && (
                      <p className="shri-policy-why"><strong>Why:</strong> {policy.why}</p>
                    )}
                    {Array.isArray(policy.keyElements) && policy.keyElements.length > 0 && (
                      <div className="shri-policy-elements">
                        <strong>Key Elements:</strong>
                        <ul>{policy.keyElements.map((el, i) => <li key={i}>{el}</li>)}</ul>
                      </div>
                    )}
                    {policy.pdf && (
                      <p>
                        <a
                          href={policy.pdf.startsWith("http") ? policy.pdf : `http://localhost:5000${policy.pdf}`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >View PDF</a>
                      </p>
                    )}
                  </section>
                ))
              )}
            </div>
          </>
        ) : (
          <div className="shri-policy-detail">
            <button className="shri-back-btn" onClick={() => setSelectedPolicy(null)}>← Back to Policies</button>
            <h2 className="shri-detail-title">{selectedPolicy.title || "Untitled Policy"}</h2>
            {selectedPolicy.why && <p className="shri-detail-why"><strong>Why:</strong> {selectedPolicy.why}</p>}
            {Array.isArray(selectedPolicy.keyElements) && selectedPolicy.keyElements.length > 0 && (
              <div className="shri-detail-elements">
                <strong>Key Elements:</strong>
                <ul>{selectedPolicy.keyElements.map((el, i) => <li key={i}>{el}</li>)}</ul>
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
                  href={selectedPolicy.pdf.startsWith("http") ? selectedPolicy.pdf : `http://localhost:5000${selectedPolicy.pdf}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >View PDF</a>
              </p>
            )}
          </div>
        )}
      </div>
      <Footer2 />
    </div>
  );
}

