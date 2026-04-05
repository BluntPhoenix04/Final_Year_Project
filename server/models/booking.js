const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
  room: String,
  date: String,
  time: String,
  facultyId: String
});

module.exports = mongoose.model("Booking", bookingSchema);