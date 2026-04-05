const Booking = require("../models/Booking");

const bookingController = {
  // Get bookings
  getBookings: async (req, res) => {
    try {
      const bookings = await Booking.find({
        facultyId: req.user.id
      });
      res.json(bookings);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Create booking
  createBooking: async (req, res) => {
    try {
      const { room, date, time } = req.body;
      const booking = new Booking({
        room,
        date,
        time,
        facultyId: req.user.id
      });
      await booking.save();
      res.status(201).json(booking);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Update booking
  updateBooking: async (req, res) => {
    try {
      const { id } = req.params;
      const { room, date, time } = req.body;
      const booking = await Booking.findByIdAndUpdate(
        id,
        { room, date, time },
        { new: true }
      );
      res.json(booking);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Delete booking
  deleteBooking: async (req, res) => {
    try {
      const { id } = req.params;
      await Booking.findByIdAndDelete(id);
      res.json({ message: 'Booking deleted' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
};

// Export with bookRoom alias
module.exports = {
  ...bookingController,
  bookRoom: bookingController.createBooking
};
