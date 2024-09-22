import { QuizMaker } from "../utils/AIservices/quizMakerAI.js";
import Question from "../models/Question.js";
import Quiz from "../models/Quiz.js";
import { mailSender } from "../utils/MailSender.js";
import Submission from "../models/Submission.js";
import { suggestionsGenerator } from "../utils/AIservices/SuggestionAI.js";
import mongoose from "mongoose";

export const createQuiz = async (req, res) => {
  try {
    const username = req.user.username;
    const { grade, Subject, TotalQuestions, MaxScore, Difficulty } = req.body;

    // Generate questions using your QuizGenerator function
    const generatedQuestions = await QuizMaker(
      grade,
      Subject,
      TotalQuestions,
      MaxScore,
      Difficulty
    );

    // Verify token and get user info from the auth service

    const questionIds = [];

    for (const questionData of generatedQuestions) {
      const question = new Question({
        questionTitle: questionData.questionTitle,
        options: questionData.options,
        correctOption: questionData.correctOption,
        difficulty: Difficulty,
      });
      await question.save();
      questionIds.push(question._id);
    }

    let quiz = new Quiz({
      grade,
      Subject,
      TotalQuestions,
      MaxScore,
      Difficulty,
      questions: questionIds,
      createdBy: username,
      createdAt: new Date(),
    });

    await quiz.save();

    //populate the quiz with questions
    quiz = await Quiz.findById(quiz._id).populate({
      path: "questions",
      model: "Question",
      select: "questionText options",
    });
    res.status(201).json({ message: "Quiz created successfully ", quiz });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Internal Server Error in Quiz Creation",
      error: error,
    });
  }
};

export const submitQuiz = async (req, res) => {
  try {
    const { quizId, responses, email = "" } = req.body;

    const username = req.user.username;

    // Fetch the quiz by quizId
    const quiz = await Quiz.findById(quizId).populate("questions");

    if (!quiz) {
      return res
        .status(404)
        .json({ message: "Quiz not found with a given Id." });
    }

    const { TotalQuestions, MaxScore } = quiz;
    const scorePerQuestion = MaxScore / TotalQuestions;
    let totalScore = 0;

    const evaluatedResponses = await Promise.all(
      responses.map(async (response) => {
        const question = await Question.findById(response.questionId); // Fetch the question by ID
        if (!question) {
          throw new Error(`Question with ID ${response.questionId} not found.`);
        }
        const isCorrect = response.userResponse === question.correctOption;
        if (isCorrect) {
          totalScore += scorePerQuestion;
        }

        return {
          questionId: response.questionId,
          questionText: question.questionText,
          userResponse: response.userResponse,
          correctOption: question.correctOption,
          isCorrect,
        };
      })
    );

    const submission = new Submission({
      quizId,
      username,
      responses: evaluatedResponses.map((response) => ({
        questionId: response.questionId,
        userResponse: response.userResponse,
      })),
      score: totalScore,
      submittedDate: new Date(),
    });

    await submission.save();

    res.status(201).json({
      message: "Quiz submitted successfully",
      scoreAchieve: totalScore,
      evaluatedResponses,
      submissionid: submission._id,
    });
  } catch (error) {
    console.error("Error submitting quiz:", error);
    res.status(500).json({
      message: "500 Internal Server Error || Unable to submit the quiz",
      error: error,
    });
  }
};

export const updateQuestion = async (req, res) => {
  try {
    const username = req.user.username;
    const { questionid } = req.params;
    const { questionText, options, correctOption } = req.body;
    console.log(req.body);

    const updatedQuestion = await Question.findByIdAndUpdate(
      new mongoose.Types.ObjectId(questionid),
      {
        questionText,
        options,
        correctOption,
      },
      {
        new: true,
      }
    );
    res.status(200).json({
      message: "Question updated successfully",
      updatedQuiz: updatedQuestion,
    });
  } catch (error) {
    console.error("Error retrieving question:", error);
    res.status(500).json({
      message: " 500 Internal Server Error || Unable to update question",
      error: error.message,
    });
  }
};

export const getQuizHistory = async (req, res) => {
  try {
    const { grade, subject, minScore, maxScore, fromDate, toDate } = req.query;
    const username = req.user.username;

    if (!username) {
      return res
        .status(401)
        .json({ message: "Unauthorized: No username found" });
    }

    let query = { username };
    // const cacheKey = generateCacheKey(username, { grade, subject, minScore, maxScore, fromDate, toDate });
    // const cachedData = await Client.get(cacheKey);
    // if (cachedData) {
    //     return res.status(200).json({
    //         message: 'Quiz history retrieved from cache successfully',
    //         data: JSON.parse(cachedData),
    //     });
    // }

    // Join Submission with Quiz to apply filters on Quiz fields (grade, subject)
    const quizMatch = {};
    if (grade) {
      quizMatch.grade = Number(grade);
    }
    if (subject) {
      quizMatch.Subject = subject;
    }
    if (minScore) {
      query.score = { ...query.score, $gte: Number(minScore) };
    }
    if (maxScore) {
      query.score = { ...query.score, $lte: Number(maxScore) };
    }
    if (fromDate || toDate) {
      query.submittedDate = {};
      if (fromDate) {
        query.submittedDate.$gte = new Date(fromDate);
      }
      if (toDate) {
        query.submittedDate.$lte = new Date(toDate);
      }
    }

    // finding the submissions of quizs on based using the match feature of mongoose model.
    const submissions = await Submission.find(query)
      .populate({
        path: "quizId",
        match: quizMatch,
        select: "grade Subject TotalQuestions MaxScore Difficulty",
        populate: {
          path: "questions",
          model: "Question",
          select: "questionText options correctOption",
        },
      })
      .exec();

    // Filter out any submissions where quizId is null (because of mismatching quiz filters)
    const filteredSubmissions = submissions.filter(
      (sub) => sub.quizId !== null
    );
    console.log(submissions);
    console.log(filteredSubmissions);

    if (filteredSubmissions.length > 0) {
      res.status(200).json({
        message: "Quiz history fetched successfully",
        history: filteredSubmissions,
      });
    } else {
      res
        .status(404)
        .json({ message: "No quiz history found with the given details" });
    }
  } catch (error) {
    console.error("Error retrieving quiz history:", error);
    res.status(500).json({
      message:
        "500 Internal Server Error  || Not able to retrieve Quiz History ",
    });
  }
};

export const getQuizById = async (req, res) => {
  try {
    const { quizid } = req.params;

    //cache the quiz
    // const cacheKey = `quiz:${Quizid}`;
    // const cachedData = await Client.get(cacheKey);
    // if (cachedData) {
    //     return res.status(200).json({ message: 'Quiz retrieved from cache successfully', data: JSON.parse(cachedData) });
    // }

    // quizId is in string
    // therefore converting it in mongoose objectId
    const quiz = await Quiz.findById(
      new mongoose.Types.ObjectId(quizid)
    ).populate({
      path: "questions",
      model: "Question",
      select: "questionText options",
    });
    if (!quiz) {
      return res.status(404).json({ message: "Quiz not found" });
    }
    // await Client.set(cacheKey, JSON.stringify(quiz), "EX", 60 * 60 * 24);
    res
      .status(200)
      .json({ message: "Quiz retrieved successfully", data: quiz });
  } catch (error) {
    console.error("Error retrieving quiz:", error);
    res.status(500).json({ message: error.message });
  }
};
