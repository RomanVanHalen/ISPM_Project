// models/PolicyView.js
import mongoose from "mongoose";

const policyViewSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    policyId: {
      type: String,
      required: true,
    },
    count: {
      type: Number,
      default: 1,
    },
    lastViewedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

policyViewSchema.index({ user: 1, policyId: 1 }, { unique: true });

const PolicyView = mongoose.model("PolicyView", policyViewSchema);
export default PolicyView;
