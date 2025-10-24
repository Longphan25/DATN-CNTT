const Payment = require("../models/Payment");

// 🟢 Lấy danh sách thanh toán
exports.getAllPayments = async (req, res) => {
  try {
    const payments = await Payment.find().populate("ticketId");
    res.json(payments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 🟢 Tạo thanh toán mới
exports.createPayment = async (req, res) => {
  try {
    const newPayment = new Payment(req.body);
    const saved = await newPayment.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
