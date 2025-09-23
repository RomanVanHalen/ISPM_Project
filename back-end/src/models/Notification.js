// back-end/src/models/Notification.js
import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: false }, // optional: null = broadcast
    title: { type: String, required: true },
    body:  { type: String, required: true },
    link:  { type: String },
    read:  { type: Boolean, default: false },
  },
  { timestamps: true }
);

const Notification = mongoose.model("Notification", notificationSchema);

// 👇 This line is critical
export default Notification;
