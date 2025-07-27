// models/GeneralFAQ.js
const mongoose = require('mongoose');

const faqSchema = new mongoose.Schema(
  {
    question: {
      type: String,
      required: true,
      trim: true,
    },
    answer: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { timestamps: true }
);

// Prevent model overwrite on hot reloads in development
const GeneralFAQ = mongoose.models.GeneralFAQ || mongoose.model('GeneralFAQ', faqSchema);

module.exports = GeneralFAQ;
