import React from "react";
import "../styles/ScoreBoard.css";

const ScoreBoard = ({ score, total, onRestart }) => {
  return (
    <div className="scoreboard-container">
      <h2>Training Completed!</h2>
      <p>Your Score: {score} / {total}</p>
      <button onClick={onRestart}>Restart Training</button>
    </div>
  );
};

export default ScoreBoard;
