const express = require("express");
const router = express.Router();
const {submitApplication} = require("../controllers/applicationController");
const protect = require("../middleware/authMiddleware");

router.post("/", protect, submitApplication);

module.exports = router;
