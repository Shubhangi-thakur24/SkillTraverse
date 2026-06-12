const MockSession = require("../models/mockSession.model");
const InterviewReport = require("../models/interviewReport.model");
const { generateMockQuestions, evaluateAnswer } = require("../services/ai.service");

/**
 * @description Controller to start a new mock interview session or reset an existing one.
 */
async function startMockSessionController(req, res) {
    try {
        const { interviewId } = req.params;

        const report = await InterviewReport.findOne({ _id: interviewId, user: req.user.id });
        if (!report) {
            return res.status(404).json({ message: "Interview report not found." });
        }

        // Delete any existing mock session for this report so we start fresh
        await MockSession.deleteMany({ interviewReport: interviewId, user: req.user.id });

        // Generate exactly 5 tailored questions from Gemini
        const generatedQuestions = await generateMockQuestions({
            resume: report.resume,
            selfDescription: report.selfDescription,
            jobDescription: report.jobDescription
        });

        const questionsList = generatedQuestions.map(q => ({
            question: q.question,
            category: q.category,
            userAnswer: "",
            feedback: null
        }));

        const mockSession = await MockSession.create({
            user: req.user.id,
            interviewReport: interviewId,
            questions: questionsList,
            currentQuestionIndex: 0,
            status: "in-progress"
        });

        res.status(201).json({
            message: "Mock interview session started successfully.",
            mockSession
        });
    } catch (error) {
        console.error("Error starting mock session:", error);
        res.status(500).json({ message: "Error starting mock session", error: error.message });
    }
}

/**
 * @description Controller to get the current mock session for an interview report.
 */
async function getMockSessionController(req, res) {
    try {
        const { interviewId } = req.params;

        const mockSession = await MockSession.findOne({ interviewReport: interviewId, user: req.user.id });
        if (!mockSession) {
            return res.status(404).json({ message: "No active mock interview session found." });
        }

        res.status(200).json({ mockSession });
    } catch (error) {
        console.error("Error getting mock session:", error);
        res.status(500).json({ message: "Error getting mock session", error: error.message });
    }
}

/**
 * @description Controller to submit candidate answer for the current question and evaluate it.
 */
async function submitMockAnswerController(req, res) {
    try {
        const { interviewId } = req.params;
        const { answer } = req.body;

        const mockSession = await MockSession.findOne({ interviewReport: interviewId, user: req.user.id });
        if (!mockSession) {
            return res.status(404).json({ message: "Mock session not found." });
        }

        if (mockSession.status === "completed") {
            return res.status(400).json({ message: "Interview session is already completed." });
        }

        const report = await InterviewReport.findById(interviewId);
        const currentIndex = mockSession.currentQuestionIndex;
        const currentQuestion = mockSession.questions[currentIndex];

        if (!currentQuestion) {
            return res.status(400).json({ message: "No question found for the current index." });
        }

        // Call Gemini AI evaluation
        const feedback = await evaluateAnswer({
            question: currentQuestion.question,
            answer: answer,
            resume: report.resume,
            jobDescription: report.jobDescription
        });

        // Update current question object
        mockSession.questions[currentIndex].userAnswer = answer;
        mockSession.questions[currentIndex].feedback = feedback;

        // Advance index or complete session
        if (currentIndex >= mockSession.questions.length - 1) {
            mockSession.status = "completed";
        } else {
            mockSession.currentQuestionIndex = currentIndex + 1;
        }

        await mockSession.save();

        res.status(200).json({
            message: "Answer submitted and evaluated.",
            feedback,
            mockSession
        });
    } catch (error) {
        console.error("Error submitting mock answer:", error);
        res.status(500).json({ message: "Error submitting mock answer", error: error.message });
    }
}

module.exports = {
    startMockSessionController,
    getMockSessionController,
    submitMockAnswerController
};
