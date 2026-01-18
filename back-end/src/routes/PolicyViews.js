// routes/policyViews.js
import express from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import PolicyView from "../models/PolicyView.js";
import Notification from "../models/Notification.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const router = express.Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Path to policies.json
const policiesFile = path.join(__dirname, "../policies.json");

// POST /api/policy-views → log PDF view
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { policyId } = req.body;

    if (!policyId || typeof policyId !== "string") {
      return res.status(400).json({ error: "policyId must be a valid string" });
    }

    const userId = req.user?._id;
    if (!userId) return res.status(401).json({ error: "User not logged in" });

    console.log("Logging PDF view:", { userId, policyId });

    // Check if view exists
    let view = await PolicyView.findOne({ user: userId, policyId });

    if (view) {
      view.count += 1;
      view.lastViewedAt = new Date();
      await view.save();
      console.log("Updated existing view:", view);
    } else {
      view = await PolicyView.create({ user: userId, policyId, count: 1 });
      console.log("Created new view:", view);
    }

    // Read policies.json
    let policies = [];
    try {
      const data = fs.readFileSync(policiesFile, "utf8");
      policies = JSON.parse(data);
    } catch (err) {
      console.error("Failed to read policies.json:", err);
    }

    const policy = policies.find((p) => p._id === policyId);

    // Create notification
    if (policy) {
      await Notification.create({
        userId,
        type: "policy",
        title: "Policy Viewed",
        body: `You viewed policy: ${policy.title}`,
        link: `/policies/${policyId}`,
      });
    }

    res.status(201).json({ message: "Policy view logged", view });
  } catch (err) {
    console.error("PolicyView create error:", err);
    res.status(500).json({ error: "Failed to log policy view" });
  }
});

// GET /api/policy-views/user → fetch logged views for user
router.get("/user", authMiddleware, async (req, res) => {
  try {
    const views = await PolicyView.find({ user: req.user._id });
    res.json(views);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch user views" });
  }
});

// Test endpoint
router.get("/test", authMiddleware, async (req, res) => {
  try {
    const fakePolicyId = "policy1"; // replace with valid _id from JSON
    const userId = req.user._id;

    let view = await PolicyView.findOne({ user: userId, policyId: fakePolicyId });
    if (view) {
      view.count += 1;
      view.lastViewedAt = new Date();
      await view.save();
    } else {
      view = await PolicyView.create({ user: userId, policyId: fakePolicyId, count: 1 });
    }

    res.json({ message: "Test view logged", view });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed test logging" });
  }
});

export default router;
