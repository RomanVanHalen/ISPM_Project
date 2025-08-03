import React from "react";
import { Link } from "react-router-dom";
import "./Login.css";
import { FaShieldAlt } from "react-icons/fa";

const Login = () => {
  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <FaShieldAlt className="login-icon" />
          <h2>Cyber Warriors</h2>
          <p>Login to your account</p>
        </div>

        <form className="login-form">
          <div className="form-group">
            <label>Email Address</label>
            <input type="email" placeholder="Enter your email" required />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input type="password" placeholder="Enter your password" required />
          </div>

          <div className="form-options">
            <label>
              <input type="checkbox" /> Remember me
            </label>
            <Link to="/forgot-password" className="forgot-link">
              Forgot password?
            </Link>
          </div>

          <button type="submit" className="btn-login">Login</button>
        </form>

        <p className="register-text">
          Don’t have an account? <Link to="/register">Register here</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
