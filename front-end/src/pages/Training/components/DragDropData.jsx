import React, { useState } from "react";
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

  const handleDrop = (item, zone) => {
    // Update score if correct
    if ((item.type === "sensitive" && zone === "safe") ||
        (item.type === "non-sensitive" && zone === "unsafe")) {
      setScore((prev) => prev + 1);
    }

    // Remove from draggable list
    setItems((prev) => prev.filter((i) => i.id !== item.id));

    // Add to appropriate zone
    if (zone === "safe") {
      setSafeZoneItems((prev) => [...prev, item]);
    } else {
      setUnsafeZoneItems((prev) => [...prev, item]);
    }
  };

  return (
    <div className="drag-drop-container">
      <h3>Drag Sensitive Items to the Correct Zone</h3>
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

      <p>Score: {score} / {initialItems.length}</p>
      {score === initialItems.length && (
        <button onClick={onComplete}>Next Level</button>
      )}
    </div>
  );
};

export default DragDropData;
