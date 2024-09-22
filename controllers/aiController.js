import Question from "../models/Question.js";
import Quiz from "../models/Quiz.js";
import Submission from "../models/Submission.js";
import { suggestionsGenerator } from "../utils/AIservices/SuggestionAI.js";
import { HintAI } from "../utils/AIservices/HintAI.js";
import { mailSender } from "../utils/MailSender.js";
import mongoose from "mongoose";

export const sendAiSuggestion = async (req, res) => {
  try {
    const { submissionId, quizId, username, email } = req.body;
    const subId = new mongoose.Types.ObjectId(submissionId);
    const qId = new mongoose.Types.ObjectId(quizId);
    if (!email) {
      return res.status(401).json({
        message: "Email required for sending results and mail ",
      });
    }
    // If submissionId is present then, submission will be get from findbyId
    // if it doesn't then the latest submission will be take by the given userId and quizId
    let submission;
    if (subId) {
      submission = await Submission.findById(submissionId).populate("quizId");
    } else {
      submission = await Submission.findOne(
        {
          quizId: qId,
          username: username,
        },
        { sort: { submittedDate: -1 } }
      ).populate("quizId");
    }
    const totalScore = submission.score;
    const MaxScore = submission.quizId.MaxScore;
    const totalQuestions = submission.quizId.TotalQuestions;
    let scorePerQuestion = MaxScore / totalQuestions;
    const responses = submission.responses;

    const evaluatedResponses = await Promise.all(
      responses.map(async (response) => {
        const question = await Question.findById(response.questionId); // Fetch the question by ID

        const isCorrect = response.userResponse === question.correctOption;

        return {
          questionId: response.questionId,
          questionTitle: question.questionTitle,
          userResponse: response.userResponse,
          correctOption: question.correctOption,
          isCorrect,
        };
      })
    );

    console.log("aicontroller:::::}");
    console.log(evaluatedResponses);
    if (email) {
      const aiRes = await suggestionsGenerator(
        totalScore,
        MaxScore,
        evaluatedResponses
      );
      // console.log(aiResponse);

      const AIsuggestions = aiRes?.match(/\[(.*?)\]/)[1];
      await mailSender(
        email,
        totalScore,
        MaxScore,
        evaluatedResponses,
        AIsuggestions
      );

      res.status(201).json({
        message: "Quiz results along with suggestions emailed successfully",
        Total_Score: totalScore,
        suggestions: AIsuggestions,
      });
    }
  } catch (error) {
    console.log(error);
    res.status(404).json({
      message:
        " 404 Internal Server Error || Unable to send the results and suggestions via mail",
      error: error.message,
    });
  }
};

export const getHints = async (req, res) => {
  try {
    const { questionId } = req.params;

    const question = await Question.findById(questionId);
    if (!question) {
      return res
        .status(404)
        .json({ message: "Question not found with the given Id" });
    }

    const aiResponse = await HintAI(question); // Function to call the AI
    const hint = aiResponse;
    // Return the hint to the client
    res.status(200).json({
      message: "Hint generated successfully",
      Hints: hint,
    });
  } catch (error) {
    console.error("Error generating hint:", error);
    res.status(500).json({
      message: "500  Internal Server Error || Unable due to generate Hints",
      error: error.message,
    });
  }
};
