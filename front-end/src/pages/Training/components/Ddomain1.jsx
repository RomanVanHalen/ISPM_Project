import React, { useState } from "react";
import LevelCard from "./LevelCard";
import Quiz from "./Quiz";
import DragDropData from "./DragDropData";
import ScoreBoard from "./ScoreBoard";
import "../styles/Ddomain1.css";

const levels = [
  { id: 1, title: "Child Data Protection", type: "dragdrop" },
  { id: 2, title: "Donor Data Confidentiality", type: "quiz" },
  { id: 3, title: "Employee Data Security", type: "dragdrop" },
  { id: 4, title: "Cyber Threat Awareness", type: "quiz" },
];

export default function TrainingModule() {
  const [currentLevel, setCurrentLevel] = useState(null); // null = select level screen
  const [score, setScore] = useState(0);

  const handleLevelComplete = (points) => {
    setScore((prev) => prev + points);
    setCurrentLevel(null); // back to level selection
  };

  const level = levels.find((lvl) => lvl.id === currentLevel);

  return (
    <div className="training-container">
      <h1>Employee Data Protection Training</h1>
      <ScoreBoard
        score={score}
        currentLevel={currentLevel || "-"}
        totalLevels={levels.length}
      />

      {currentLevel === null ? (
        // Show all levels as cards
        <div className="level-cards-wrapper">
          {levels.map((lvl) => (
            <LevelCard
              key={lvl.id}
              title={lvl.title}
              description={`Type: ${lvl.type}`}
              onStart={() => setCurrentLevel(lvl.id)}
            />
          ))}
        </div>
      ) : level ? (
        <div className="level-section">
          <h2>{level.title}</h2>
          {level.type === "dragdrop" ? (
            <DragDropData onComplete={() => handleLevelComplete(10)} />
          ) : (
            <Quiz onComplete={() => handleLevelComplete(10)} />
          )}
          <button className="back-btn" onClick={() => setCurrentLevel(null)}>
            Back to Levels
          </button>
        </div>
      ) : (
        <div className="training-complete">
          <h2>🎉 Training Completed!</h2>
          <p>Total Score: {score}</p>
        </div>
      )}
    </div>
  );
}
