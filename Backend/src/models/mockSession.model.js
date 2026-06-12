const mongoose = require("mongoose");

const feedbackSchema = new mongoose.Schema({
    score: { type: Number, required: true },
    strengths: { type: String, required: true },
    improvements: { type: String, required: true },
    modelAnswer: { type: String, required: true }
}, { _id: false });

const mockQuestionSchema = new mongoose.Schema({
    question: { type: String, required: true },
    category: { type: String, enum: ["technical", "behavioral"], required: true },
    userAnswer: { type: String, default: "" },
    feedback: { type: feedbackSchema, default: null }
}, { _id: false });

const MockSessionSchema = new mongoose.Schema({
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
    questions: [mockQuestionSchema],
    currentQuestionIndex: {
        type: Number,
        default: 0
    },
    status: {
        type: String,
        enum: ["in-progress", "completed"],
        default: "in-progress"
    }
}, {
    timestamps: true
});

const mockSessionModel = mongoose.model("MockSession", MockSessionSchema);

module.exports = mockSessionModel;
