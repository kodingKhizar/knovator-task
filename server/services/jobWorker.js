const { Worker } = require("bullmq");
const Redis = require("ioredis");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Jobs = require("../models/Jobs");
const ImportLog = require("../models/ImportLog");

dotenv.config({ path: "../.env" });

console.log("Connecting to MongoDB:", process.env.MONGO_URI);
mongoose.connect(process.env.MONGO_URI);

const connection = new Redis(process.env.REDIS_URL, {
  maxRetriesPerRequest: null,
});

// Recursively replace $ and : in all object keys
function sanitizeKeys(obj) {
  if (Array.isArray(obj)) {
    return obj.map(sanitizeKeys);
  } else if (typeof obj === 'object' && obj !== null) {
    const newObj = {};
    for (const key in obj) {
      const safeKey = key.replace(/\$/g, '_dollar_').replace(/:/g, '_colon_');
      newObj[safeKey] = sanitizeKeys(obj[key]);
    }
    return newObj;
  }
  return obj;
}

const worker = new Worker(
  "job-import",
async (job) => {
  const { job: jobDataRaw, sourceUrl } = job.data;

  try {
    // ✅ Extract and sanitize GUID
    let guid = jobDataRaw.guid;
    if (typeof guid === "object" && guid._) {
      guid = guid._;
    }

    if (!guid || typeof guid !== "string") {
      throw new Error("Invalid or missing guid");
    }

    // ✅ Parse pubDate only if valid string
    let pubDate = null;
    const rawPubDate = jobDataRaw.pubDate;

    if (typeof rawPubDate === "string" || rawPubDate instanceof String) {
      const parsed = new Date(rawPubDate);
      if (!isNaN(parsed.getTime())) {
        pubDate = parsed;
      }
    }

    // ✅ Fallback: If invalid, skip job
    if (!pubDate) {
      throw new Error("Invalid pubDate: not a valid date string");
    }

    // ✅ Prepare sanitized data
    // const sanitizedJobData = sanitizeKeys({
    //   ...jobDataRaw,
    //   guid,
    //   pubDate,
    // });
   const sanitizedJobData = {
  ...sanitizeKeys({ ...jobDataRaw, guid }),
  pubDate, // prevent sanitizeKeys from corrupting it
};




    // ✅ Upsert import log
    const log = await ImportLog.findOneAndUpdate(
      { sourceUrl, timestamp: { $gte: new Date(Date.now() - 3600000) } },
      {
        $setOnInsert: { timestamp: new Date(), sourceUrl },
        $inc: { totalFetched: 1 },
      },
      { upsert: true, new: true }
    );

    const existing = await Jobs.findOne({ guid });

    if (existing) {
      await Jobs.updateOne({ guid }, sanitizedJobData);
      log.updatedJobs = (log.updatedJobs || 0) + 1;
    } else {
      await Jobs.create(sanitizedJobData);
      log.newJobs = (log.newJobs || 0) + 1;
    }

    await log.save();
    console.log("✅ Saved job:", guid);
  } catch (err) {
    console.error("❌ Job create failed:", err.message);

    const fallbackGuid =
      typeof jobDataRaw.guid === "object" && jobDataRaw.guid._ ? jobDataRaw.guid._ : "unknown";

    const log = await ImportLog.findOneAndUpdate(
      { sourceUrl, timestamp: { $gte: new Date(Date.now() - 3600000) } },
      { $setOnInsert: { timestamp: new Date(), sourceUrl } },
      { upsert: true, new: true }
    );

    log.failedJobs = log.failedJobs || [];
    log.failedJobs.push({
      error: err.message,
      guid: fallbackGuid,
    });
    await log.save();
  }
},



  { connection, concurrency: 5 }
);


// Optional: handle worker errors
worker.on("failed", (job, err) => {
  console.error(`❌ Job failed: ${job.id}`, err);
});

module.exports = worker;