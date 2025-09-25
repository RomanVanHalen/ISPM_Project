import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  password: {
    type: String,
    // Password is not required for Google OAuth users
    required: function() {
      return !this.googleId; // Only required if not using Google OAuth
    }
  },
  googleId: {
    type: String,
    unique: true,
    sparse: true, // Allows multiple null values
  },
  role: {
    type: String,
    enum: ["employee", "admin"],
    default: "employee",
  },
  profilePic: {
    type: String,
    default: "https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y",
  },
  bio: {
    type: String,
    default: "",
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  // Password reset fields
  resetPasswordOTP: {
    type: String,
  },
  resetPasswordOTPExpiry: {
    type: Date,
  },
}, { 
  timestamps: true 
});

// Index for better query performance
userSchema.index({ email: 1 });
userSchema.index({ googleId: 1 });

// Virtual to check if user is Google OAuth user
userSchema.virtual('isGoogleUser').get(function() {
  return !!this.googleId;
});

// Method to check if user can reset password
userSchema.methods.canResetPassword = function() {
  return !this.googleId; // Only non-Google users can reset password
};

export default mongoose.model("User", userSchema);