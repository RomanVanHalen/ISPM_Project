// back-end/src/routes/notifications.js
import express from "express";
import Notification from "../models/Notification.js";
import authMiddleware from "../middleware/authMiddleware.js";
import PolicyView from "../models/PolicyView.js";

const router = express.Router();

// GET /api/notifications
router.get("/", authMiddleware, async (req, res) => {
  try {
    const role = String(req.user.role || "").toLowerCase();
    const me = req.user._id;
    

    
    if (role === "admin") {
      // Admin → see all login notifications (history, newest first)
      const allLogins = await Notification.find({ type: "login" })
        .populate("userId", "name email role")
        .sort({ createdAt: -1 })
        .lean();
      return res.json(allLogins);
    }

    // User → only their latest login notification
    const latestLogin = await Notification.findOne({ userId: me, type: "login" })
      .sort({ createdAt: -1 })
      .lean();

    return res.json(latestLogin ? [latestLogin] : []);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch notifications" });
  }
});

// POST create new notification (optional, for other types)
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { title, body, link, type = "info", userId } = req.body;
    const doc = await Notification.create({ title, body, link, type, userId });
    res.status(201).json(doc);
  } catch (err) {
    res.status(500).json({ error: "Failed to create notification" });
  }
});

// PATCH mark one as read (works now that schema has `read`)
router.patch("/:id/read", authMiddleware, async (req, res) => {
  try {
    const updated = await Notification.findByIdAndUpdate(
      req.params.id,
      { read: true },
      { new: true }
    );
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: "Failed to mark as read" });
  }
});

// PATCH mark all as read (scope to the user)
router.patch("/mark-all-read", authMiddleware, async (req, res) => {
  try {
    await Notification.updateMany(
      { userId: req.user._id },
      { $set: { read: true } }
    );
    res.json({ message: "All your notifications marked as read" });
  } catch (err) {
    res.status(500).json({ error: "Failed to mark all as read" });
  }
});

export default router;

