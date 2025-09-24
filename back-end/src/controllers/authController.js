import User from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import createTransporter from "../config/gmail.js";

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
  try {
    const { email } = req.body;
    
    console.log('📧 Forgot password request received for:', email);

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      console.log('❌ User not found in database');
      return res.status(404).json({ message: "User not found" });
    }

    console.log('✅ User found:', user.name);

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes expiry

    console.log('🔑 Generated OTP:', otp);

    // Save OTP and expiry to user
    user.resetPasswordOTP = otp;
    user.resetPasswordOTPExpiry = otpExpiry;
    await user.save();

    console.log('✅ OTP saved to user document');

    try {
      // Send OTP via email
      console.log('📤 Attempting to create email transporter...');
      const transporter = await createTransporter();
      console.log('✅ Transporter created successfully');
      
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

      console.log('📧 Sending email to:', user.email);
      const emailResult = await transporter.sendMail(mailOptions);
      console.log('✅ Email sent successfully! Message ID:', emailResult.messageId);

      res.json({ 
        message: "Password reset OTP sent to your email",
        email: user.email
      });

    } catch (emailError) {
      console.error('❌ Email sending failed:', emailError);
      console.error('❌ Error details:', emailError.message);
      
      return res.status(500).json({ 
        message: "Error sending email: " + emailError.message 
      });
    }

  } catch (error) {
    console.error("❌ Forgot password overall error:", error);
    res.status(500).json({ message: "Internal server error: " + error.message });
  }
};

// ================== Reset Password ==================
export const resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;

    console.log('🔄 Reset password request for:', email);

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      console.log('❌ User not found during reset');
      return res.status(404).json({ message: "User not found" });
    }

    console.log('✅ User found, checking OTP...');
    console.log('📝 Submitted OTP:', otp);
    console.log('📝 Stored OTP:', user.resetPasswordOTP);

    // Check if OTP matches and is not expired
    if (user.resetPasswordOTP !== otp) {
      console.log('❌ OTP mismatch');
      return res.status(400).json({ message: "Invalid OTP" });
    }

    if (user.resetPasswordOTPExpiry < new Date()) {
      console.log('❌ OTP expired');
      return res.status(400).json({ message: "OTP has expired" });
    }

    console.log('✅ OTP validated successfully');

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update password and clear OTP fields
    user.password = hashedPassword;
    user.resetPasswordOTP = undefined;
    user.resetPasswordOTPExpiry = undefined;
    await user.save();

    console.log('✅ Password reset successfully for user:', email);

    res.json({ message: "Password reset successfully" });

  } catch (error) {
    console.error("❌ Reset password error:", error);
    res.status(500).json({ message: "Error resetting password: " + error.message });
  }
};

// ================== Update Profile ==================
export const updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const { name, email, password } = req.body;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.name = name || user.name;
    user.email = email || user.email;

    if (password) {
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