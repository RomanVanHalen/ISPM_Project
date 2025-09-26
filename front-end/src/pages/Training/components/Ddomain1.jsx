import React, { useState } from "react";
import Quiz1 from "./Quiz1"; 
import Header from "../../../components/Navbar";
import Footer from "../../../components/Footer2";
import "../styles/Ddomain1.css";

export default function TrainingModule() {
  const [setScore] = useState(0);

  const handleQuizComplete = (points) => {
    setScore((prev) => prev + points);
  };

  return (
    <>
      <Header />

      <div className="training-container">
        <h1>Core Information Security Standards</h1>

        {/* ✅ Only Quiz1 now */}
        <div className="level-section">
          <Quiz1 onComplete={handleQuizComplete} />
        </div>
      </div>

      <Footer />
    </>
  );
}



