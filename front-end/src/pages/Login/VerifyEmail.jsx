import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";


const VerifyEmail = () => {
  const [status, setStatus] = useState("loading"); // loading | success | error
  const [message, setMessage] = useState("");
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    // Move getQueryParams inside useEffect to avoid eslint warning
    const getQueryParams = () => {
      const params = new URLSearchParams(location.search);
      return {
        email: params.get("email"),
        token: params.get("token"),
      };
    };

    const { email, token } = getQueryParams();

    if (!email || !token) {
      setStatus("error");
      setMessage("Invalid verification link.");
      return;
    }

    const verify = async () => {
      try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/auth/verify`, {
          params: { email, token },
        });
        setStatus("success");
        setMessage(res.data.message || "Email verified successfully! You can now log in.");
      } catch (err) {
        setStatus("error");
        setMessage(err.response?.data?.error || "Verification failed.");
      }
    };

    verify();
  }, [location]);

  // Auto-redirect to login after 5 seconds if successful
  useEffect(() => {
    if (status === "success") {
      const timer = setTimeout(() => navigate("/login"), 5000);
      return () => clearTimeout(timer);
    }
  }, [status, navigate]);

  return (
    <div className="verify-container">
      <div className="verify-card">
        {status === "loading" && (
          <>
            <div className="spinner"></div>
            <p>Verifying your email...</p>
          </>
        )}

        {status === "success" && (
          <>
            <h2>✅ Success!</h2>
            <p>{message}</p>
            <button
              className="btn-login"
              onClick={() => navigate("/login")}
              disabled={status === "loading"}
            >
              Go to Login
            </button>
          </>
        )}

        {status === "error" && (
          <>
            <h2>❌ Oops!</h2>
            <p>{message}</p>
            <button
              className="btn-login"
              onClick={() => navigate("/register")}
              disabled={status === "loading"}
            >
              Back to Register
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default VerifyEmail;
