// routes/progressRoutes.js
import express from "express";
import Progress from "../models/Progress.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

/**
 * ✅ Mark a training module as completed
 */
router.post("/complete-training", authMiddleware, async (req, res) => {
  try {
    const { moduleName } = req.body; // e.g. "phishingSimulator"

    const validModules = ["phishingSimulator", "domain1", "domain2", "domain3"];

    if (!validModules.includes(moduleName)) {
      return res.status(400).json({ message: "Invalid module name" });
    }

    const progress = await Progress.findOneAndUpdate(
      { userId: req.user.id },
      {
        $set: { [`trainings.${moduleName}`]: true },
        $setOnInsert: { totalTrainings: validModules.length },
      },
      { new: true, upsert: true }
    );

    // Recalculate dynamically
    progress.trainingsCompleted = Object.values(progress.trainings).filter(
      (v) => v
    ).length;

    progress.totalTrainings = Object.keys(progress.trainings).length;

    await progress.save();

    res.json(progress);
  } catch (err) {
    console.error("Error completing training:", err);
    res.status(500).json({ message: "Server error" });
  }
});

/**
 * Get current user's progress
 */
router.get("/me", authMiddleware, async (req, res) => {
  try {
    const progress = await Progress.findOne({ userId: req.user.id });

    if (!progress) {
      return res.json({
        policiesAcknowledged: 0,
        totalPolicies: 0,
        trainingsCompleted: 0,
        totalTrainings: 4,
        trainings: {
          phishingSimulator: false,
          domain1: false,
          domain2: false,
          domain3: false,
        },
        quizAvgScore: 0,
        compliance: 0,
        details: [],
      });
    }

    // Recalculate quiz/compliance safely
    const quizAvgScore = progress.quizAvgScore || 0;

    const enrichedProgress = {
      ...progress.toObject(),
      quizAvgScore,
      compliance: quizAvgScore, // adjust later if compliance formula changes
    };

    res.json(enrichedProgress);
  } catch (err) {
    console.error("Error fetching progress:", err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;


