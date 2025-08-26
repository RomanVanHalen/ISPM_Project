
import React from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../../components/Navbar";
import Footer from "../../../components/Footer2";
import "../styles/Ddomain3.css";

const Ddomain3 = () => {
  const navigate = useNavigate();
  return (
    <>
      <Navbar />
      <div className="ka3-course-detail">
        <h1>Domain 3: Access Control Concepts</h1>
        <p>Focus on authentication, authorization, role-based access control, and access policies.</p>
        <ul>
          <li>Authentication</li>
          <li>Authorization</li>
          <li>RBAC Policies</li>
        </ul>
        <button className="ka3-back-button" onClick={() => navigate("/courses")}>
          ← Back to Courses
        </button>
      </div>
      <Footer />
    </>
  );
};

export default Ddomain3;
