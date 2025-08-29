import React from "react";
import { useNavigate } from "react-router-dom";

import Header from "../../components/Navbar";
import Footer from "../../components/Footer2";

import ComplianceReportingDashboard from "./Components/ComplianceReportingDashboard";
import ProgressTracking from "./Components/ProgressTracking";
import AuthPrompt from "./Components/Unregister";

export default function MainPage() {
  const navigate = useNavigate();

  // Get the logged-in user from localStorage
  const storedUser = JSON.parse(localStorage.getItem("user"));
  const role = storedUser?.role || "guest"; 

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
        onLogin={() => navigate("/login")}       // redirect to Sign In page
        onRegister={() => navigate("/register")} // redirect to Register page
      />
    );
  }

  // Only show Header/Footer if user is admin or registered
  const showHeaderFooter = role === "admin" || role === "user";

  return (
    <div className="sa02-body">
      {showHeaderFooter && <Header />}
      <main className="sa02-main">
        {content}
      </main>
      {showHeaderFooter && <Footer />}
    </div>
  );
}











