const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const allowFacultyOnly = require("../middleware/roleMiddleware");

const { bookRoom } = require("../controllers/bookingController");

router.post("/", authMiddleware, allowFacultyOnly, bookRoom);

module.exports = router;