import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "../styles/Notifications.css";

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchNotifications = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:5000/api/notifications", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setNotifications(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load notifications");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  const isInternalPath = (url = "") => typeof url === "string" && url.startsWith("/");

  const formatDate = (iso) => {
    if (!iso) return "";
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return "";

    const now = new Date();
    const sameDay =
      d.getFullYear() === now.getFullYear() &&
      d.getMonth() === now.getMonth() &&
      d.getDate() === now.getDate();

    const time = d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    if (sameDay) return `Today • ${time}`;

    return d.toLocaleString([], {
      year: "numeric",
      month: "short",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="subha-notif-page">
      <header className="subha-notif-header">
        <div>
          <h2 className="subha-notif-title">Notifications</h2>
          <p className="subha-notif-subtitle">Latest events from your system</p>
        </div>

        <div className="subha-notif-actions">
          <button
            className="subha-btn subha-btn-outline"
            onClick={fetchNotifications}
            disabled={loading}
          >
            ↻ Refresh
          </button>
          <Link className="subha-btn" to="/dashboard">
            ← Back to Dashboard
          </Link>
        </div>
      </header>

      {error && (
        <div className="subha-notif-banner subha-error">
          <span className="subha-banner-icon">⚠</span>
          <span>{error}</span>
        </div>
      )}

      {loading ? (
        <ul className="subha-notif-list">
          <li className="subha-notif-card subha-skeleton" />
          <li className="subha-notif-card subha-skeleton" />
          <li className="subha-notif-card subha-skeleton" />
        </ul>
      ) : notifications.length === 0 ? (
        <div className="subha-notif-empty">
          <div className="subha-empty-icon">🔔</div>
          <h3>No notifications yet</h3>
          <p>When something happens—like a successful login—it’ll show up here.</p>
        </div>
      ) : (
        <ul className="subha-notif-list">
          {notifications.map((n, idx) => {
            const badgeText = (n.type || "info").toString();
            const badgeClass = `subha-badge subha-${badgeText.toLowerCase()}`;

            const linkNode =
              n.link && isInternalPath(n.link) ? (
                <Link to={n.link} className="subha-notif-link">
                  View →
                </Link>
              ) : n.link ? (
                <a
                  href={n.link}
                  className="subha-notif-link"
                  target="_blank"
                  rel="noreferrer"
                >
                  Open →
                </a>
              ) : null;

            return (
              <li className="subha-notif-card" key={n._id || idx}>
                <div className="subha-notif-card-head">
                  <span className={badgeClass}>{badgeText}</span>
                  {n.createdAt && (
                    <span className="subha-notif-time">{formatDate(n.createdAt)}</span>
                  )}
                </div>

                <h4 className="subha-notif-card-title">{n.title || "Notification"}</h4>
                {n.body && <p className="subha-notif-card-body">{n.body}</p>}

                <div className="subha-notif-card-actions">{linkNode}</div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
