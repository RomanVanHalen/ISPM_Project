import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "./Login.css";
import myimg from "../../images/warrior.jpg";

const VerifyOTP = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ 
    otp: "", 
    newPassword: "",
    confirmPassword: "" 
  });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name === "otp") {
      // Only allow numbers and limit to 6 digits
      setFormData({ 
        ...formData, 
        [name]: value.replace(/\D/g, '').slice(0, 6) 
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    // Validate passwords match
    if (formData.newPassword !== formData.confirmPassword) {
      setError("Passwords do not match");
      setIsLoading(false);
      return;
    }

    // Validate password length
    if (formData.newPassword.length < 6) {
      setError("Password must be at least 6 characters");
      setIsLoading(false);
      return;
    }

    const email = localStorage.getItem("resetEmail");

    try {
      const res = await axios.post("http://localhost:5000/api/auth/reset-password", {
        email,
        otp: formData.otp,
        newPassword: formData.newPassword
      });
      
      setMessage(res.data.message);
      
      // Clear stored email and redirect to login
      setTimeout(() => {
        localStorage.removeItem("resetEmail");
        navigate("/login");
      }, 2000);
      
    } catch (err) {
      setError(err.response?.data?.message || "Error resetting password");
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
            <p>Enter the OTP and your new password</p>
          </div>
        </div>

        {/* Form Section */}
        <div className="form-section">
          <div className="form-header">
            <h3>Verify OTP</h3>
            <p>Check your email for the 6-digit OTP code</p>
          </div>

          <form className="login-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="otp">OTP Code</label>
              <div className="input-wrapper">
                <input
                  id="otp"
                  type="text"
                  name="otp"
                  placeholder="Enter 6-digit OTP"
                  value={formData.otp}
                  onChange={handleChange}
                  required
                  maxLength="6"
                />
                <div className="input-focus-border"></div>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="newPassword">New Password</label>
              <div className="input-wrapper">
                <input
                  id="newPassword"
                  type="password"
                  name="newPassword"
                  placeholder="Enter new password"
                  value={formData.newPassword}
                  onChange={handleChange}
                  required
                  minLength="6"
                />
                <div className="input-focus-border"></div>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <div className="input-wrapper">
                <input
                  id="confirmPassword"
                  type="password"
                  name="confirmPassword"
                  placeholder="Confirm new password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  minLength="6"
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
                  Resetting Password...
                </>
              ) : (
                'Reset Password'
              )}
            </button>
          </form>

          <div className="divider">
            <span>or</span>
          </div>

          <div className="register-section">
            <p>Didn't receive OTP?</p>
            <Link to="/forgot-password" className="register-link">
              Resend OTP
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

export default VerifyOTP;