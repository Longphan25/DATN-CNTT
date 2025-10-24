const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  booking: { type: mongoose.Schema.Types.ObjectId, ref: 'Booking', required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  method: String,
  amount: Number,
  transaction_code: String,
  status: { type: String, enum: ['success','failed','pending'], default: 'pending' },
  paid_at: Date
}, { timestamps: true });

module.exports = mongoose.model('Payment', paymentSchema);
