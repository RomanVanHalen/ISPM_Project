import React from "react";
import "../Styles/Unregister.css";

const AuthPrompt = ({ onLogin, onRegister }) => {
  return (
    <div className="sa03auth-overlay">
      <div className="sa03auth-box">
        {/* Left section with branding */}
        <div className="sa03auth-left">
          <h2>Access Restricted</h2>
          <p>
            To view this content, please sign in with your registered account.  
            If you are new here, create an account to continue.
          </p>
        </div>

        {/* Right section with buttons */}
        <div className="sa03auth-right">
          <h3>Welcome to Cyber Warriors</h3>
          <p className="sa03auth-sub">Choose an option to proceed</p>
          <div className="sa03auth-actions">
            <button className="sa03btn sa03login-btn" onClick={onLogin}>
              Sign In
            </button>
            <button className="sa03btn sa03register-btn" onClick={onRegister}>
              Register
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPrompt;
