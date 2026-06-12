const crypto = require("crypto");
global.crypto = crypto;

const path = require("path");

require("dotenv").config({
  path: path.join(__dirname, ".env"),
});

const app = require("./app");
const connectDB = require("./src/config/database");
const { invokeGeminiAi } = require("./src/services/ai.service");
const {DOMMatrix} = require("@napi-rs/canvas")
global.DOMMatrix = DOMMatrix;

const pdfParse = require("pdf-parse");
(async () => {
  try {
    await connectDB();
    await invokeGeminiAi();

    const PORT = process.env.PORT || 3000;

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error(error);
  }
})();