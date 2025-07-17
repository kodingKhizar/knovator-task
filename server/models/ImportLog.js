const mongoose = require("mongoose");

const ImportLogSchema = new mongoose.Schema({
  timestamp: { type: Date, default: Date.now },
  sourceUrl: String,
  totalFetched: Number,
  newJobs: Number,
  updatedJobs: Number,
  failedJobs: [{ error: String, guid: String }],
});

module.exports = mongoose.model("ImportLog", ImportLogSchema);
