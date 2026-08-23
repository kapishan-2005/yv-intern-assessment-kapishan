const express = require("express");
const router = express.Router();
const {submitApplication, getMyApplication} = require("../controllers/applicationController");
const protect = require("../middleware/authMiddleware");

router.post("/", protect, submitApplication);
router.get("/my", protect, getMyApplication)

module.exports = router;
