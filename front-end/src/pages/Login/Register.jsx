import React, { useState } from "react";
import axios from "axios";
import "./Register.css";
import myimg from "../../images/warrior.jpg";

const Register = () => {
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/api/auth/register", formData);
      setMessage(res.data.message || "Registration successful!");
    } catch (err) {
      setMessage(err.response?.data?.message || "Something went wrong!");
    }
  };

  return (
    <div className="login-container">
      {/* Optional: Animated Shapes */}
      <div className="background-shapes">
        <div className="shape shape-1"></div>
        <div className="shape shape-2"></div>
        <div className="shape shape-3"></div>
      </div>

      {/* Main Card */}
      <div className="login-card">
        {/* Left side welcome section */}
        <div className="welcome-section">
          <div className="welcome-content">
            <img
              src={myimg}
              alt="Welcome"
              className="welcome-image"
            />
            <h2>Welcome!</h2>
            <p>Create your account and start your journey</p>
          </div>
        </div>

        {/* Right side form section */}
        <div className="form-section">
          <div className="form-header">
            <h3>Create Account</h3>
            <p>Fill in your details to get started</p>
          </div>
          <form className="login-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <input
                type="text"
                name="name"
                placeholder="Full Name"
                value={formData.name}
                onChange={handleChange}
                required
              />
              <span className="input-focus-border"></span>
            </div>
            <div className="form-group">
              <input
                type="email"
                name="email"
                placeholder="Email Address"
                value={formData.email}
                onChange={handleChange}
                required
              />
              <span className="input-focus-border"></span>
            </div>
            <div className="form-group">
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                required
              />
              <span className="input-focus-border"></span>
            </div>
            <button type="submit" className="btn-login">Register</button>
          </form>

          {message && <div className="message-container"><div className="error-message">{message}</div></div>}
        </div>
      </div>
    </div>
  );
};

export default Register;
