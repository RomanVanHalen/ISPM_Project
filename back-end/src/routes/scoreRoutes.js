import express from "express";
import Score from "../models/Score.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

// ✅ Save or update score for a module
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { score, total, module } = req.body;

    if (score === undefined || !module) {
      return res.status(400).json({ message: "Score and module are required" });
    }

    // ✅ Upsert: update if exists, else create
    const savedScore = await Score.findOneAndUpdate(
      { userId: req.user._id, module },
      { score, total },   // let mongoose handle updatedAt
      { new: true, upsert: true }
    );

    res.status(201).json({ message: "Score saved", data: savedScore });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Get all scores for logged-in user
router.get("/", authMiddleware, async (req, res) => {
  try {
    const scores = await Score.find({ userId: req.user._id }).sort({ createdAt: -1 });
    res.json(scores);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Get score for a specific module
router.get("/:module", authMiddleware, async (req, res) => {
  try {
    const score = await Score.findOne({
      userId: req.user._id,
      module: req.params.module,
    });

    if (!score) {
      return res.status(404).json({ message: "No score found" });
    }

    res.json({
      score: score.score,
      total: score.total,
      module: score.module,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;


