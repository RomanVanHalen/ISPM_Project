/*import express from "express";
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
    cb(null, req.user.id + "_" + Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage });

// ================== Get logged-in user's profile =================
router.get("/profile", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });

    // Send consistent field names
    const userObj = {
      name: user.name,
      email: user.email,
      bio: user.bio || "",
      profilePicture: user.profilePicture
        ? `${req.protocol}://${req.get("host")}${user.profilePicture}`
        : null,
    };

    res.json(userObj);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// ================== Update logged-in user's profile ==================
router.put(
  "/profile",
  authMiddleware,
  upload.single("profilePicture"),
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
        // Store relative path in DB
        user.profilePicture = `/uploads/${req.file.filename}`;
      }

      await user.save();

      const updatedUser = {
        name: user.name,
        email: user.email,
        bio: user.bio || "",
        profilePicture: user.profilePicture
          ? `${req.protocol}://${req.get("host")}${user.profilePicture}`
          : null,
      };

      res.json({ message: "Profile updated successfully", user: updatedUser });
    } catch (err) {
      res.status(500).json({ message: "Server error", error: err.message });
    }
  }
);

// ================== Admin-only route: get all users ==================
router.get(
  "/all-users",
  authMiddleware,
  authorizeRoles("admin"),
  async (req, res) => {
    try {
      const users = await User.find().select("-password");

      const usersWithFullURL = users.map((u) => ({
        name: u.name,
        email: u.email,
        bio: u.bio || "",
        profilePicture: u.profilePicture
          ? `${req.protocol}://${req.get("host")}${u.profilePicture}`
          : null,
      }));

      res.json(usersWithFullURL);
    } catch (err) {
      res.status(500).json({ message: "Server error", error: err.message });
    }
  }
);

export default router;    */



import express from "express";
import bcrypt from "bcrypt";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { authorizeRoles } from "../middleware/roleMiddleware.js";
import User from "../models/User.js";
import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const router = express.Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ✅ Point to same folder as server.js
const UPLOADS_FOLDER = path.join(__dirname, "../uploads");
fs.mkdirSync(UPLOADS_FOLDER, { recursive: true });

// Multer setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOADS_FOLDER),
  filename: (req, file, cb) => {
    cb(null, req.user.id + "_" + Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage });

// Build full URL for image
function toPublicUrl(req, relativePath) {
  if (!relativePath) return null;
  return `${req.protocol}://${req.get("host")}${relativePath}`;
}

// Standardized user object
function userResponse(u, req) {
  return {
    username: u.username || u.name || "",
    email: u.email,
    role: u.role || "employee",
    bio: u.bio || "",
    profilePic: u.profilePicture ? toPublicUrl(req, u.profilePicture) : null,
  };
}

// ================== Get profile ==================
router.get("/profile", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(userResponse(user, req));
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// ================== Update profile ==================
router.put(
  "/profile",
  authMiddleware,
  upload.single("profilePicture"),
  async (req, res) => {
    try {
      const { username, email, password, bio, removeProfilePicture } = req.body;
      const user = await User.findById(req.user.id);
      if (!user) return res.status(404).json({ message: "User not found" });

      // Fields
      if (username?.trim()) {
        user.username = username.trim();
        user.name = username.trim(); // backward compatibility
      }
      if (email?.trim()) user.email = email.trim();
      if (bio !== undefined) user.bio = bio;
      if (password?.trim()) user.password = await bcrypt.hash(password, 10);

      if (String(removeProfilePicture).toLowerCase() === "true") {
        user.profilePicture = undefined;
      }

      if (req.file) {
        user.profilePicture = `/uploads/${req.file.filename}`;
      }

      await user.save();
      res.json(userResponse(user, req));
    } catch (err) {
      res.status(500).json({ message: "Server error", error: err.message });
    }
  }
);

// ================== Admin-only route ==================
router.get(
  "/all-users",
  authMiddleware,
  authorizeRoles("admin"),
  async (req, res) => {
    try {
      const users = await User.find().select("-password");
      res.json(users.map((u) => userResponse(u, req)));
    } catch (err) {
      res.status(500).json({ message: "Server error", error: err.message });
    }
  }
);

export default router;



