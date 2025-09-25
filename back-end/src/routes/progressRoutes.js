// routes/progressRoutes.js
import express from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import Progress from "../models/Progress.js";
import Score from "../models/Score.js"; // ✅ Import Score model
import PDFDocument from "pdfkit"; // ✅ For PDF generation

const router = express.Router();

/**
 * ✅ Get logged-in user progress (with quiz scores + details)
 */
router.get("/me", authMiddleware, async (req, res) => {
  try {
    // 1. Fetch base progress record
    let progress = await Progress.findOne({ userId: req.user.id });
    if (!progress) {
      return res.status(404).json({ message: "Progress not found" });
    }

    // 2. Fetch quiz scores for this user
    const scores = await Score.find({ userId: req.user.id });

    // 3. Compute quiz average
    let quizAvgScore = 0;
    if (scores.length > 0) {
      const totalScore = scores.reduce((sum, s) => sum + s.score, 0);
      const totalMax = scores.reduce((sum, s) => sum + (s.total || 0), 0);
      quizAvgScore =
        totalMax > 0 ? Math.round((totalScore / totalMax) * 100) : 0;
    }

    // 4. Build quiz details (fresh each request so they don’t duplicate)
    const quizDetails = scores.map((s) => ({
      type: "Quiz",
      title: s.module,
      status: `${s.score}/${s.total}`,
      lastUpdated: new Date(s.updatedAt).toLocaleDateString(),
    }));

    // 5. Merge static details (policies/trainings) + quiz details
    const enrichedProgress = {
      ...progress.toObject(),
      quizAvgScore,
      compliance: quizAvgScore, // ✅ using quiz avg as compliance for now
      details: [...(progress.details || []), ...quizDetails],
    };

    res.json(enrichedProgress);
  } catch (err) {
    console.error("❌ Error fetching progress:", err);
    res.status(500).json({ message: "Server error" });
  }
});

/**
 * ✅ Add or update progress manually (policies/trainings)
 * This keeps history in `details` instead of overwriting.
 */
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { type, title, status } = req.body;

    const progress = await Progress.findOneAndUpdate(
      { userId: req.user.id },
      {
        $setOnInsert: {
          policiesAcknowledged: 0,
          totalPolicies: 0,
          trainingsCompleted: 0,
          totalTrainings: 0,
          quizAvgScore: 0,
          compliance: 0,
        },
        $push: {
          details: {
            type,
            title,
            status,
            lastUpdated: new Date().toISOString(),
          },
        },
      },
      { new: true, upsert: true }
    );

    res.status(201).json(progress);
  } catch (err) {
    console.error("❌ Error saving progress:", err);
    res.status(500).json({ message: "Server error" });
  }
});

/**
 * ✅ Generate and download progress report (PDF)
 */
router.get("/report", authMiddleware, async (req, res) => {
  try {
    // Fetch progress & scores
    const progress = await Progress.findOne({ userId: req.user.id });
    const scores = await Score.find({ userId: req.user.id }).sort({
      updatedAt: -1,
    });

    // Ensure we always have a progress object
    const safeProgress = progress
      ? progress.toObject()
      : {
          policiesAcknowledged: 0,
          totalPolicies: 0,
          trainingsCompleted: 0,
          totalTrainings: 0,
          quizAvgScore: 0,
          compliance: 0,
          details: [],
        };

    // Setup headers
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="progress-report-${req.user._id}.pdf"`
    );

    const doc = new PDFDocument({ size: "A4", margin: 50 });
    doc.pipe(res);

    // --- Header ---
    doc.fontSize(20).text("Progress Report", { align: "center" });
    doc.moveDown(0.5);
    doc
      .fontSize(10)
      .text(`Generated: ${new Date().toLocaleString()}`, { align: "center" });
    doc.moveDown();

    // User info
    const userName = req.user?.name || req.user?.email || "User";
    doc.fontSize(12).text(`User: ${userName}`);
    doc.text(`User ID: ${req.user._id}`);
    doc.moveDown();

    // --- Summary ---
    doc.fontSize(14).text("Summary", { underline: true });
    doc.moveDown(0.2);
    doc
      .fontSize(12)
      .text(
        `Policies Acknowledged: ${safeProgress.policiesAcknowledged} / ${safeProgress.totalPolicies}`
      )
      .text(
        `Trainings Completed: ${safeProgress.trainingsCompleted} / ${safeProgress.totalTrainings}`
      )
      .text(`Quiz Average Score: ${safeProgress.quizAvgScore || 0}%`)
      .text(`Compliance: ${safeProgress.compliance || 0}%`);
    doc.moveDown();

    // --- Detailed progress ---
    doc.fontSize(14).text("Detailed Progress", { underline: true });
    doc.moveDown(0.2);
    if ((safeProgress.details || []).length === 0) {
      doc.fontSize(11).text("No saved progress details.");
    } else {
      safeProgress.details.forEach((d, i) => {
        doc
          .fontSize(11)
          .text(
            `${i + 1}. [${d.type}] ${d.title} — ${d.status} (${d.lastUpdated})`
          );
      });
    }
    doc.moveDown();

    // --- Quiz/Score Entries ---
    doc.addPage();
    doc.fontSize(16).text("Quiz / Module Scores", { underline: true });
    doc.moveDown(0.5);

    if (!scores || scores.length === 0) {
      doc.fontSize(12).text("No quiz/module scores found.");
    } else {
      // Header row
      const tableTop = doc.y;
      doc.fontSize(12).text("No.", 50, tableTop);
      doc.text("Module", 90, tableTop);
      doc.text("Score", 340, tableTop);
      doc.text("Total", 410, tableTop);
      doc.text("Updated", 470, tableTop);
      doc.moveDown(0.5);

      // Rows
      scores.forEach((s, idx) => {
        const y = doc.y;
        doc.fontSize(11).text(String(idx + 1), 50, y);
        doc.text(s.module || "Module", 90, y, { width: 240 });
        doc.text(String(s.score ?? "-"), 340, y);
        doc.text(String(s.total ?? "-"), 410, y);
        doc.text(new Date(s.updatedAt).toLocaleDateString(), 470, y);
        doc.moveDown(0.6);
      });
    }

    doc.end();
  } catch (err) {
    console.error("❌ Error generating report:", err);
    res.status(500).json({ message: "Server error while generating report" });
  }
});

export default router;




