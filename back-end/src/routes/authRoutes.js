import express from "express";
import {
  registerUser,
  loginUser,
  forgotPassword,
  resetPassword,
  updateProfile,
} from "../controllers/authController.js";

const router = express.Router();

// Auth routes
router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

export default router;