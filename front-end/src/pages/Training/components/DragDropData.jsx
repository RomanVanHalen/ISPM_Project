import React, { useState } from "react";
import api from "../../../api/axiosInstance"; // ✅ axios instance with JWT
import "../styles/DragDropData.css";

const DragDropData = ({ onComplete }) => {
  const initialItems = [
    { id: 1, name: "Child Personal Info", type: "sensitive" },
    { id: 2, name: "Donor Bank Details", type: "sensitive" },
    { id: 3, name: "Employee Email", type: "sensitive" },
    { id: 4, name: "Newsletter Template", type: "non-sensitive" },
  ];

  const [items, setItems] = useState(initialItems);
  const [score, setScore] = useState(0);
  const [safeZoneItems, setSafeZoneItems] = useState([]);
  const [unsafeZoneItems, setUnsafeZoneItems] = useState([]);
  const [submitted, setSubmitted] = useState(false);

  const handleDrop = (item, zone) => {
    if (
      (item.type === "sensitive" && zone === "safe") ||
      (item.type === "non-sensitive" && zone === "unsafe")
    ) {
      setScore((prev) => prev + 1);
    }

    setItems((prev) => prev.filter((i) => i.id !== item.id));

    if (zone === "safe") {
      setSafeZoneItems((prev) => [...prev, item]);
    } else {
      setUnsafeZoneItems((prev) => [...prev, item]);
    }
  };

  const handleSubmit = async () => {
    try {
      await api.post("/score", {
        score,
        total: initialItems.length,
        module: "DragDropData",
      });
      setSubmitted(true);
      console.log("✅ Score submitted!");
      if (onComplete) onComplete();
    } catch (err) {
      console.error("❌ Error saving score:", err.response?.data || err.message);
    }
  };

  return (
    <div className="drag-drop-container">
      {/* ✅ Header with live score */}
      <h2 className="header-score">Your Score: {score} / {initialItems.length}</h2>

      <div className="zones">
        <div
          className="zone safe"
          onDrop={(e) => {
            e.preventDefault();
            const item = JSON.parse(e.dataTransfer.getData("item"));
            handleDrop(item, "safe");
          }}
          onDragOver={(e) => e.preventDefault()}
        >
          <h4>Safe Zone</h4>
          {safeZoneItems.map((item) => (
            <div key={item.id} className="dropped-item">{item.name}</div>
          ))}
        </div>

        <div
          className="zone unsafe"
          onDrop={(e) => {
            e.preventDefault();
            const item = JSON.parse(e.dataTransfer.getData("item"));
            handleDrop(item, "unsafe");
          }}
          onDragOver={(e) => e.preventDefault()}
        >
          <h4>Unsafe Zone</h4>
          {unsafeZoneItems.map((item) => (
            <div key={item.id} className="dropped-item">{item.name}</div>
          ))}
        </div>
      </div>

      <div className="draggable-items">
        {items.map((item) => (
          <div
            key={item.id}
            className="draggable-item"
            draggable
            onDragStart={(e) =>
              e.dataTransfer.setData("item", JSON.stringify(item))
            }
          >
            {item.name}
          </div>
        ))}
      </div>

      {/* ✅ Submit button */}
      <button 
        className="submit-btn"
        onClick={handleSubmit}
        disabled={submitted}
      >
        {submitted ? "Submitted!" : "Submit Score"}
      </button>
    </div>
  );
};

export default DragDropData;


