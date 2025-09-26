// routes/progressRoutes.js
import express from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import Progress from "../models/Progress.js";
import Score from "../models/Score.js"; // Import Score model
import PDFDocument from "pdfkit"; // For PDF generation

const router = express.Router();

//Get logged-in user progress (with quiz scores + details)
 
router.get("/me", authMiddleware, async (req, res) => {
  try {
    // 1. Fetch base progress record
    let progress = await Progress.findOne({ userId: req.user.id });

    // 🔥 If no record, create one with defaults
    if (!progress) {
      progress = await Progress.create({
        userId: req.user.id,
        policiesAcknowledged: 0,
        totalPolicies: 0,
        trainingsCompleted: 0,
        totalTrainings: 4, // since you have 4 modules
        quizAvgScore: 0,
        compliance: 0,
        trainings: {
          phishingSimulator: false,
          domain1: false,
          domain2: false,
          domain3: false,
        },
        details: [],
      });
    }

    // 2. Fetch quiz scores
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

    // 5. Merge progress data
    const enrichedProgress = {
      ...progress,
      quizAvgScore,
      compliance: quizAvgScore,
      trainings: progress.trainings,
      details: [...(progress.details || []), ...quizDetails],
    };

    res.json(enrichedProgress);
  } catch (err) {
    console.error("Error fetching progress:", err);
    res.status(500).json({ message: "Server error" });
  }
});

//Mark a training as completed
 
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
        $set: { [`trainings.${moduleName}`]: true }, // ✅ mark as completed
        $setOnInsert: { totalTrainings: validModules.length },
      },
      { new: true, upsert: true }
    );

    // Count completed trainings
    const trainingsCompleted = Object.values(progress.trainings).filter(
      (v) => v
    ).length;
    progress.trainingsCompleted = trainingsCompleted;

    await progress.save();
    res.json(progress);
  } catch (err) {
    console.error("Error updating training:", err);
    res.status(500).json({ message: "Server error" });
  }
});

//Add or update progress manually (policies/trainings/other)
//This keeps history in `details` instead of overwriting.

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
          totalTrainings: 4,
          quizAvgScore: 0,
          compliance: 0,
          trainings: {
            phishingSimulator: false,
            domain1: false,
            domain2: false,
            domain3: false,
          },
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
    console.error("Error saving progress:", err);
    res.status(500).json({ message: "Server error" });
  }
});

/**
 * Generate and download progress report (PDF)
 */
router.get("/report", authMiddleware, async (req, res) => {
  try {
    // Fetch progress & scores
    const progress = await Progress.findOne({ userId: req.user.id });
    const scores = await Score.find({ userId: req.user.id }).sort({
      updatedAt: -1,
    });

    const safeProgress = progress
      ? progress.toObject()
      : {
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

    // --- User info ---
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

    // --- Training Modules ---
    doc.fontSize(14).text("Training Modules", { underline: true });
    doc.moveDown(0.2);
    Object.entries(safeProgress.trainings || {}).forEach(([name, done], i) => {
      const labelMap = {
        phishingSimulator: "Phishing Simulator",
        domain1: "Domain 1",
        domain2: "Domain 2",
        domain3: "Domain 3",
      };
      doc
        .fontSize(11)
        .text(
          `${i + 1}. ${labelMap[name] || name} — ${
            done ? "✅ Completed" : "Not Completed"
          }`
        );
    });
    doc.moveDown();

    // --- Detailed progress log ---
    doc.fontSize(14).text("Detailed Progress Log", { underline: true });
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
    console.error("Error generating report:", err);
    res.status(500).json({ message: "Server error while generating report" });
  }
});

export default router;





