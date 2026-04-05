const mongoose = require("mongoose");

const timetableSchema = new mongoose.Schema({
  userId: String,
  subject: String,
  time: String,
  block: String,
  room: String,
  role: String
});

module.exports = mongoose.model("Timetable", timetableSchema);