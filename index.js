import express from "express";

import cors from "cors";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import dbConnect from "./config/database.js";
import quizRouter from "./routes/quizRouter.js";
import authRouter from "./routes/authRouter.js";

import { configDotenv } from "dotenv";

configDotenv();

const PORT = process.env.PORT || 4000;
dbConnect();
const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(cookieParser());

app.use(bodyParser.urlencoded({ extended: true }));

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/quiz", quizRouter);

app.get("/", (req, res) => {
  return res.json({
    success: true,
    message: "Server is up and running",
  });
});

app.listen(PORT, () => {
  console.log(`App is running at port ${PORT}`);
});
