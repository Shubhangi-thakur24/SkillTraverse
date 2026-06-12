const mongoose = require("mongoose");

const exampleSchema = new mongoose.Schema({
    input: { type: String, required: true },
    output: { type: String, required: true },
    explanation: { type: String, default: "" }
}, { _id: false });

const evaluationSchema = new mongoose.Schema({
    score: { type: Number, required: true },
    analysis: { type: String, required: true },
    timeComplexity: { type: String, required: true },
    spaceComplexity: { type: String, required: true },
    suggestions: { type: String, required: true },
    modelSolution: { type: String, required: true }
}, { _id: false });

const challengeSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    difficulty: { type: String, enum: ["Easy", "Medium", "Hard"], required: true },
    starterCode: { type: String, required: true },
    constraints: { type: String, default: "" },
    examples: [exampleSchema],
    userCode: { type: String, default: "" },
    evaluation: { type: evaluationSchema, default: null }
});

const CodingChallengeSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    interviewReport: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "InterviewReport",
        required: true
    },
    challenges: [challengeSchema]
}, {
    timestamps: true
});

const codingChallengeModel = mongoose.model("CodingChallenge", CodingChallengeSchema);

module.exports = codingChallengeModel;
