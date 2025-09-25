import mongoose from "mongoose";

const scoreSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",   // link to User model
      required: true,
    },
    module: {
      type: String, // e.g. "DragDropData"
      required: true,
    },
    score: {
      type: Number,
      required: true,
    },
    total: {
      type: Number,
      default: 0, // ✅ keep track of total possible score
    },
  },
  { timestamps: true }
);

export default mongoose.model("Score", scoreSchema);

