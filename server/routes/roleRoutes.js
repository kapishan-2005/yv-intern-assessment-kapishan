const express = require("express");
const router = express.Router();
const { createRole, getRoles,updateRole}= require("../controllers/roleController");
const protect = require("../middleware/authMiddleware");
const chairmanOnly = require("../middleware/chairmanOnly");

router.post("/", protect, chairmanOnly, createRole);
router.get("/", protect, chairmanOnly, getRoles);
router.put("/:id", protect, chairmanOnly, updateRole);

module.exports = router;