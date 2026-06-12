import { 
    getAllInterviewReports, 
    generateInterviewReport, 
    getInterviewReportById, 
    generateResumePdf,
    startMockSession,
    getMockSession,
    submitMockAnswer,
    getCodingChallenges,
    submitCodingSolution
} from "../services/interview.api"
import { useContext, useEffect, useState } from "react"
import { InterviewContext } from "../interview.context"
import { useParams } from "react-router"


export const useInterview = () => {

    const context = useContext(InterviewContext)
    const { interviewId } = useParams()

    if (!context) {
        throw new Error("useInterview must be used within an InterviewProvider")
    }

    const { loading, setLoading, report, setReport, reports, setReports } = context

    const [mockSession, setMockSession] = useState(null)
    const [codingSession, setCodingSession] = useState(null)

    const generateReport = async ({ jobDescription, selfDescription, resumeFile }) => {
        setLoading(true)
        let response = null
        try {
            response = await generateInterviewReport({ jobDescription, selfDescription, resumeFile })
            setReport(response.interviewReport)
        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false)
        }

        return response.interviewReport
    }

    const getReportById = async (interviewId) => {
        setLoading(true)
        let response = null
        try {
            response = await getInterviewReportById(interviewId)
            setReport(response.interviewReport)
        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false)
        }
        return response.interviewReport
    }

    const getReports = async () => {
        setLoading(true)
        let response = null
        try {
            response = await getAllInterviewReports()
            setReports(response.interviewReports)
        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false)
        }

        return response.interviewReports
    }

    const getResumePdf = async (interviewReportId) => {
        setLoading(true)
        let response = null
        try {
            response = await generateResumePdf({ interviewReportId })
            const url = window.URL.createObjectURL(new Blob([ response ], { type: "application/pdf" }))
            const link = document.createElement("a")
            link.href = url
            link.setAttribute("download", `resume_${interviewReportId}.pdf`)
            document.body.appendChild(link)
            link.click()
        }
        catch (error) {
            console.log(error)
        } finally {
            setLoading(false)
        }
    }

    const startMock = async (id) => {
        setLoading(true)
        let response = null
        try {
            response = await startMockSession(id)
            setMockSession(response.mockSession)
        } catch (error) {
            console.log("Error starting mock:", error)
        } finally {
            setLoading(false)
        }
        return response ? response.mockSession : null
    }

    const fetchMock = async (id) => {
        setLoading(true)
        let response = null
        try {
            response = await getMockSession(id)
            setMockSession(response.mockSession)
        } catch (error) {
            console.log("Error fetching mock session:", error)
            setMockSession(null)
        } finally {
            setLoading(false)
        }
        return response ? response.mockSession : null
    }

    const submitAnswer = async (id, answer) => {
        setLoading(true)
        let response = null
        try {
            response = await submitMockAnswer(id, answer)
            setMockSession(response.mockSession)
        } catch (error) {
            console.log("Error submitting mock answer:", error)
        } finally {
            setLoading(false)
        }
        return response
    }

    const fetchChallenges = async (id) => {
        setLoading(true)
        let response = null
        try {
            response = await getCodingChallenges(id)
            setCodingSession(response.codingChallenge)
        } catch (error) {
            console.log("Error fetching coding challenges:", error)
        } finally {
            setLoading(false)
        }
        return response ? response.codingChallenge : null
    }

    const submitCode = async (id, challengeId, code) => {
        setLoading(true)
        let response = null
        try {
            response = await submitCodingSolution(id, challengeId, code)
            if (response && response.challenge) {
                setCodingSession(prev => {
                    if (!prev) return null
                    const updatedChallenges = prev.challenges.map(ch => 
                        ch._id === challengeId ? response.challenge : ch
                    )
                    return { ...prev, challenges: updatedChallenges }
                })
            }
        } catch (error) {
            console.log("Error submitting code:", error)
        } finally {
            setLoading(false)
        }
        return response
    }

    useEffect(() => {
        if (interviewId) {
            getReportById(interviewId)
        } else {
            getReports()
        }
    }, [ interviewId ])

    return { 
        loading, 
        report, 
        reports, 
        generateReport, 
        getReportById, 
        getReports, 
        getResumePdf,
        mockSession,
        codingSession,
        startMock,
        fetchMock,
        submitAnswer,
        fetchChallenges,
        submitCode
    }

}