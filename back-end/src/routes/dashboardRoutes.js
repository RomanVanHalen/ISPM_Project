import express from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

/**
 * GET /api/dashboard
 * Protected route - requires auth
 * Returns mock data for now (trainings, courses, progress, notifications).
 * You can later replace this with real DB queries.
 */
router.get("/", authMiddleware, async (req, res) => {
  try {
    res.json({
      trainings: [
        { id: 1, title: "Cyber Awareness 101" },
        { id: 2, title: "Phishing Prevention" },
      ],
      courses: [
        { id: 1, title: "Incident Response Basics" },
        { id: 2, title: "Advanced Threat Hunting" },
      ],
      progress: 45, // %
      notifications: [
        { message: "🎉 Welcome back to your dashboard!" },
        { message: "🔒 New training available: Secure Passwords" },
      ],
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

export default router;