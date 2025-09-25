import mongoose from "mongoose";

const policyViewSchema = new mongoose.Schema(
  {
    policyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Policy",
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId, // ✅ store actual user reference
      ref: "User",
      required: true,
    },
    viewedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

const PolicyView = mongoose.model("PolicyView", policyViewSchema);

export default PolicyView;
