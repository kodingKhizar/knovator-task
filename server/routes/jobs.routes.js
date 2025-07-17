const express = require("express");
const router = express.Router();
const jobController = require("../controllers/jobs.controller");

router.post("/trigger-import", jobController.triggerImport);
router.get("/import-history", jobController.getImportLogs);
router.get("/getAllJobs", jobController.getJobs);

module.exports = router;
