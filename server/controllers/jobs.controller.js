// const { fetchJobsFromXML } = require("../services/jobServices");
const ImportLog = require("../models/ImportLog");
const Jobs = require("../models/Jobs");
const { addJobsToQueue } = require("../services/jobQueue");
// const ImportLog = require("../models/ImportLog");
const { fetchJobsFromXML } = require("../services/jobServices");
// const { fetchJobsFromXML } = require("..");
// const { fetchJobsFromXML } = require("..");

const sources = [
  "https://jobicy.com/?feed=job_feed",
  "https://jobicy.com/?feed=job_feed&job_categories=smm&job_types=full-time",
  "https://jobicy.com/?feed=job_feed&job_categories=seller&job_types=full-time&search_region=france",
  "https://jobicy.com/?feed=job_feed&job_categories=design-multimedia",
  "https://jobicy.com/?feed=job_feed&job_categories=data-science",
  "https://jobicy.com/?feed=job_feed&job_categories=copywriting",
  "https://jobicy.com/?feed=job_feed&job_categories=business",
  "https://jobicy.com/?feed=job_feed&job_categories=management",
  "https://www.higheredjobs.com/rss/articleFeed.cfm",
];

exports.triggerImport = async (req, res) => {
  try {
    for (let url of sources) {
      const jobs = await fetchJobsFromXML(url);
      await addJobsToQueue(jobs, url);
    }

    res.json({ message: "Job fetch triggered and queued successfully." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to queue job imports" });
  }
};

exports.getImportLogs = async (req, res) => {
  try {
    const logs = await ImportLog.find()
    console.log("logs on fetching ", logs);
    
    res.status(200).json({message:"fetch successfully", logs});
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch import logs" });
  }
};
exports.getJobs = async (req, res) => {
  try {
    const jobsData = await Jobs.find()
    console.log("jobsData on fetching ", jobsData);
    
    res.status(200).json({message:"Jobs fetch successfully", jobsData});
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch import logs" });
  }
};
