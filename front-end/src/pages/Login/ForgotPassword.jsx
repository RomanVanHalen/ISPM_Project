import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "./Login.css"; // Using same CSS as login
import myimg from "../../images/warrior.jpg";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setMessage("");

    try {
      const res = await axios.post("http://localhost:5000/api/auth/forgot-password", {
        email
      });
      
      setMessage(res.data.message);
      // Store email for OTP verification
      localStorage.setItem("resetEmail", email);
      
      // Redirect to OTP verification after 2 seconds
      setTimeout(() => {
        navigate("/verify-otp");
      }, 2000);
      
    } catch (err) {
      setError(err.response?.data?.message || "Error sending OTP");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="background-shapes">
        <div className="shape shape-1"></div>
        <div className="shape shape-2"></div>
        <div className="shape shape-3"></div>
      </div>

      <div className="login-card">
        {/* Welcome Section */}
        <div className="welcome-section">
          <div className="welcome-content">
            <img
              src={myimg}
              alt="Welcome"
              className="welcome-image"
            />
            <h2>Reset Password</h2>
            <p>We'll send you an OTP to reset your password</p>
          </div>
        </div>

        {/* Form Section */}
        <div className="form-section">
          <div className="form-header">
            <h3>Enter Your Email</h3>
            <p>We'll send a 6-digit OTP to your email address</p>
          </div>

          <form className="login-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <div className="input-wrapper">
                <input
                  id="email"
                  type="email"
                  name="email"
                  placeholder="Enter your registered email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <div className="input-focus-border"></div>
              </div>
            </div>

            {message && (
              <div className="message-container">
                <div className="success-message">
                  <span className="success-icon">✓</span>
                  {message}
                </div>
              </div>
            )}

            {error && (
              <div className="message-container">
                <div className="error-message">
                  <span className="error-icon">⚠</span>
                  {error}
                </div>
              </div>
            )}

            <button type="submit" className="btn-login" disabled={isLoading}>
              {isLoading ? (
                <>
                  <span className="spinner"></span>
                  Sending OTP...
                </>
              ) : (
                'Send OTP'
              )}
            </button>
          </form>

          <div className="divider">
            <span>or</span>
          </div>

          <div className="register-section">
            <p>Remember your password?</p>
            <Link to="/login" className="register-link">
              Back to Login
              <span className="arrow">→</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Floating Security Badge */}
      <div className="security-badge">
        <div className="badge-icon">🛡️</div>
        <div className="badge-text">
          <span>Secured by</span>
          <strong>256-bit SSL</strong>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;