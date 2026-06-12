# SkillTraverse 🚀
An intelligent, Generative AI-powered career preparation engine that parses user profiles/resumes and target job descriptions to automatically architect tailored technical assessments, contextual behavioral questions, a comprehensive skill gap analysis, and an actionable learning roadmap.

---

## 🌟 Features

### 1. **AI-Powered Interview Reports**
- Parse uploaded resume PDFs (using `pdf-parse`) and compare them against your target job description.
- Calculate an **ATS Match Score** (0–100%) indicating alignment with the role.
- Generate customized **Technical Questions** with the interviewer's intent and guidelines on how to structure the best response.
- Generate contextual **Behavioral Questions** tailored to your background and the target role.

### 2. **Structured Preparation Plan & Skill Gap Analysis**
- Identify precise **Skill Gaps** categorized by severity (`low`, `medium`, `high`).
- Establish a **day-wise interactive learning roadmap** focusing on bridging those gaps step-by-step.

### 3. **Tailored Resume Generator**
- AI generates a clean, highly customized, and ATS-friendly resume designed specifically to highlight relevant strengths for the target job description.
- Compiles the generated HTML into a downloadable, publication-quality **A4 PDF** dynamically using Puppeteer.

---

## 🛠️ Technology Stack

### **Frontend**
- **Framework**: Vite + React
- **Styling**: Sass / SCSS (Modular & Responsive)
- **API Client**: Axios

### **Backend**
- **Runtime**: Node.js + Express.js
- **Database**: MongoDB (via Mongoose)
- **Authentication**: JSON Web Token (JWT) & bcryptjs
- **File Uploads**: Multer
- **AI Orchestration**: `@google/genai` (utilizing Gemini Models with structured JSON schemas)
- **PDF Compilation**: Puppeteer & `pdf-parse`

---

## 📂 Project Structure

```
SkillTraverse/
├── Backend/
│   ├── src/
│   │   ├── config/          # DB config
│   │   ├── controllers/     # Controller logic
│   │   ├── middlewares/     # Authentication & Multer middleware
│   │   ├── models/          # Mongoose Schemas (User, Blacklist, InterviewReport)
│   │   ├── routes/          # Express API Endpoints
│   │   └── services/        # Gemini AI & Puppeteer integration
│   ├── app.js               # Express application setup
│   └── server.js            # Server entrypoint
│
├── Frontend/
│   ├── public/              # Static assets
│   ├── src/
│   │   ├── features/
│   │   │   ├── auth/        # Context, hooks, API & pages for auth
│   │   │   └── interview/   # Context, hooks, API & pages for interview reports
│   │   ├── styles/          # Global styles & SCSS configurations
│   │   ├── App.jsx          # React app entry
│   │   └── main.jsx         # DOM Mounting
│   └── vite.config.js       # Vite configuration
│
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+ recommended)
- MongoDB running locally or a MongoDB Atlas URI
- Gemini API Key (obtained from Google AI Studio)

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Shubhangi-thakur24/SkillTraverse.git
   cd SkillTraverse
   ```

2. **Setup Backend:**
   ```bash
   cd Backend
   npm install
   ```
   Create a `.env` file inside the `Backend` directory:
   ```env
   PORT=3000
   MONGO_URI=your_mongodb_uri
   JWT_SECRET=your_jwt_secret_key
   GOOGLE_GENAI_API_KEY=your_gemini_api_key
   ```
   Start the backend server:
   ```bash
   npm run dev
   ```

3. **Setup Frontend:**
   ```bash
   cd ../Frontend
   npm install
   ```
   Start the Vite development server:
   ```bash
   npm run dev
   ```

---

## 🔮 Future Scope & Planned Enhancements

To make **SkillTraverse** the ultimate end-to-end career preparation platform, the following features are planned for future releases:

### 🎤 1. Real-Time AI Mock Interview Simulator
- **Interactive Voice/Video Rooms**: Introduce real-time audio and video mock interviews using the **Gemini Multimodal Live API**.
- **Contextual Interviewer**: An AI interviewer that dynamically asks follow-up questions based on the candidate's real-time answers and body language/tone.
- **Instant Performance Feedback**: Generate detailed analytics highlighting answer accuracy, clarity of speech, filler word usage, and posture.

### 💻 2. Interactive Coding Sandbox & Code Evaluation
- **In-Browser IDE**: A code editor integrated into the frontend allowing users to solve generated technical questions on the spot.
- **AI Code Review**: Get line-by-line feedback, time/space complexity analysis (Big O), edge-case alerts, and refactoring suggestions.

### 🗺️ 3. Visual & Dynamic Roadmaps
- **Interactive Node Graphs**: Replace simple text-based plans with visual node diagrams (using `React Flow`) outlining the preparation journey.
- **Resource Integration**: Auto-populate roadmap nodes with relevant tutorials, documentations, and documentation links.

### ✍️ 4. WYSIWYG Resume Customizer
- **Visual Builder**: A drag-and-drop editor allowing users to review and edit the AI-generated resume sections before downloading.
- **Template Gallery**: Multiple premium, ATS-optimized layout designs to choose from.

### 🔔 5. Career Tracker & Reminders
- **Email & Slack Integration**: Daily morning summary notifications detailing tasks and topics planned for that specific day according to the user's customized plan.
- **LinkedIn Cliper (Chrome Extension)**: A browser extension that lets users clip job postings directly from LinkedIn, Indeed, or Glassdoor, sending them straight to SkillTraverse with a single click.

---

## 📄 License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
