import React from "react";
import { Link } from "react-router-dom";
import { FaFileAlt, FaChalkboardTeacher, FaChartPie } from "react-icons/fa";
import "../styles/FeaturesSection.css";

const FeaturesSection = () => (
  <section className="features">
    <div className="feature-card">
      <FaFileAlt className="feature-icon" />
      <h3>Policies</h3>
      <p>Access and acknowledge the latest security policies in one place.</p>
      <Link to="/policies" className="feature-btn"><span>View Policies</span></Link>
    </div>

    <div className="feature-card">
      <FaChalkboardTeacher className="feature-icon" />
      <h3>Training</h3>
      <p>Improve awareness with interactive security training and quizzes.</p>
      <Link to="/training" className="feature-btn"><span>Start Training</span></Link>
    </div>

    <div className="feature-card">
      <FaChartPie className="feature-icon" />
      <h3>Reports</h3>
      <p>Track compliance and generate real-time reports for your team.</p>
      <Link to="/reports" className="feature-btn"><span>View Reports</span></Link>
    </div>
  </section>
);

export default FeaturesSection;
