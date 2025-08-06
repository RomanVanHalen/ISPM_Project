import express from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { authorizeRoles } from "../middleware/roleMiddleware.js";
import User from "../models/User.js";

const router = express.Router();

// 🟢 Protected route for all logged-in users
router.get("/profile", authMiddleware, (req, res) => {
  res.json({
    message: `Welcome ${req.user.name}, your role is ${req.user.role}`
  });
});

// 🔴 Admin-only route
router.get("/all-users", authMiddleware, authorizeRoles("admin"), async (req, res) => {
  const users = await User.find().select("-password");
  res.json(users);
});

export default router;