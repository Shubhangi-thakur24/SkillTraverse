const CodingChallenge = require("../models/codingChallenge.model");
const InterviewReport = require("../models/InterviewReport.model");
const { generateCodingChallenges, evaluateCode } = require("../services/ai.service");

/**
 * @description Controller to get coding challenges for an interview report. Generates them if they don't exist.
 */
async function getChallengesController(req, res) {
    try {
        const { interviewId } = req.params;
        const language = req.query.language || "JavaScript";

        const report = await InterviewReport.findOne({ _id: interviewId, user: req.user.id });
        if (!report) {
            return res.status(404).json({ message: "Interview report not found." });
        }

        let codingChallenge = await CodingChallenge.findOne({ 
            interviewReport: interviewId, 
            user: req.user.id,
            language: language
        });

        if (!codingChallenge) {
            // Generate exactly 3 coding challenges tailored to the JD
            const generatedChallenges = await generateCodingChallenges({
                jobDescription: report.jobDescription,
                language: language
            });

            const challengesList = generatedChallenges.map(c => ({
                title: c.title,
                description: c.description,
                difficulty: c.difficulty,
                starterCode: c.starterCode,
                constraints: c.constraints || "",
                examples: c.examples || [],
                userCode: "",
                evaluation: null
            }));

            codingChallenge = await CodingChallenge.create({
                user: req.user.id,
                interviewReport: interviewId,
                language: language,
                challenges: challengesList
            });
        }

        res.status(200).json({ codingChallenge });
    } catch (error) {
        console.error("Error getting coding challenges:", error);
        res.status(500).json({ message: "Error getting coding challenges", error: error.message });
    }
}

/**
 * @description Controller to evaluate a user's submitted solution code for a specific challenge.
 */
async function submitCodeController(req, res) {
    try {
        const { interviewId } = req.params;
        const { challengeId, code } = req.body;

        const codingChallenge = await CodingChallenge.findOne({ interviewReport: interviewId, user: req.user.id });
        if (!codingChallenge) {
            return res.status(404).json({ message: "Coding challenge document not found." });
        }

        const challenge = codingChallenge.challenges.id(challengeId);
        if (!challenge) {
            return res.status(404).json({ message: "Challenge not found in session." });
        }

        // Call Gemini AI code evaluation
        const evaluation = await evaluateCode({
            title: challenge.title,
            description: challenge.description,
            starterCode: challenge.starterCode,
            code: code,
            language: codingChallenge.language || "JavaScript"
        });

        // Save progress & evaluation findings
        challenge.userCode = code;
        challenge.evaluation = evaluation;

        await codingChallenge.save();

        res.status(200).json({
            message: "Code evaluated successfully.",
            challenge
        });
    } catch (error) {
        console.error("Error evaluating code submission:", error);
        res.status(500).json({ message: "Error evaluating code submission", error: error.message });
    }
}

module.exports = {
    getChallengesController,
    submitCodeController
};
