import React from "react";

export default function NotificationsTab({ notifications }) {
  return (
    <div className="dull-card-section">
      <h2>Notifications</h2>
      {notifications.length === 0 ? (
        <p>No notifications</p>
      ) : (
        <ul>
          {notifications.map((note, idx) => (
            <li key={idx}>{note.message}</li>
          ))}
        </ul>
      )}
    </div>
  );
}
