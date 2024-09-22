import mongoose from "mongoose";

const questionSchema = new mongoose.Schema({
  questionTitle: {
    type: String,
    required: true,
  },
  options: {
    A: {
      type: String,
      required: true,
    },
    B: {
      type: String,
      required: true,
    },
    C: {
      type: String,
      required: true,
    },
    D: {
      type: String,
      required: true,
    },
  },
  correctOption: {
    type: String,
    enum: ["A", "B", "C", "D"],
    required: true,
  },
});

export default mongoose.model("Question", questionSchema);
