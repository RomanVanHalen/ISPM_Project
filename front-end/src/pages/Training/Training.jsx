// src/pages/Training/Training.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import Header from "../../components/Navbar";
import Landpage from "./components/Landpage";
import AuthPrompt from "../../components/Unregister";

export default function Training() {
  const navigate = useNavigate();
  const [role, setRole] = useState("guest");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserRole = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setRole("guest");
        setLoading(false);
        return;
      }

      try {
        const res = await fetch("http://localhost:5000/api/users/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();

        console.log("Profile API response:", data);

        if (data?.role === "employee" || data?.role === "admin") {
          setRole(data.role);
        } else {
          setRole("guest");
        }
      } catch (err) {
        console.error("Failed to fetch user info:", err);
        setRole("guest");
      } finally {
        setLoading(false);
      }
    };

    fetchUserRole();
  }, []);

  if (loading) return <div>Loading...</div>;

  let content;
  if (role === "employee" || role === "admin") {
    content = <Landpage />;
  } else {
    content = (
      <AuthPrompt
        onLogin={() => navigate("/login")}
        onRegister={() => navigate("/register")}
      />
    );
  }

  const showHeader = role === "employee" || role === "admin";

  return (
    <div className="training-body">
      {showHeader && <Header />}
      <main className="training-main">{content}</main>
    </div>
  );
}

