import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import express from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import PolicyView from "../models/PolicyView.js";
import Notification from "../models/Notification.js";

const router = express.Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ==========================
// GET /api/policies → return all policies
// ==========================
router.get("/", async (req, res) => {
  try {
    const policiesFile = path.join(__dirname, "../policies.json");
    const data = fs.readFileSync(policiesFile, "utf8");
    const policies = JSON.parse(data);

    res.json(policies); // send array of policies
  } catch (err) {
    console.error("Failed to read policies:", err);
    res.status(500).json({ error: "Failed to load policies" });
  }
});

// ==========================
// POST /api/policies → log policy view + create notification
// ==========================
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { policyId } = req.body;
    if (!policyId) return res.status(400).json({ error: "policyId is required" });

    const userId = req.user._id;

    // Log policy view
    const view = await PolicyView.create({ policyId, user: userId });

    // Read policies.json
    const policiesFile = path.join(__dirname, "../policies.json");
    const data = fs.readFileSync(policiesFile, "utf8");
    const policies = JSON.parse(data);

    // Find policy by ID
    const policy = policies.find((p) => p._id === policyId);

    // Create notification
    const notif = await Notification.create({
      userId,
      type: "policy",
      title: "Policy Viewed",
      body: `You viewed policy: ${policy?.title || "Unknown Policy"}`,
      link: `/policies/${policyId}`,
    });

    res.status(201).json({ message: "Policy view logged and notification created", view, notification: notif });
  } catch (err) {
    console.error("Policy view error:", err);
    res.status(500).json({ error: "Failed to log policy view" });
  }
});

export default router;
