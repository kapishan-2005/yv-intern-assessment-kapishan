const express = require("express");
const router = express.Router();
const { getAuditLogs}= require("../controllers/auditcontroller");
const protect = require("../middleware/authMiddleware");
const requirePermission = require("../middleware/permissionMiddleware");

router.get("/", protect, requirePermission("audit.view"), getAuditLogs);

module.exports = router;