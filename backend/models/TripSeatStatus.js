const mongoose = require('mongoose');

const tripSeatStatusSchema = new mongoose.Schema({
  trip: { type: mongoose.Schema.Types.ObjectId, ref: 'Trip', required: true },
  seat_number: String,
  status: { type: String, enum: ['available','reserved','booked','checked_in'], default: 'available' },
  booking_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Booking', default: null }
}, { timestamps: true });

module.exports = mongoose.model('TripSeatStatus', tripSeatStatusSchema);
