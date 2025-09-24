import express from "express";
import Notification from "../models/Notification.js";

const router = express.Router();

// GET all notifications
router.get("/", async (req, res) => {
  try {
    const notifications = await Notification.find().sort({ createdAt: -1 });
    res.json(notifications);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch notifications" });
  }
});

// POST create new notification
router.post("/", async (req, res) => {
  try {
    const { title, body, link } = req.body;
    const newNotification = new Notification({ title, body, link });
    await newNotification.save();
    res.status(201).json(newNotification);
  } catch (err) {
    res.status(500).json({ error: "Failed to create notification" });
  }
});

// PATCH mark one as read
router.patch("/:id/read", async (req, res) => {
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

// PATCH mark all as read
router.patch("/mark-all-read", async (req, res) => {
  try {
    await Notification.updateMany({}, { $set: { read: true } });
    res.json({ message: "All notifications marked as read" });
  } catch (err) {
    res.status(500).json({ error: "Failed to mark all as read" });
  }
});

export default router;
