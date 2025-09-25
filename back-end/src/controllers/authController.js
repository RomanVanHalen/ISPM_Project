import User from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import Notification from "../models/Notification.js";

// ================== Register User ==================
export const registerUser = async (req, res) => {
  try {
    const { name, email, password, role, profilePic } = req.body;

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "User already exists" });

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role,
      profilePic: profilePic || "https://via.placeholder.com/150",
      isVerified: true, // auto-verified since no email verification
    });

    // Create JWT token
    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.status(201).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        profilePic: user.profilePic,
      },
      message: "Registration successful!",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ================== Login User ==================
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check user
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    // Create token
    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    // ✅ record this login (admins will see all; user will be served only their latest)
    await Notification.create({
      userId: user._id,
      title: "Login Successful",
      body: `${user.name} logged in successfully.`,
      link: user.role?.toLowerCase() === "admin" ? "/admin-dashboard" : "/employee-dashboard",
      type: "login",
    // read: false by default
    });

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
         role: user.role.toLowerCase(),
        profilePic: user.profilePic,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ================== Forgot Password ==================
export const forgotPassword = async (req, res) => {
  res.status(501).json({ message: "Forgot password not implemented yet." });
};

// ================== Reset Password ==================
export const resetPassword = async (req, res) => {
  res.status(501).json({ message: "Reset password not implemented yet." });
};

// ================== Update Profile ==================
export const updateProfile = async (req, res) => {
  try {
    const userId = req.user.id; // provided by auth middleware
    const { name, email, password } = req.body;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Update text fields
    user.name = name || user.name;
    user.email = email || user.email;

    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      user.password = hashedPassword;
    }

    // Handle uploaded file
    if (req.file) {
      user.profilePic = `/uploads/${req.file.filename}`;
    }

    await user.save();

    res.json({
      message: "Profile updated successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role.toLowerCase(),
        profilePic: user.profilePic,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};











