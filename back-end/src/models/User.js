import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
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
  // ADD THESE FOR PASSWORD RESET
  resetPasswordOTP: {
    type: String,
  },
  resetPasswordOTPExpiry: {
    type: Date,
  },
}, { timestamps: true });

export default mongoose.model("User", userSchema);