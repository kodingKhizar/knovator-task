const { Queue } = require("bullmq");
const Redis = require("ioredis");
const connection = new Redis(
  "rediss://red-ctrokqjtq21c738vj94g:gJvmsZsOG3yJRN9nwBquz02tda6DpvHE@singapore-keyvalue.render.com:6379"
);

const jobQueue = new Queue("job-import", { connection });

async function addJobsToQueue(jobs, sourceUrl) {
  await jobQueue.addBulk(
    jobs.map((job) => ({
      name: job.title,
      data: { job, sourceUrl },
    }))
  );
}

module.exports = { jobQueue, addJobsToQueue };
