import React from "react";
import "../styles/LevelCard.css";

const LevelCard = ({ title, description, onStart }) => {
  return (
    <div className="level-card" onClick={onStart}>
      <h3>{title}</h3>
      <p>{description}</p>
      <button>Start Level</button>
    </div>
  );
};

export default LevelCard;
