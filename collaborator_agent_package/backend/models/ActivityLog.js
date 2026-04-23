const mongoose = require("mongoose");

const ActivityLogSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  eventType: {
    type: String,
    required: true,
    enum: [
      "applied",
      "onboarded",
      "activated",
      "profile_completed",
      "brand_viewed",
      "outreach_sent",
      "outreach_reached",
      "brand_responded",
      "collab_in_progress",
      "collab_completed",
      "retention_loop",
      "dormant",
      "message_sent",
      "message_received",
      "message_drafted",
      "collab_started"
    ],
  },
  metadata: {
    type: Object,
    default: {},
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("ActivityLog", ActivityLogSchema);
