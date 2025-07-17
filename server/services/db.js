const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config();
console.log("✅ MONGO_URI =", JSON.stringify(process.env.MONGO_URI));

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected");
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

module.exports = connectDB;
