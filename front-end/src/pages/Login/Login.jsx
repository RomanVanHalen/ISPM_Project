import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { GoogleLogin } from '@react-oauth/google';
import "./Login.css";
import myimg from "../../images/warrior.jpg";

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", formData);

      // Save token and role
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("role", res.data.user.role);

      // Optional: set default Authorization header for all future axios calls
      axios.defaults.headers.common.Authorization = `Bearer ${res.data.token}`;

      // Redirect based on role
      if (res.data.user.role === "admin") {
        navigate("/admin-dashboard");
      } else {
        navigate("/employee-dashboard");
      }

    } catch (err) {
      setMessage(err.response?.data?.message || "Login failed!");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async (credentialResponse) => {
    setIsLoading(true);
    setMessage("");

    try {
      const res = await axios.post("http://localhost:5000/api/auth/google", {
        token: credentialResponse.credential,
      });
      handleLoginSuccess(res.data);
    } catch (err) {
      setMessage(err.response?.data?.message || "Google login failed!");
      setIsLoading(false);
    }
  };

  const handleGoogleError = () => {
    setMessage("Google login failed. Please try again.");
  };

  const handleLoginSuccess = (data) => {
    // Save token and role
    localStorage.setItem("token", data.token);
    localStorage.setItem("role", data.user.role);

    // Set default Authorization header
    axios.defaults.headers.common.Authorization = `Bearer ${data.token}`;

    // Send login notification (non-blocking)
    sendLoginNotification(data.user);

    // Redirect based on role
    if (data.user.role === "admin") {
      navigate("/admin-dashboard");
    } else {
      navigate("/employee-dashboard");
    }
  };

  const sendLoginNotification = async (user) => {
    try {
      await axios.post("http://localhost:5000/api/notifications", {
        title: "Login Successful",
        body: `${user.name || "User"} has logged into the system.`,
        link: user.role === "admin" ? "/admin-dashboard" : "/employee-dashboard",
        type: "login",
      });
    } catch (notifyErr) {
      console.warn("Login notification failed:", notifyErr?.response?.data || notifyErr.message);
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
            <img src={myimg} alt="Welcome" className="welcome-image" />
            <h2>Welcome Back</h2>
            <p>Secure your digital world with Cyber Warriors</p>
          </div>
        </div>

        {/* Form Section */}
        <div className="form-section">
          <div className="form-header">
            <h3>Sign In</h3>
            <p>Enter your credentials to access your account</p>
          </div>

          {/* Google Login Button */}
          <div className="google-login-section">
            <GoogleLogin
              onSuccess={handleGoogleLogin}
              onError={handleGoogleError}
              shape="rectangular"
              size="large"
              text="signin_with"
              width="100%"
              useOneTap={false} // Optional: disable one-tap sign-in
            />
          </div>

          <div className="divider">
            <span>or continue with email</span>
          </div>

          <form className="login-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <div className="input-wrapper">
                <input
                  id="email"
                  type="email"
                  name="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
                <div className="input-focus-border"></div>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <div className="input-wrapper">
                <input
                  id="password"
                  type="password"
                  name="password"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
                <div className="input-focus-border"></div>
              </div>
            </div>

            <div className="form-options">
              <label className="checkbox-container">
                <input type="checkbox" />
                <span className="checkmark"></span>
                Remember me
              </label>
              <Link to="/forgot-password" className="forgot-link">
                Forgot password?
              </Link>
            </div>

            <button type="submit" className="btn-login" disabled={isLoading}>
              {isLoading ? (
                <>
                  <span className="spinner"></span>
                  Signing In...
                </>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          {message && (
            <div className="message-container">
              <div className={`message ${message.includes('failed') ? 'error-message' : 'success-message'}`}>
                <span className="message-icon">⚠</span>
                {message}
              </div>
            </div>
          )}

          <div className="register-section">
            <p>New to Cyber Warriors?</p>
            <Link to="/register" className="register-link">
              Create your account
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

export default Login;
