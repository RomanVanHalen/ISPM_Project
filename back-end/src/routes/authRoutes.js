import express from "express";
import {
  registerUser,
  loginUser,
  forgotPassword,
  resetPassword,
  updateProfile,
  googleLogin,
} from "../controllers/authController.js";

const router = express.Router();

// Auth routes
router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/google", googleLogin); // New Google OAuth route
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

export default router;