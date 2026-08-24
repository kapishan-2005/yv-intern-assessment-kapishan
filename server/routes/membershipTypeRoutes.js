const express = require("express");
const router = express.Router();
const { getMembershipTypes } = require("../controllers/membershipTypeController");
const protect = require("../middleware/authMiddleware");

router.get("/", protect, getMembershipTypes);

module.exports = router;