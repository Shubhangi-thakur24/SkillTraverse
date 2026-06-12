const { GoogleGenAI } = require("@google/genai")

const ai = new GoogleGenAI({
    apiKey: process.env.GOOGLE_GENAI_API_KEY
})

const interviewReportJsonSchema = {
    type: "OBJECT",
    properties: {
        matchScore: { 
            type: "NUMBER", 
            description: "A score between 0 and 100 indicating how well the candidate's profile matches the job description" 
        },
        title: { 
            type: "STRING", 
            description: "The title of the job for which the interview report is generated" 
        },
        technicalQuestions: {
            type: "ARRAY",
            description: "Technical questions that can be asked in the interview along with their intention and how to answer them",
            items: {
                type: "OBJECT",
                properties: {
                    question: { type: "STRING", description: "The technical question can be asked in the interview" },
                    intention: { type: "STRING", description: "The intention of interviewer behind asking this question" },
                    answer: { type: "STRING", description: "How to answer this question, what points to cover, what approach to take etc." }
                },
                required: ["question", "intention", "answer"]
            }
        },
        behavioralQuestions: {
            type: "ARRAY",
            description: "Behavioral questions that can be asked in the interview along with their intention and how to answer them",
            items: {
                type: "OBJECT",
                properties: {
                    question: { type: "STRING", description: "The behavioral question can be asked in the interview" },
                    intention: { type: "STRING", description: "The intention of interviewer behind asking this question" },
                    answer: { type: "STRING", description: "How to answer this question, what points to cover, what approach to take etc." }
                },
                required: ["question", "intention", "answer"]
            }
        },
        skillGaps: {
            type: "ARRAY",
            description: "List of skill gaps in the candidate's profile along with their severity",
            items: {
                type: "OBJECT",
                properties: {
                    skill: { type: "STRING", description: "The skill which the candidate is lacking" },
                    severity: { type: "STRING", enum: ["low", "medium", "high"], description: "The severity of this skill gap" }
                },
                required: ["skill", "severity"]
            }
        },
        preparationPlan: {
            type: "ARRAY",
            description: "A day-wise preparation plan for the candidate to follow in order to prepare for the interview effectively",
            items: {
                type: "OBJECT",
                properties: {
                    day: { type: "INTEGER", description: "The day number in the preparation plan, starting from 1" },
                    focus: { type: "STRING", description: "The main focus of this day in the preparation plan" },
                    tasks: {
                        type: "ARRAY",
                        items: { type: "STRING" },
                        description: "List of tasks to be done on this day to follow the preparation plan"
                    }
                },
                required: ["day", "focus", "tasks"]
            }
        }
    },
    required: ["matchScore", "title", "technicalQuestions", "behavioralQuestions", "skillGaps", "preparationPlan"]
};

const resumePdfJsonSchema = {
    type: "OBJECT",
    properties: {
        html: {
            type: "STRING",
            description: "The HTML content of the resume which can be converted to PDF using puppeteer"
        }
    },
    required: ["html"]
};

async function generateContentWithFallback({ contents, config, primaryModel = "gemini-3-flash-preview" }) {
    const models = [
        primaryModel,
        "gemini-3-flash-preview",
        "gemini-2.5-flash",
        "gemini-3.5-flash"
    ];
    
    const uniqueModels = Array.from(new Set(models));
    let lastError = null;

    for (const model of uniqueModels) {
        try {
            console.log(`Attempting generation with model: ${model}...`);
            const response = await ai.models.generateContent({
                model: model,
                contents: contents,
                config: config
            });
            return response;
        } catch (error) {
            console.warn(`Model ${model} failed:`, error.message);
            lastError = error;
        }
    }
    throw lastError;
}

async function generateInterviewReport({ resume, selfDescription, jobDescription }) {


    const prompt = `Generate an interview report for a candidate with the following details:
                        Resume: ${resume}
                        Self Description: ${selfDescription}
                        Job Description: ${jobDescription}
`

    const response = await generateContentWithFallback({
        primaryModel: "gemini-3-flash-preview",
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: interviewReportJsonSchema,
        }
    })

    return JSON.parse(response.text)


}



async function generatePdfFromHtml(htmlContent) {
    const puppeteer = (await import("puppeteer")).default
    const browser = await puppeteer.launch()
    const page = await browser.newPage();
    await page.setContent(htmlContent, { waitUntil: "networkidle0" })

    const pdfBuffer = await page.pdf({
        format: "A4", margin: {
            top: "20mm",
            bottom: "20mm",
            left: "15mm",
            right: "15mm"
        }
    })

    await browser.close()

    return pdfBuffer
}

async function generateResumePdf({ resume, selfDescription, jobDescription }) {

    const prompt = `Generate resume for a candidate with the following details:
                        Resume: ${resume}
                        Self Description: ${selfDescription}
                        Job Description: ${jobDescription}

                        the response should be a JSON object with a single field "html" which contains the HTML content of the resume which can be converted to PDF using any library like puppeteer.
                        The resume should be tailored for the given job description and should highlight the candidate's strengths and relevant experience. The HTML content should be well-formatted and structured, making it easy to read and visually appealing.
                        The content of resume should be not sound like it's generated by AI and should be as close as possible to a real human-written resume.
                        you can highlight the content using some colors or different font styles but the overall design should be simple and professional.
                        The content should be ATS friendly, i.e. it should be easily parsable by ATS systems without losing important information.
                        The resume should not be so lengthy, it should ideally be 1-2 pages long when converted to PDF. Focus on quality rather than quantity and make sure to include all the relevant information that can increase the candidate's chances of getting an interview call for the given job description.
                    `

    const response = await generateContentWithFallback({
        primaryModel: "gemini-3-flash-preview",
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: resumePdfJsonSchema,
        }
    })


    const jsonContent = JSON.parse(response.text)

    const pdfBuffer = await generatePdfFromHtml(jsonContent.html)

    return pdfBuffer

}

async function invokeGeminiAi(prompt = "Hello Gemini! Explain what is an Interview.") {
    try {
        console.log("Gemini AI service connection...");
        const response = await generateContentWithFallback({
            primaryModel: "gemini-3-flash-preview",
            contents: prompt
        });
        const text = response.text;
        console.log("Gemini AI service initialized successfully. Test response:\n" + text.trim());
        return { success: true, message: text };
    } catch (error) {
        console.error("Gemini AI Error:", error.message);
        return { success: false, error: error.message };
    }
}

module.exports = { generateInterviewReport, generateResumePdf, invokeGeminiAi }