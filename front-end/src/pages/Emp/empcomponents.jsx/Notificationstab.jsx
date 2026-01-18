import React from "react";

// Helper for "time ago"
function timeAgo(date) {
  const seconds = Math.floor((new Date() - new Date(date)) / 1000);

  if (seconds < 60) return "Just now";
  if (seconds < 3600) return Math.floor(seconds / 60) + " minutes ago";
  if (seconds < 86400) return Math.floor(seconds / 3600) + " hours ago";
  return Math.floor(seconds / 86400) + " days ago";
}

export default function NotificationsTab({ notifications, markAsRead, markAllAsRead }) {
  // Sort newest first
  const sortedNotifications = [...notifications].sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );

  return (
    <div>
      <h2>Notifications</h2>

      {sortedNotifications.length === 0 ? (
        <p>No notifications</p>
      ) : (
        <>
          <button onClick={markAllAsRead}>Mark All as Read</button>
          <ul>
            {sortedNotifications.map((note) => (
              <li key={note._id}>
                <div>
                  <div>
                    <strong>{note.title}</strong>: {note.body}
                  </div>
                  <small>{timeAgo(note.createdAt)}</small>
                  {note.link && (
                    <a href={note.link} target="_blank" rel="noopener noreferrer">
                      Go
                    </a>
                  )}
                </div>
                {!note.read && (
                  <button onClick={() => markAsRead(note._id)}>Mark as Read</button>
                )}
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}
