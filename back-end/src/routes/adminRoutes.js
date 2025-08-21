import express from "express";
import User from "../models/User.js";
import multer from "multer";
import path from "path";
import fs from "fs";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { authorizeRoles } from "../middleware/roleMiddleware.js";


const router = express.Router();

// Ensure uploads folder exists
const UPLOADS_FOLDER = "uploads";
if (!fs.existsSync(UPLOADS_FOLDER)) fs.mkdirSync(UPLOADS_FOLDER);

// Serve uploads folder statically
router.use("/uploads", express.static(path.join(process.cwd(), UPLOADS_FOLDER)));

// Multer setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOADS_FOLDER),
  filename: (req, file, cb) => {
    cb(null, req.params.id + "_" + Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage });

// 🟢 Get total user count (admin only)
router.get(
  "/count",
  authMiddleware,
  authorizeRoles("admin"),
  async (req, res) => {
    try {
      const count = await User.countDocuments();
      res.json({ count });
    } catch (err) {
      console.error("Error getting user count:", err);
      res.status(500).json({ error: "Server error" });
    }
  }
);

// 🟢 Get all users (admin only)
router.get(
  "/users",
  authMiddleware,
  authorizeRoles("admin"),
  async (req, res) => {
    try {
      const users = await User.find({}, "name email role profilePicture createdAt");
      res.json(users);
    } catch (err) {
      console.error("Error fetching users:", err);
      res.status(500).json({ error: "Server error" });
    }
  }
);

// 🔴 Delete a user (admin only)
router.delete(
  "/users/:id",
  authMiddleware,
  authorizeRoles("admin"),
  async (req, res) => {
    try {
      const user = await User.findByIdAndDelete(req.params.id);
      if (!user) return res.status(404).json({ error: "User not found" });

      // Optionally delete profile picture from disk
      if (user.profilePicture) {
        const filePath = path.join(
          UPLOADS_FOLDER,
          path.basename(user.profilePicture)
        );
        if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
      }

      res.json({ message: "User deleted successfully" });
    } catch (err) {
      console.error("Error deleting user:", err);
      res.status(500).json({ error: "Server error" });
    }
  }
);

// 🟡 Update user (admin only, supports profile picture)
router.put(
  "/users/:id",
  authMiddleware,
  authorizeRoles("admin"),
  upload.single("profilePicture"),
  async (req, res) => {
    try {
      const { name, email, role } = req.body;

      const user = await User.findById(req.params.id);
      if (!user) return res.status(404).json({ error: "User not found" });

      if (name) user.name = name;
      if (email) user.email = email;
      if (role) user.role = role;

      if (req.file) {
        // Optionally delete old profile picture
        if (user.profilePicture) {
          const oldPath = path.join(UPLOADS_FOLDER, path.basename(user.profilePicture));
          if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
        }

        user.profilePicture = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;
      }

      await user.save();
      res.json({ message: "User updated successfully", user });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Server error" });
    }
  }
);

export default router;
