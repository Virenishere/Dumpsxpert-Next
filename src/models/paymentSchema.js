const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  currency: {
    type: String,
    required: true,
    default: "INR",
  },
  paymentMethod: {
    type: String,
    enum: ["paypal", "razorpay"],
    required: true,
  },
  paymentId: {
    type: String,
    required: true,
  },
  orderId: {
    type: String, // Add orderId field for Razorpay
    required: false, // Optional, as PayPal may not use it
  },
  status: {
    type: String,
    enum: ["pending", "completed", "failed"],
    default: "pending",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Payment", paymentSchema);