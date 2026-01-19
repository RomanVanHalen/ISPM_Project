// routes/scoreRoutes.js
import express from "express";
import Score from "../models/Score.js";
import Progress from "../models/Progress.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

/**
 * POST /api/score
 * Body: { score: Number, total: Number, module: String }
 * `module` can be either a friendly name (e.g. "Data Privacy & Protection")
 * or a backend key (e.g. "domain1"). We map friendly → backend keys below.
 */
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { score, total, module } = req.body;

    if (score === undefined || module === undefined) {
      return res.status(400).json({ message: "Score and module are required" });
    }

    // Map friendly frontend names -> backend training keys (adjust to your app)
    const moduleMap = {
      "Core Information Security Standards": "module1",
      "Phishing Awareness": "module3",
      "Data Privacy & Protection": "module2",
      "Cyber Governance & Compliance": "module4",
      // add other mappings as needed
    };

    const backendModule = moduleMap[module] || module; // if already a backend key, use it
    const userId = req.user._id || req.user.id;

    // === Optionally require pass threshold before marking training complete ===
    // const passThreshold = 0.7;
    // const passed = typeof total === "number" && total > 0 ? (score / total) >= passThreshold : true;
    // If you want to only mark completed when passed, use `passed` below to gate the update.

    // 1) Upsert Score — always include userId & module
    const savedScore = await Score.findOneAndUpdate(
      { userId, module: backendModule },
      {
        $set: {
          userId,
          module: backendModule,
          score,
          total,
        },
      },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );

    // 2) Mark training complete in Progress (upsert Progress if not exists)
    const progress = await Progress.findOneAndUpdate(
      { userId },
      {
        $set: { [`trainings.${backendModule}`]: true },
        $setOnInsert: {
          totalTrainings: 4,
          trainings: {
            phishingSimulator: false,
            domain1: false,
            domain2: false,
            domain3: false,
          },
        },
      },
      { new: true, upsert: true }
    );

    // 3) Recalculate trainingsCompleted and persist
    progress.trainingsCompleted = Object.values(progress.trainings || {}).filter(Boolean).length;
    await progress.save();

    return res.status(201).json({
      message: "Score saved & training module marked complete",
      score: savedScore,
      progress,
    });
  } catch (err) {
    console.error("Error saving score & updating training:", err);
    return res.status(500).json({ error: err.message || "Server error" });
  }
});

// GET all scores for logged-in user
router.get("/", authMiddleware, async (req, res) => {
  try {
    const userId = req.user._id || req.user.id;
    const scores = await Score.find({ userId }).sort({ createdAt: -1 });
    res.json(scores);
  } catch (err) {
    console.error("Error fetching scores:", err);
    res.status(500).json({ error: err.message });
  }
});

// GET score for a specific module
router.get("/:module", authMiddleware, async (req, res) => {
  try {
    const userId = req.user._id || req.user.id;
    const moduleParam = req.params.module;
    const score = await Score.findOne({ userId, module: moduleParam });

    if (!score) {
      return res.status(404).json({ message: "No score found" });
    }

    res.json({
      score: score.score,
      total: score.total,
      module: score.module,
      updatedAt: score.updatedAt,
    });
  } catch (err) {
    console.error("Error fetching score:", err);
    res.status(500).json({ error: err.message });
  }
});

export default router;




