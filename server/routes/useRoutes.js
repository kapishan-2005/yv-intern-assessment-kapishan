const express = require("express");
const router = express.Router();
const { assignOfficerRole, getAllUsers}= require("../controllers/userController");
const protect = require("../middleware/authMiddleware");
const chairmanOnly = require("../middleware/chairmanOnly");

router.get("/", protect, chairmanOnly, getAllUsers);
router.put("/assign-role", protect, chairmanOnly, assignOfficerRole);

module.exports = router;