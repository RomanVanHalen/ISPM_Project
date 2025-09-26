// routes/adminProgressRoutes.js
import express from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import Progress from "../models/Progress.js";
import Score from "../models/Score.js";
import User from "../models/User.js";

const router = express.Router();

/**
 * ✅ Get progress for ALL users (admin view)
 */
router.get("/", authMiddleware, async (req, res) => {
  try {
    console.log("🔧 Admin progress route hit by:", req.user.email);

    // Fetch all users, progress, and scores
    const users = await User.find({}, { password: 0 }).lean();
    const allProgress = await Progress.find({}).lean();
    const allScores = await Score.find({}).lean();

    const result = users.map((user) => {
      const userProgress = allProgress.find(
        (p) => p.userId?.toString() === user._id.toString()
      );

      const userScores = allScores.filter(
        (s) => s.userId?.toString() === user._id.toString()
      );

      // Compute quiz average
      let quizAvgScore = 0;
      if (userScores.length > 0) {
        const totalScore = userScores.reduce((sum, s) => sum + (s.score || 0), 0);
        const totalMax = userScores.reduce((sum, s) => sum + (s.total || 0), 0);
        quizAvgScore = totalMax > 0 ? Math.round((totalScore / totalMax) * 100) : 0;
      }

      // Quiz details
      const quizDetails = userScores.map((s) => ({
        type: "Quiz",
        title: s.module,
        status: `${s.score}/${s.total}`,
        lastUpdated: new Date(s.updatedAt).toISOString(),
      }));

      // Merge static + quiz details
      const safeProgress = userProgress || {
        policiesAcknowledged: 0,
        totalPolicies: 0,
        trainingsCompleted: 0,
        totalTrainings: 0,
        quizAvgScore: 0,
        compliance: 0,
        details: [],
      };

      return {
        name: user.name || user.email,
        email: user.email,
        trainingsCompleted: safeProgress.trainingsCompleted || 0,
        totalTrainings: safeProgress.totalTrainings || 0,
        policiesAcknowledged: safeProgress.policiesAcknowledged || 0,
        totalPolicies: safeProgress.totalPolicies || 0,
        quizAvgScore,
        compliance: quizAvgScore, // ✅ reuse avg as compliance
        details: [...(safeProgress.details || []), ...quizDetails],
      };
    });

    console.log(`📊 Built result: ${result.length} rows`);
    res.json(result);
  } catch (err) {
    console.error("❌ Error fetching all users progress:", err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
