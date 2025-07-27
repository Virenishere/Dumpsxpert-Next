const mongoose = require("mongoose");

const resultSchema = new mongoose.Schema({
  studentId: { type: String, required: true },
  examCode: { type: String, required: true },
  attempt: { type: Number, default: 1 }, // attempt number
  totalQuestions: Number,
  code: { type: String },
  attempted: Number,
  wrong: Number,
  correct: Number,
  percentage: Number,
  duration: Number,
  completedAt: String,
  userAnswers: Object,
  questions: Array,
}, { timestamps: true });

// Remove index constraint
// resultSchema.index({ studentId: 1, examCode: 1 }, { unique: true });

// Prevent model overwrite in development
const Result = mongoose.models.Result || mongoose.model("Result", resultSchema);

module.exports = Result;
