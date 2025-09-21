import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axiosInstance";

import Header from "../../components/Navbar";
import Footer from "../../components/Footer2";

import ProgressTracking from "./Components/ProgressTracking";
import AuthPrompt from "./Components/Unregister";

export default function MainPage() {
  const navigate = useNavigate();

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkUser = async () => {
      try {
        const token = localStorage.getItem("token");
        console.log("Stored token:", token);

        if (!token) {
          setIsLoggedIn(false);
          setLoading(false);
          return;
        }

        // ✅ call backend to validate token
        const res = await api.get("/users/profile");
        console.log("Response from /users/profile:", res.data);

        if (res.data && res.data.email) {
          setIsLoggedIn(true);
          localStorage.setItem("user", JSON.stringify(res.data));
        } else {
          setIsLoggedIn(false);
        }
      } catch (err) {
        console.warn("Auth check failed:", err.response?.data || err.message);
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setIsLoggedIn(false);
      } finally {
        setLoading(false);
      }
    };

    checkUser();
  }, []);

  let content;
  if (isLoggedIn) {
    content = <ProgressTracking />;
  } else {
    content = (
      <AuthPrompt
        onLogin={() => navigate("/login")}
        onRegister={() => navigate("/register")}
      />
    );
  }

  const showHeaderFooter = isLoggedIn;

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



















