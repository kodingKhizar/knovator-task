// index.js
const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./services/db");
const jobRoutes = require("./routes/jobs.routes");
const cors = require("cors");
// ✅ Import the BullMQ worker
require("./services/jobWorker");
dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

console.log("✅ Setting up /api/jobs routes...");
try {
  app.use("/api/jobs", jobRoutes);
} catch (err) {
  console.error("❌ Failed to load job routes:", err);
}
  

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: "Resource not found" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
