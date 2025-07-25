// models/Coupon.js
const mongoose = require("mongoose");

const CouponSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      uppercase: true,
    },
    code: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      uppercase: true,
    },
    discount: {
      type: Number,
      required: true,
      min: 0,
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Coupon", CouponSchema);