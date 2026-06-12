const express = require("express")
const authMiddleware = require("../middlewares/auth.middleware")
const interviewController = require("../controllers/interview.controller")
const mockController = require("../controllers/mock.controller")
const sandboxController = require("../controllers/sandbox.controller")
const upload = require("../middlewares/file.middleware")

const interviewRouter = express.Router()

/**
 * @route POST /api/interview/
 * @description generate new interview report on the basis of user self description,resume pdf and job description.
 * @access private
 */
interviewRouter.post("/", authMiddleware.authUser, upload.single("resume"), interviewController.generateInterViewReportController)

/**
 * @route GET /api/interview/report/:interviewId
 * @description get interview report by interviewId.
 * @access private
 */
interviewRouter.get("/report/:interviewId", authMiddleware.authUser, interviewController.getInterviewReportByIdController)

/**
 * @route GET /api/interview/
 * @description get all interview reports of logged in user.
 * @access private
 */
interviewRouter.get("/", authMiddleware.authUser, interviewController.getAllInterviewReportsController)

/**
 * @route GET /api/interview/resume/pdf
 * @description generate resume pdf on the basis of user self description, resume content and job description.
 * @access private
 */
interviewRouter.post("/resume/pdf/:interviewReportId", authMiddleware.authUser, interviewController.generateResumePdfController)

/**
 * @route POST /api/interview/report/:interviewId/mock/start
 * @description start a new mock interview session
 * @access private
 */
interviewRouter.post("/report/:interviewId/mock/start", authMiddleware.authUser, mockController.startMockSessionController)

/**
 * @route GET /api/interview/report/:interviewId/mock/session
 * @description get active mock interview session
 * @access private
 */
interviewRouter.get("/report/:interviewId/mock/session", authMiddleware.authUser, mockController.getMockSessionController)

/**
 * @route POST /api/interview/report/:interviewId/mock/submit
 * @description submit answer for mock question and get evaluation
 * @access private
 */
interviewRouter.post("/report/:interviewId/mock/submit", authMiddleware.authUser, mockController.submitMockAnswerController)

/**
 * @route GET /api/interview/report/:interviewId/sandbox/challenges
 * @description get coding challenges for interview report
 * @access private
 */
interviewRouter.get("/report/:interviewId/sandbox/challenges", authMiddleware.authUser, sandboxController.getChallengesController)

/**
 * @route POST /api/interview/report/:interviewId/sandbox/submit
 * @description submit solution for coding challenge and get evaluation
 * @access private
 */
interviewRouter.post("/report/:interviewId/sandbox/submit", authMiddleware.authUser, sandboxController.submitCodeController)

module.exports = interviewRouter