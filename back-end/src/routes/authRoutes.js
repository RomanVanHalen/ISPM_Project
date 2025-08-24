import express from "express";
import {
  registerUser,
  loginUser,
  forgotPassword,
  resetPassword,
} from "../controllers/authController.js";

const router = express.Router();

// Auth routes
router.post("/register", registerUser);
router.post("/login", loginUser);

// Forgot password → sends reset email
router.post("/forgot-password", forgotPassword);

// Reset password → actually resets the password
router.post("/reset-password", resetPassword);

export default router;
