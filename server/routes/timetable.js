const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const {
  getTimetable
} = require("../controllers/timetableController");

router.get("/", authMiddleware, getTimetable);

module.exports = router;