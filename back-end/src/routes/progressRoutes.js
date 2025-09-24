// routes/progressRoutes.js
import express from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import Progress from "../models/Progress.js";

const router = express.Router();

// ✅ Get logged-in user progress
router.get("/me", authMiddleware, async (req, res) => {
  try {
    const progress = await Progress.findOne({ userId: req.user.id });
    if (!progress) {
      return res.status(404).json({ message: "Progress not found" });
    }
    res.json(progress);
  } catch (err) {
    console.error("Error fetching progress:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ Create or update progress
router.post("/", authMiddleware, async (req, res) => {
  try {
    const progress = await Progress.findOneAndUpdate(
      { userId: req.user.id },
      { ...req.body, userId: req.user.id },
      { new: true, upsert: true }
    );
    res.status(201).json(progress);
  } catch (err) {
    console.error("Error saving progress:", err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;

