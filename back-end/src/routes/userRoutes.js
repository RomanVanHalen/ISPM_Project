import express from "express";
import bcrypt from "bcrypt";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { authorizeRoles } from "../middleware/roleMiddleware.js";
import User from "../models/User.js";
import multer from "multer";
import path from "path";
import fs from "fs";

const router = express.Router();

// Ensure 'uploads' folder exists
const UPLOADS_FOLDER = "uploads";
if (!fs.existsSync(UPLOADS_FOLDER)) fs.mkdirSync(UPLOADS_FOLDER);

// Serve uploads folder statically
router.use("/uploads", express.static(path.join(process.cwd(), UPLOADS_FOLDER)));

// Multer setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOADS_FOLDER),
  filename: (req, file, cb) => {
    cb(
      null,
      req.user.id + "_" + Date.now() + path.extname(file.originalname)
    );
  },
});
const upload = multer({ storage });

// 🟢 Get logged-in user's profile
router.get("/profile", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// 🟡 Update logged-in user's profile
router.put(
  "/profile",
  authMiddleware,
  upload.single("profilePicture"), // handle file upload
  async (req, res) => {
    try {
      const { name, email, password, bio } = req.body;

      const user = await User.findById(req.user.id);
      if (!user) return res.status(404).json({ message: "User not found" });

      if (name) user.name = name;
      if (email) user.email = email;
      if (password) user.password = await bcrypt.hash(password, 10);
      if (bio) user.bio = bio;

      if (req.file) {
        // Use relative URL so frontend can access
        user.profilePicture = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;
      }

      await user.save();
      const userObj = user.toObject();
      delete userObj.password;

      res.json({ message: "Profile updated successfully", user: userObj });
    } catch (err) {
      res.status(500).json({ message: "Server error", error: err.message });
    }
  }
);

// 🔴 Admin-only route: get all users
router.get(
  "/all-users",
  authMiddleware,
  authorizeRoles("admin"),
  async (req, res) => {
    try {
      const users = await User.find().select("-password");
      res.json(users);
    } catch (err) {
      res.status(500).json({ message: "Server error", error: err.message });
    }
  }
);

export default router;
