const mongoose = require("mongoose")

/** 
 * -job description : String 
 * -resume text : String
 * - Self description : String
 * 
 * -match score: Number
 * 
 * - technical questions:
 *         [{
 *          question: " ",
            intention: " "
*          answer: " ",
 * 
 *          }]
 * - Behavioral questions: [
 * {
 *          question: " ",
            intention: " "
*           answer: " ",
 * }]
 * - Skill gaps : [{
 *                  Skill : " "
 *                  Severity : " "
 *                  type : String
 *                  enum : ["low", "medium", "high"]
 *                  }]
 * - Preparation Plan : [{
 *  day : Number,
* focus : String
* tasks : string 
 * }]
 */

const technicalQuestionSchema = new mongoose.Schema({
    question: {
        type: String,
        required: [true, "Question is required"],
    },
    intention: {
        type: String,
        required: [true, "Intention is required"],
    },
    answer: {
        type: String,
        required: [true, "Answer is required"],
    },
    tags: [{
        type: String,
    }],
}, {
    _id: false,
})

const behavioralQuestionSchema = new mongoose.Schema({
    question: {
        type: String,
        required: [true, "Question is required"],
    },
    intention: {
        type: String,
        required: [true, "Intention is required"],
    },
    answer: {
        type: String,
        required: [true, "Answer is required"],
    },
    tags: [{
        type: String,
    }],
}, {
    _id: false,
})

const skillGapSchema = new mongoose.Schema({
    skill: {
        type: String,
        required: [true, "Skill is required"],
    },
    severity: {
        type: String,
        enum: ["low", "medium", "high"],
        required: [true, "Severity is required"],
    },

}, {
    _id: false,
})

const preparationPlanSchema = new mongoose.Schema({
    day: {
        type: Number,
        required: [true, "Day is required"],
    },
    focus: {
        type: String,
        required: [true, "Focus is required"],
    },
    tasks: [{
        type: String,
        required: [true, "Tasks is required"],
    }],
}, {
    _id: false,
})

const InterviewReportSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    jobDescription: {
        type: String,
        required: [true, "Job description is required"],
    },
    resume: {
        type: String,

    },
    selfDescription: {
        type: String,

    },
    matchScore: {
        type: Number,
        min: 0,
        max: 100
    },
    title: {
        type: String,
    },
    technicalQuestions: [technicalQuestionSchema],
    behavioralQuestions: [behavioralQuestionSchema],
    skillGaps: [skillGapSchema],
    preparationPlan: [preparationPlanSchema],
}, {
    timestamps: true,
})


const interviewReportModel = mongoose.model("InterviewReport", InterviewReportSchema);

module.exports = interviewReportModel;