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

// Get total user count
router.get("/count", authMiddleware, authorizeRoles("admin"), async (req, res) => {
  try {
    const count = await User.countDocuments();
    res.json({ count });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

//  Get all users
router.get("/users", authMiddleware, authorizeRoles("admin"), async (req, res) => {
  try {
    const users = await User.find({}, "name email role profilePic createdAt").sort({ createdAt: -1 });
    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

//  Get user registration stats (line chart)
router.get("/user-stats", authMiddleware, authorizeRoles("admin"), async (req, res) => {
  try {
    const stats = await User.aggregate([
      { $group: { _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } }, count: { $sum: 1 } } },
      { $sort: { _id: 1 } }
    ]);

    const formatted = stats.map(item => ({ date: item._id, count: item.count }));
    res.json(formatted);
  } catch (err) {
    console.error("Error fetching user stats:", err);
    res.status(500).json({ error: "Server error" });
  }
});

//  Get role stats (pie chart)
router.get("/role-stats", authMiddleware, authorizeRoles("admin"), async (req, res) => {
  try {
    const employees = await User.countDocuments({ role: "employee" });
    const admins = await User.countDocuments({ role: "admin" });

    res.json([
      { name: "Employees", value: employees },
      { name: "Admins", value: admins },
    ]);
  } catch (err) {
    console.error("Error fetching role stats:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// Delete a user
router.delete("/users/:id", authMiddleware, authorizeRoles("admin"), async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ error: "User not found" });

    if (user.profilePic) {
      const filePath = path.join(UPLOADS_FOLDER, path.basename(user.profilePic));
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    }

    res.json({ message: "User deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// Update user
router.put("/users/:id", authMiddleware, authorizeRoles("admin"), upload.single("profilePic"), async (req, res) => {
  try {
    const { name, email, role } = req.body;
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ error: "User not found" });

    if (name) user.name = name;
    if (email) user.email = email;
    if (role) user.role = role;

    if (req.file) {
      if (user.profilePic) {
        const oldPath = path.join(UPLOADS_FOLDER, path.basename(user.profilePic));
        if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
      }
      user.profilePic = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;
    }

    await user.save();
    res.json({ message: "User updated successfully", user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

console.log("✅ Admin routes loaded");

export default router;
