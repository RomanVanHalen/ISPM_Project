import mongoose from "mongoose";

const scoreSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",   // link to User model
      required: true,
      index: true,
    },
    module: {
      type: String, // "DragDropData"
      required: true,
      index: true,
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

