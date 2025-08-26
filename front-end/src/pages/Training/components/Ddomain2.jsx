
import React from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../../components/Navbar";
import Footer from "../../../components/Footer2";
import "../styles/Ddomain2.css";

const Ddomain2 = () => {
 const navigate = useNavigate();

  return (
    <>
      <Navbar />
      <div className="ka2-course-detail">
        <h1>Domain 2: Incident Response</h1>
        <p>Learn how to detect, respond, and recover from security incidents effectively.</p>
        <ul>
          <li>Incident Detection</li>
          <li>Response Planning</li>
          <li>Recovery & Postmortem</li>
        </ul>

        <button className="ka2-back-button" onClick={() => navigate("/courses")}>
          ← Back to Courses
        </button>


      </div>
      <Footer />
    </>
  );
};

export default Ddomain2;
