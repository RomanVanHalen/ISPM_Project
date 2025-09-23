// models/Progress.js
import mongoose from "mongoose";

const ProgressSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  policiesAcknowledged: { type: Number, default: 0 },
  totalPolicies: { type: Number, default: 0 },
  trainingsCompleted: { type: Number, default: 0 },
  totalTrainings: { type: Number, default: 0 },
  quizAvgScore: { type: Number, default: 0 },
  compliance: { type: Number, default: 0 },
  details: [
    {
      type: { type: String },
      title: { type: String },
      status: { type: String },
      lastUpdated: { type: String },
    },
  ],
});

export default mongoose.model("Progress", ProgressSchema);
