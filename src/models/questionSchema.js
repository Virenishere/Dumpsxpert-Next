import mongoose from "mongoose";

const optionSchema = new mongoose.Schema({
  label: String,
  text: String,
  image: String, // 🆕 optional image per option
});

const questionSchema = new mongoose.Schema(
  {
    examId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Exam",
      required: true,
    },
    questionCode: { type: String },
    questionText: String,
    questionImage: String,
    questionType: { type: String, default: "radio" },
    difficulty: String,
    marks: Number,
    negativeMarks: Number,
    subject: String,
    topic: String,
    tags: [String],
    options: [optionSchema],
    correctAnswers: [String],
    isSample: Boolean,
    explanation: String,
    status: {
      type: String,
      enum: ["publish", "draft"],
      default: "draft",
    },
  },
  { timestamps: true }
);

questionSchema.index({ examId: 1, questionCode: 1 }, { unique: true });

// ✅ Check if model already exists to avoid overwrite error in Next.js dev
const Question = mongoose.models.Question || mongoose.model("Question", questionSchema);

export default Question;
