// src/pages/Training/components/Courses.jsx
import React from "react";
import "../styles/Courses.css";
import Navbar from "../../../components/Navbar";
import Footer from "../../../components/Footer2"; // 👈 make sure you created this

const modules = [
  { title: "Domain 1: Security Principles" },
  { title: "Domain 2: Incident Response, Business..." },
  { title: "Domain 3: Access Control Concepts" },
  { title: "Domain 4: Network Security" },
  { title: "Domain 5: Security Operations" },
  { title: "Case Study: JavaSip" },
];

const Courses = () => {
  return (
    <>
      {/* Navbar at the top */}
      <Navbar />

      {/* Page Content */}
      <div className="vikmodule-container">
        {modules.map((module, index) => (
          <div key={index} className="vikmodule-box">
            <h3 className="vikmodule-title">{module.title}</h3>
            <p className="vikexpiry">Expires on 4th February</p>
            {module.status === "Completed" ? (
              <button className="vikview-button">View</button>
            ) : (
              <button className="vikstart-button">Start</button>
            )}
          </div>
        ))}
      </div>

      {/* Footer at the bottom */}
      <Footer />
    </>
  );
};

export default Courses;
