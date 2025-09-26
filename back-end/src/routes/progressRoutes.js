// routes/progressRoutes.js
import express from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import Progress from "../models/Progress.js";
import Score from "../models/Score.js";

const router = express.Router();

/**
 * Get logged-in user progress (with quiz scores + details)
 * Works even if user has no progress yet
 */
router.get("/me", authMiddleware, async (req, res) => {
  try {
    // 1. Fetch base progress record
    let progress = await Progress.findOne({ userId: req.user.id });

    // If no progress exists, create a default object
    if (!progress) {
      progress = {
        userId: req.user.id,
        policiesAcknowledged: 0,
        totalPolicies: 0,
        trainingsCompleted: 0,
        totalTrainings: 0,
        quizAvgScore: 0,
        compliance: 0,
        details: [],
      };
    } else {
      // Convert Mongoose doc to plain object
      progress = progress.toObject();
    }

    // 2. Fetch quiz scores for this user
    const scores = await Score.find({ userId: req.user.id });

    // 3. Compute quiz average
    let quizAvgScore = 0;
    if (scores.length > 0) {
      const totalScore = scores.reduce((sum, s) => sum + s.score, 0);
      const totalMax = scores.reduce((sum, s) => sum + (s.total || 0), 0);
      quizAvgScore = totalMax > 0 ? Math.round((totalScore / totalMax) * 100) : 0;
    }

    // 4. Build quiz details
    const quizDetails = scores.map((s) => ({
      type: "Quiz",
      title: s.module,
      status: `${s.score}/${s.total}`,
      lastUpdated: new Date(s.updatedAt).toLocaleDateString(),
    }));

    // 5. Merge details
    const enrichedProgress = {
      ...progress,
      quizAvgScore,
      compliance: quizAvgScore,
      details: [...(progress.details || []), ...quizDetails],
    };

    res.json(enrichedProgress);
  } catch (err) {
    console.error("❌ Error fetching progress:", err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
