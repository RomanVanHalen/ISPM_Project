// src/pages/Emp/empcomponents.jsx/NotificationsContainer.jsx
import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import "./Notificationstab.css"; // Make sure file name matches exactly

// Helper function to show time ago
function timeAgo(date) {
  const seconds = Math.floor((new Date() - new Date(date)) / 1000);
  if (seconds < 60) return "Just now";
  if (seconds < 3600) return Math.floor(seconds / 60) + " minutes ago";
  if (seconds < 86400) return Math.floor(seconds / 3600) + " hours ago";
  return Math.floor(seconds / 86400) + " days ago";
}

export default function NotificationsContainer() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");

  // Fetch notifications from backend
  const fetchNotifications = useCallback(async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/notifications", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setNotifications(res.data);
    } catch (err) {
      console.error("Failed to fetch notifications:", err);
    } finally {
      setLoading(false);
    }
  }, [token]); // <- include token as dependency

  // Mark single notification as read
  const markAsRead = async (id) => {
    try {
      await axios.patch(
        `http://localhost:5000/api/notifications/${id}/read`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setNotifications((prev) =>
        prev.map((note) => (note._id === id ? { ...note, read: true } : note))
      );
    } catch (err) {
      console.error(err);
    }
  };

  // Mark all notifications as read
  const markAllAsRead = async () => {
    try {
      await axios.patch(
        "http://localhost:5000/api/notifications/mark-all-read",
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setNotifications((prev) => prev.map((note) => ({ ...note, read: true })));
    } catch (err) {
      console.error(err);
    }
  };

  // Fetch notifications on mount
  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]); // <- ESLint satisfied

  if (loading) return <p className="mol-notifications-empty">Loading notifications...</p>;

  return (
    <div className="mol-notifications-container">
      <h2>Notifications</h2>
      <button className="mol-mark-all-btn" onClick={markAllAsRead}>
        Mark All as Read
      </button>
      {notifications.length === 0 ? (
        <p className="mol-notifications-empty">No notifications</p>
      ) : (
        <ul className="mol-notifications-list">
          {notifications.map((note) => (
            <li
              key={note._id}
              className={note.read ? "mol-read" : "mol-unread"}
            >
              <div className="mol-notification-content">
                <div>
                  <strong>{note.title}</strong>: {note.body}
                </div>
                <small>{timeAgo(note.createdAt)}</small>
                {note.link && (
                  <a
                    href={note.link}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Go
                  </a>
                )}
              </div>
              {!note.read && (
                <div className="mol-notification-action">
                  <button onClick={() => markAsRead(note._id)}>Mark as Read</button>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
