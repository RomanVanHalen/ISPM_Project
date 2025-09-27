// models/Progress.js
import mongoose from "mongoose";

const progressSchema = new mongoose.Schema(
  {
    userId: {   // 👈 match what you're using in routes
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    policiesAcknowledged: { type: Number, default: 0 },
    totalPolicies: { type: Number, default: 0 },
    trainingsCompleted: { type: Number, default: 0 },
    totalTrainings: { type: Number, default: 4 },
    quizAvgScore: { type: Number, default: 0 },
    compliance: { type: Number, default: 0 },
    trainings: {
      phishingSimulator: { type: Boolean, default: false },
      domain1: { type: Boolean, default: false },
      domain2: { type: Boolean, default: false },
      domain3: { type: Boolean, default: false },
    },
    details: {
      type: [
        {
          type: { type: String },
          title: { type: String },
          status: { type: String },
          lastUpdated: { type: Date, default: Date.now },
        },
      ],
      default: [],
    },
  },
  { timestamps: true }
);

const Progress = mongoose.model("Progress", progressSchema);

export default Progress;




