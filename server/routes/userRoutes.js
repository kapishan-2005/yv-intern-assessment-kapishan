const express = require("express");
const router = express.Router();
const { assignOfficerRole, getAllUsers}= require("../controllers/userController");
const protect = require("../middleware/authMiddleware");
const chairmanOnly = require("../middleware/chairmanOnly");
const requirePermission = require("../middleware/permissionMiddleware");


router.get("/", protect, requirePermission("member.view"), getAllUsers);
router.put("/assign-role", protect, chairmanOnly, assignOfficerRole);

module.exports = router;