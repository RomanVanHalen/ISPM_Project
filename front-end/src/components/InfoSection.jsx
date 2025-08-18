// AwarenessSection.jsx
import React from "react";
import "../styles/InfoSection.css";
import backimg from "../images/welcome.png"; // your background image

const AwarenessSection = () => {
  return (
    <section
      className="cyber-awareness-section"
      style={{ backgroundImage: `url(${backimg})` }}
    ></section>
  );
};

export default AwarenessSection;
