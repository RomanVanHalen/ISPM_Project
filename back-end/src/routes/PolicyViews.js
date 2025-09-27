import express from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import PolicyView from "../models/PolicyView.js";

const router = express.Router();

//  Log a new PDF view
// User is taken from authMiddleware (req.user)
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { policyId } = req.body;

    if (!policyId) {
      return res.status(400).json({ error: "policyId is required" });
    }

    // req.user is set by authMiddleware
    const userId = req.user._id;

    const view = await PolicyView.create({
      policyId,
      user: userId,
    });

    res.status(201).json({ message: "PDF view logged", view });
  } catch (err) {
    console.error("Error logging PDF view:", err);
    res.status(500).json({ error: "Failed to log PDF view" });
  }
});

//  (Optional) Get all views
router.get("/", authMiddleware, async (req, res) => {
  try {
    const views = await PolicyView.find().populate("policyId", "title");
    res.json(views);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch views" });
  }
});

export default router;

