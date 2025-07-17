const mongoose = require("mongoose");

const JobSchema = new mongoose.Schema({
  guid: { type: String, unique: true },
  title:{type: String},
  link: {type: String},
  description: {type: String},
  pubDate: {type: Date},
});

module.exports = mongoose.model("Job", JobSchema);
