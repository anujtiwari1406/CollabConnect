const express = require("express");
const { accessChat, fetchChats, recordCollaboration } = require("../controllers/chatController");
const { protect } = require("../middleware/authMiddleware");
// AI Controller is disabled for basic setup
// const {
//     suggestReplies,
//     generateOpener,
//     summarizeChat,
//     enhanceText,
//     analyzeUserProfile
// } = require("../controllers/aiController");

const router = express.Router();

router.route("/").post(protect, accessChat);
router.route("/").get(protect, fetchChats);
router.route("/collab/record").post(protect, recordCollaboration);

// AI Routes disabled for basic setup
// router.route("/ai/suggest").post(protect, suggestReplies);
// router.route("/ai/opener").post(protect, generateOpener);
// router.route("/ai/summarize").post(protect, summarizeChat);
// router.route("/ai/enhance").post(protect, enhanceText);
// router.route("/ai/analyze-profile").post(protect, analyzeUserProfile);


module.exports = router;



