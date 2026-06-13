const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");

const app = express();

app.use(express.json());
app.use(cookieParser());

const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
  "https://skilltraverse-frontend.onrender.com",
  process.env.FRONTEND_URL
].filter(Boolean);

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);

// Health Route
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "SkillTraverse Backend Running 🚀",
  });
});

const authRouter = require("./src/routes/auth.routes");
const interviewRouter = require("./src/routes/interview.routes");

app.use("/api/auth", authRouter);
app.use("/api/interview", interviewRouter);

module.exports = app;