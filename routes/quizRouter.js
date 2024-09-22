import express from "express";
import {
  createQuiz,
  submitQuiz,
  getQuizHistory,
  getQuizById,
  updateQuestion,
} from "../controllers/quizControllers.js";
import { getHints, sendAiSuggestion } from "../controllers/aiController.js";
import { auth } from "../middleware/auth.js";
const quizRouter = express.Router();

// Necessary API routes

quizRouter.post("/create", auth, createQuiz);
quizRouter.post("/submit", auth, submitQuiz);
quizRouter.post("/retry", auth, submitQuiz);
quizRouter.post("/mailed", auth, sendAiSuggestion);

quizRouter.put("/updatequestion/:questionid", auth, updateQuestion);

quizRouter.get("/quizhistory", auth, getQuizHistory);
quizRouter.get("/quizdetails/:quizid", auth, getQuizById);
quizRouter.get("/gethint/:questionId", auth, getHints);

// Bonus API routes

export default quizRouter;
