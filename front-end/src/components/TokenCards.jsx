import React, { useState } from "react";
import "../styles/TokenCards.css";

const TokenCard = ({ name, type, description, image, backImage }) => {
  const [spinning, setSpinning] = useState(false);
  const [revealed, setRevealed] = useState(false);

  const handleClick = () => {
    if (!spinning) {
      setSpinning(true);
      setTimeout(() => {
        // After first 360° rotation, reveal the card
        setRevealed(true);
        setSpinning(false);
      }, 800); // match CSS animation duration
    }
  };

  return (
    <div
      className={`sa5yugioh-card ${spinning ? "spin" : ""} ${
        revealed ? "revealed" : ""
      }`}
      onClick={handleClick}
    >
      <div className="sa5card-inner">
        {/* Front Side */}
        <div className="sa5card-front">
          <div className="sa5card-title">{name}</div>
          <div className="sa5card-image">
            <img src={image} alt={name} />
          </div>
          <div className="sa5card-type">{type}</div>
          <div className="sa5card-description">{description}</div>
        </div>

        {/* Back Side */}
        <div className="sa5card-back">
          {backImage ? (
            <img src={backImage} alt="Card Back" />
          ) : (
            <p>Cyber Awareness Token</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default TokenCard;


