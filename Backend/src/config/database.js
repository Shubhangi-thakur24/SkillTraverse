const mongoose = require("mongoose");
const crypto = require("crypto");

global.crypto = crypto;

async function connectDB() {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error("MONGO_URI is missing in .env");
    }

    await mongoose.connect(process.env.MONGO_URI);

    console.log("Connected to Database");
  } catch (err) {
    console.error("Database Connection Error:");
    console.error(err);
  }
}

module.exports = connectDB;