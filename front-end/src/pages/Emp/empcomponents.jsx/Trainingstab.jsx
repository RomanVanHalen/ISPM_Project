import React from "react";

export default function TrainingsTab({ trainings }) {
  return (
    <div className="dull-card-section">
      <h2>Trainings</h2>
      <p>Total Trainings Assigned: {trainings.length}</p>
    </div>
  );
}
