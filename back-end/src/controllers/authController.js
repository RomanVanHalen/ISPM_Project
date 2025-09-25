import User from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import Notification from "../models/Notification.js";

// ================== Register User ==================
export const registerUser = async (req, res) => {
  try {
    const { name, email, password, role, profilePic } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role,
      profilePic: profilePic || "https://via.placeholder.com/150",
    });

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

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

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

// ================== Google OAuth Login ==================
export const googleLogin = async (req, res) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({ message: "Google token is required" });
    }

    // Verify Google token
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { email, name, picture, sub: googleId } = payload;

    // Check if user already exists
    let user = await User.findOne({ email });

    if (!user) {
      // Create new user if doesn't exist
      user = await User.create({
        name,
        email,
        googleId,
        profilePic: picture || "https://via.placeholder.com/150",
        role: "employee", // default role
        isVerified: true,
        // Generate a secure random password for Google OAuth users
        password: await bcrypt.hash(googleId + process.env.JWT_SECRET + Date.now(), 10),
      });
    } else {
      // Update existing user with googleId if not present
      if (!user.googleId) {
        user.googleId = googleId;
        user.isVerified = true;
      }

      // Update profile picture if available and different
      if (picture && user.profilePic !== picture) {
        user.profilePic = picture;
      }

      await user.save();
    }

    // Generate JWT token
    const jwtToken = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.json({
      token: jwtToken,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role.toLowerCase(),
        profilePic: user.profilePic,
      },
    });
  } catch (error) {
    console.error("Google login error:", error);
    res.status(400).json({ 
      message: "Google authentication failed", 
      error: error.message 
    });
  }
};

// ================== Forgot Password ==================
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if user registered via Google OAuth
    if (user.googleId) {
      return res.status(400).json({ 
        message: "This account is registered with Google. Please use Google Sign-In." 
      });
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes expiry

    // Save OTP and expiry to user
    user.resetPasswordOTP = otp;
    user.resetPasswordOTPExpiry = otpExpiry;
    await user.save();

    // Send OTP via email
    const transporter = createTransporter();
    
    const mailOptions = {
      from: process.env.GMAIL_USER,
      to: user.email,
      subject: "Password Reset OTP - Cyber Warriors",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Password Reset Request</h2>
          <p>Hello ${user.name},</p>
          <p>You requested to reset your password. Use the OTP below to proceed:</p>
          <div style="background: #f4f4f4; padding: 15px; border-radius: 5px; text-align: center; margin: 20px 0;">
            <h1 style="margin: 0; color: #333; letter-spacing: 5px;">${otp}</h1>
          </div>
          <p>This OTP will expire in 10 minutes.</p>
          <p>If you didn't request this, please ignore this email.</p>
          <br>
          <p>Best regards,<br>Cyber Warriors Team</p>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);

    res.json({ 
      message: "Password reset OTP sent to your email",
      email: user.email
    });

  } catch (error) {
    console.error("Forgot password error:", error);
    res.status(500).json({ message: "Error sending reset email: " + error.message });
  }
};

// ================== Reset Password ==================
export const resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if user registered via Google OAuth
    if (user.googleId) {
      return res.status(400).json({ 
        message: "This account is registered with Google. Please use Google Sign-In." 
      });
    }

    // Check if OTP matches and is not expired
    if (user.resetPasswordOTP !== otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    if (user.resetPasswordOTPExpiry < new Date()) {
      return res.status(400).json({ message: "OTP has expired" });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update password and clear OTP fields
    user.password = hashedPassword;
    user.resetPasswordOTP = undefined;
    user.resetPasswordOTPExpiry = undefined;
    await user.save();

    res.json({ message: "Password reset successfully" });

  } catch (error) {
    console.error("Reset password error:", error);
    res.status(500).json({ message: "Error resetting password" });
  }
};

// ================== Update Profile ==================
export const updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const { name, email, password } = req.body;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Don't allow Google OAuth users to change password via this method
    if (password && user.googleId) {
      return res.status(400).json({ 
        message: "Google OAuth users cannot change password here. Use Google account settings." 
      });
    }

    user.name = name || user.name;
    user.email = email || user.email;

    if (password && !user.googleId) {
      const hashedPassword = await bcrypt.hash(password, 10);
      user.password = hashedPassword;
    }

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











