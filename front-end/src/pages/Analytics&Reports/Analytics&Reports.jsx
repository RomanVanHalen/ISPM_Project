import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axiosInstance"; // ✅ axios instance with interceptors

import Header from "../../components/Navbar";
import Footer from "../../components/Footer2";

import ComplianceReportingDashboard from "./Components/ComplianceReportingDashboard";
import ProgressTracking from "./Components/ProgressTracking";
import AuthPrompt from "./Components/Unregister";

export default function MainPage() {
  const navigate = useNavigate();

  const [role, setRole] = useState("guest");
  const [loading, setLoading] = useState(true);

  // Check user role from backend
  useEffect(() => {
    const checkUser = async () => {
      try {
        const storedUser = JSON.parse(localStorage.getItem("user"));
        if (storedUser?.role) {
          setRole(storedUser.role); // quick set from localStorage
        }

        // Verify token with backend
        const res = await api.get("/auth/me"); // ✅ adjust endpoint to your backend
        if (res.data?.role) {
          setRole(res.data.role);
          localStorage.setItem("user", JSON.stringify(res.data)); // keep fresh
        } else {
          setRole("guest");
        }
      } catch (err) {
        console.warn("User not authenticated:", err.message);
        setRole("guest");
      } finally {
        setLoading(false);
      }
    };

    checkUser();
  }, []);

  // Choose content based on role
  let content;
  if (role === "admin") {
    content = <ComplianceReportingDashboard />;
  } else if (role === "user") {
    content = <ProgressTracking />;
  } else {
    // Guest / unregistered user
    content = (
      <AuthPrompt
        onLogin={() => navigate("/login")}
        onRegister={() => navigate("/register")}
      />
    );
  }

  // Only show Header/Footer if user is admin or registered
  const showHeaderFooter = role === "admin" || role === "user";

  if (loading) {
    return <div className="sa02-loading">Checking authentication...</div>;
  }

  return (
    <div className="sa02-body">
      {showHeaderFooter && <Header />}
      <main className="sa02-main">{content}</main>
      {showHeaderFooter && <Footer />}
    </div>
  );
}












