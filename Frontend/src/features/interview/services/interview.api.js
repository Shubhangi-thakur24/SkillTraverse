import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:3000",
    withCredentials: true,
})


/**
 * @description Service to generate interview report based on user self description, resume and job description.
 */
export const generateInterviewReport = async ({ jobDescription, selfDescription, resumeFile }) => {

    const formData = new FormData()
    formData.append("jobDescription", jobDescription)
    formData.append("selfDescription", selfDescription)
    formData.append("resume", resumeFile)

    const response = await api.post("/api/interview/", formData, {
        headers: {
            "Content-Type": "multipart/form-data"
        }
    })

    return response.data

}


/**
 * @description Service to get interview report by interviewId.
 */
export const getInterviewReportById = async (interviewId) => {
    const response = await api.get(`/api/interview/report/${interviewId}`)

    return response.data
}


/**
 * @description Service to get all interview reports of logged in user.
 */
export const getAllInterviewReports = async () => {
    const response = await api.get("/api/interview/")

    return response.data
}


/**
 * @description Service to generate resume pdf based on user self description, resume content and job description.
 */
export const generateResumePdf = async ({ interviewReportId }) => {
    const response = await api.post(`/api/interview/resume/pdf/${interviewReportId}`, null, {
        responseType: "blob"
    })

    return response.data
}

/**
 * @description Service to start a new mock interview session.
 */
export const startMockSession = async (interviewId) => {
    const response = await api.post(`/api/interview/report/${interviewId}/mock/start`);
    return response.data;
};

/**
 * @description Service to get active mock session.
 */
export const getMockSession = async (interviewId) => {
    const response = await api.get(`/api/interview/report/${interviewId}/mock/session`);
    return response.data;
};

/**
 * @description Service to submit a mock interview question answer.
 */
export const submitMockAnswer = async (interviewId, answer) => {
    const response = await api.post(`/api/interview/report/${interviewId}/mock/submit`, { answer });
    return response.data;
};

/**
 * @description Service to get coding challenges.
 */
export const getCodingChallenges = async (interviewId, language = "JavaScript") => {
    const response = await api.get(`/api/interview/report/${interviewId}/sandbox/challenges`, {
        params: { language }
    });
    return response.data;
};

/**
 * @description Service to submit and evaluate coding challenge code.
 */
export const submitCodingSolution = async (interviewId, challengeId, code) => {
    const response = await api.post(`/api/interview/report/${interviewId}/sandbox/submit`, { challengeId, code });
    return response.data;
};