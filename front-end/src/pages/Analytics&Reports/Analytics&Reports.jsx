import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axiosInstance";

import Header from "../../components/Navbar";
import Footer from "../../components/Footer2";

import ProgressTracking from "./Components/ProgressTracking";
import AuthPrompt from "./Components/Unregister";

export default function MainPage() {
  const navigate = useNavigate();

  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkUser = async () => {
      try {
        const token = localStorage.getItem("token");
        console.log("Stored token:", token);

        if (!token) {
          setRole("unregistered");
          setLoading(false);
          return;
        }

        // ✅ use your /profile endpoint
        const res = await api.get("/profile");
        console.log("Response from /profile:", res.data);

        // Your backend returns the user directly (not nested)
        const userData = res.data;
        const userRole = userData.role;

        // ✅ match role correctly (employee in your DB)
        if (userRole === "employee") {
          setRole("user"); // internally we treat employee as user
          localStorage.setItem("user", JSON.stringify(userData));
        } else {
          setRole("unregistered");
        }
      } catch (err) {
        console.warn("Auth check failed:", err);
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setRole("unregistered");
      } finally {
        setLoading(false);
      }
    };

    checkUser();
  }, []);

  let content;
  if (role === "user") {
    content = <ProgressTracking />;
  } else if (role === "unregistered") {
    content = (
      <AuthPrompt
        onLogin={() => navigate("/login")}
        onRegister={() => navigate("/register")}
      />
    );
  }

  const showHeaderFooter = role === "user";

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















