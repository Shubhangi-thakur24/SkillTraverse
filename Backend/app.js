const express = require("express")
const cookieParser = require("cookie-parser")
const app = express()
const cors = require("cors")
app.use(express.json())

app.use(cookieParser())

const allowedOrigins = [
    "http://localhost:5173",
    "http://localhost:5174",
    process.env.FRONTEND_URL
].filter(Boolean);

app.use(cors(
    {
        origin: allowedOrigins,
        credentials: true,
    }
))
/*require all the routes here*/
const authRouter = require("./src/routes/auth.routes")
const interviewRouter = require("./src/routes/interview.routes")
/*using all the routes here*/
app.use("/api/auth", authRouter)
app.use("/api/interview", interviewRouter)

module.exports = app