import React from "react";
import Navbar from "../../../components/Navbar";
import Footer2 from "../../../components/Footer2"; // Adjust path if necessary
import ScenarioQuiz from "./ScenarioQuiz"; // Ensure this path is correct
import "../styles/Ddomain2.css";

export default function Ddomain2() {
  return (
    <div className="domain-page">
      <Navbar />

      <div className="domain-content">
        <header className="domain-header">
          <h1>Cybersecurity Scenario Quiz</h1>
          <p>
            Test your knowledge with real-life scenarios that NGOs and
            organizations face every day.
          </p>
        </header>

        <ScenarioQuiz />
      </div>

      <Footer2 />
    </div>
  );
}
