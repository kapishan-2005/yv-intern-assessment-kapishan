const express = require("express");
const router = express.Router();
const {submitApplication, getMyApplication,getAllApplications,approveApplication,rejectApplication} = require("../controllers/applicationController");
const protect = require("../middleware/authMiddleware");
const requirePermission = require("../middleware/permissionMiddleware");

router.post("/", protect, submitApplication);
router.get("/my", protect, getMyApplication);
router.get("/", protect, requirePermission("application.view"),getAllApplications);
router.put("/:id/approve", protect, requirePermission("application.approve"),approveApplication);
router.put("/:id/reject", protect, requirePermission("application.reject"),rejectApplication);

module.exports = router;
