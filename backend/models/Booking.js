const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  trip: { type: mongoose.Schema.Types.ObjectId, ref: 'Trip', required: true },
  from_stop: { type: mongoose.Schema.Types.ObjectId, ref: 'RouteStop' },
  to_stop: { type: mongoose.Schema.Types.ObjectId, ref: 'RouteStop' },
  seat_numbers: [String],
  total_price: Number,
  status: { type: String, enum: ['pending','paid','cancelled','completed'], default: 'pending' },
  payment_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Payment', default: null }
}, { timestamps: true });

module.exports = mongoose.model('Booking', bookingSchema);
