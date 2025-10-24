const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');
const TripSeatStatus = require('../models/TripSeatStatus');

router.post('/', async (req, res) => {
  try {
    const { user, trip, seat_numbers, total_price } = req.body;
    for (const s of seat_numbers) {
      const updated = await TripSeatStatus.findOneAndUpdate(
        { trip, seat_number: s, status: 'available' },
        { $set: { status: 'reserved' } },
        { new: true }
      );
      if (!updated) return res.status(400).json({ error: `Seat ${s} not available` });
    }
    const booking = await Booking.create({ ...req.body, status: 'paid' });
    await TripSeatStatus.updateMany(
      { trip, seat_number: { $in: seat_numbers } },
      { $set: { status: 'booked', booking_id: booking._id } }
    );
    res.status(201).json(booking);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.get('/', async (req, res) => {
  const bookings = await Booking.find().populate('user').populate('trip');
  res.json(bookings);
});

module.exports = router;
