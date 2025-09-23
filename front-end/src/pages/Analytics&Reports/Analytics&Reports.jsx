import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import Header from "../../components/Navbar";
import Footer from "../../components/Footer2";

import ProgressTracking from "./Components/ProgressTracking";
import AuthPrompt from "./Components/Unregister";

export default function MainPage() {
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

        // Only allow "employee", otherwise fallback to guest
        if (data?.role === "employee") {
          setRole("employee");
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
  if (role === "employee") {
    content = <ProgressTracking />;
  } else {
    content = (
      <AuthPrompt
        onLogin={() => navigate("/login")}
        onRegister={() => navigate("/register")}
      />
    );
  }

  const showHeaderFooter = role === "employee";

  return (
    <div className="sa02-body">
      {showHeaderFooter && <Header />}
      <main className="sa02-main">{content}</main>
      {showHeaderFooter && <Footer />}
    </div>
  );
}





