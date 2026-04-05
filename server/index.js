const express = require("express");
const cors = require("cors");
require("dotenv").config();

const connectDB = require("./config/db");

const authRoutes = require("./routes/auth");
const timetableRoutes = require("./routes/timetable");
const bookingRoutes = require("./routes/booking");
const pathRoutes = require("./routes/path");

const app = express();

connectDB();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/timetable", timetableRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/path", pathRoutes);

app.get("/", (req, res) => {
  res.send("Campus Navigation Backend Running");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});