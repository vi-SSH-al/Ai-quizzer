import mongoose from "mongoose";

const quizSchema = new mongoose.Schema({
  grade: {
    type: Number,
    required: true,
  },
  Subject: {
    type: String,
    required: true,
  },
  TotalQuestions: {
    type: Number,
    required: true,
  },
  Difficulty: {
    type: String,
    enum: ["EASY", "MEDIUM", "HARD"],
    required: true,
  },
  questions: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Question",
    },
  ],
  MaxScore: {
    type: Number,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  createdBy: {
    type: String,
    required: true,
  },
});

export default mongoose.model("Quiz", quizSchema);
