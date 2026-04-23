const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");

// @route   GET /api/Collab/memory
// @desc    Get current user's collaboration memory (Basic Mock)
// @access  Private
router.get("/memory", protect, async (req, res) => {
    try {
        // Return basic mock data for the 'Basic' version
        const mockMemory = {
            userId: req.user._id,
            metrics: {
                compatibilityScore: 75,
                experienceIndex: 60,
                trustIndex: 85,
                safetyComplianceScore: 90,
                reliabilityScore: 80,
                communicationClarity: 70
            },
            trustSnapshot: {
                compositeScore: 82,
                status: 'Stable',
                statusMessage: "Your trust standing is solid based on basic profile verification."
            },
            trustPillars: {
                identity: { emailVerified: true, socialVerified: false, authenticityRate: 90, identityScore: 85 },
                behavioralIntegrity: { spamSignal: 'Low', fakeFollowerEstimate: 0, interactionHealth: 95, integrityScore: 92 },
                transactionalTrust: { paymentSafetyScore: 100, agreementTransparency: 100, disputeRate: 0, transactionalScore: 98 },
                communitySignal: { reputationHeatmap: [], socialProofScore: 75 }
            },
            collabHistory: [],
            aiLearnings: ["Complete your full profile to boost matching accuracy.", "Respond to messages within 24 hours for better reliability scores."]
        };
        res.json(mockMemory);
    } catch (err) {
        console.error(err);
        res.status(500).send("Server Error");
    }
});

// @route   GET /api/Collab/memory/:userId
// @desc    Get public view of a user's memory (Basic Mock)
// @access  Private
router.get("/memory/:userId", protect, async (req, res) => {
    try {
        const mockMemory = {
            userId: req.params.userId,
            metrics: {
                compatibilityScore: 65,
                trustIndex: 80
            },
            trustSnapshot: {
                compositeScore: 78,
                status: 'Verified',
                statusMessage: "This user has a consistent track record in the Collaborator network."
            },
            trustPillars: {
                identity: { emailVerified: true, socialVerified: true, authenticityRate: 95, identityScore: 90 },
                behavioralIntegrity: { spamSignal: 'Low', interactionHealth: 90, integrityScore: 88 },
                transactionalTrust: { paymentSafetyScore: 95, transactionalScore: 92 },
                communitySignal: { socialProofScore: 80 }
            }
        };
        res.json(mockMemory);
    } catch (err) {
        res.status(500).send("Server Error");
    }
});

module.exports = router;
