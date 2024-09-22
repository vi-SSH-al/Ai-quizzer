import mongoose, { mongo } from "mongoose";

const userSchema = mongoose.Schema({
  username: {
    type: String,
    required: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ["Student", "Faculty"],
    default: "Student",
  },
});

export default mongoose.Schema("User", userSchema);
