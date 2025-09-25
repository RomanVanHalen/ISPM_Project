// back-end/src/models/Notification.js
import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: false }, // optional: null = broadcast
    title: { type: String, required: true },
    body:  { type: String, required: true },
    type: {type: String, default: "info"},
  },
  { timestamps: true }
);

notificationSchema.index({ userId: 1, type: 1, createdAt: -1 });

const Notification = mongoose.model("Notification", notificationSchema);
export default Notification; 
