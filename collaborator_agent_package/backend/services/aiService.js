/**
 * Mock AI Service to satisfy dependencies in basic mode.
 * Real AI integration (Gemini/OpenAI) can be added here later.
 */

exports.analyzeCollaborationBehavior = async (data) => {
    return {
        overallScore: 85,
        rootCause: "N/A - Basic Mode",
        predictedSuccessProbability: 0.9,
        positives: ["Stable communication", "Clear expectations"],
        negatives: [],
        metrics: {
            communicationClarity: 80,
            reliability: 85,
            trustIndex: 90
        }
    };
};

exports.analyzeDeliverable = async (data) => {
    return {
        category: "General",
        summary: "Deliverable uploaded in basic mode.",
        keyTakeaways: ["Successfully logged"],
        scoreImpact: {
            compatibility: 2,
            experience: 1,
            trust: 1,
            safety: 0,
            reliability: 1
        }
    };
};

exports.aiService = {
    analyzeCollaborationBehavior: exports.analyzeCollaborationBehavior,
    analyzeDeliverable: exports.analyzeDeliverable
};
