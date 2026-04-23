const mongoose = require("mongoose");

const CollabMemorySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    unique: true
  },
  metrics: {
    compatibilityScore: { type: Number, default: 50 },
    experienceIndex: { type: Number, default: 50 },
    trustIndex: { type: Number, default: 50 },
    safetyComplianceScore: { type: Number, default: 50 },
    reliabilityScore: { type: Number, default: 50 },
    communicationClarity: { type: Number, default: 50 }
  },
  collabHistory: [
    {
      collabId: String,
      partnerName: String,
      overallScore: Number,
      outcome: String,
      rootCause: String,
      predictedSuccessProbability: Number,
      positives: [String],
      negatives: [String],
      date: { type: Date, default: Date.now }
    }
  ],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("CollabMemory", CollabMemorySchema);
