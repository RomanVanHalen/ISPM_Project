// back-end/src/models/Policy.js
import mongoose from "mongoose";

const policySchema = new mongoose.Schema({
  title: { type: String, required: true },
  why: { type: String },
  keyElements: [String],
  details: { type: String },
  pdf: { type: String },
});

const Policy = mongoose.model("Policy", policySchema);

export default Policy;
