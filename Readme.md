# AI Quizzer - Backend Server

##### Project Overview
AI Quizzer is a microservice designed to manage student quizzes and scores, offering core functionalities such as user authentication, quiz generation through AI, score evaluation, and retrieval of quiz history.

------------

#### **Table of Contents**
- Features
- Tech Stack
- Setup and Installation
- Environment Variables
- API Documentation
- Database Schema



------------


**Features**
-  User Authentication via JWT and cookies
-  AI-powered Quiz Generation.
- Quiz Answer Submission and Score Evaluation.
- Retrieve Quiz History with Filtering Options.
- Quiz Retry with Previous Submissions Accessible.
- Question Hint Generation via AI.
- Email Notifications of Quiz Results (Bonus Feature).- User Authentication via JWT and cookies.
- AI-powered Quiz Generation.
- Quiz Answer Submission and Score Evaluation.
- Retrieve Quiz History with Filtering Options.
- Quiz Retry with Previous Submissions Accessible.
- Question Hint Generation via AI.
- Email Notifications of Quiz Results (Bonus Feature).


------------


### 
### **Tech Stack**
Language: Node.js
Framework: Express.js
Database: MongoDB(Atlas)
Authentication: JWT
AI Service: Groq AI (for quiz, hint generation and suggestion)
Deployment: Render / Docker / (Heroku optional)
Email Service: Nodemailer


------------


###Setup and Installation

Install dependencies:
```bash
npm install
```

Configure environment variables:

Create a .env file in the root directory and add the following:


```bash
PORT=4000
JWT_SECRET=your_jwt_secret
MONGODB_URI=your_database_url
GROQ_API_KEY=your_ai_tool_api_key
MAIL_HOST=smtp.gmail.com
MAIL_USER= abcd@gmail.com
MAIL_PASS= 16 digit app password
```


Run the server:
```bash
npm start
```
The server will start running on http://localhost:4000.


------------


### Run with Docker (Optional):

###### Build the Docker image:
```bash
docker build -t ai-quizzer-backend .
```
Run the container:
```bash
docker run -p 4000:4000 ai-quizzer-backend
```
Environment Variables
```bash
PORT=4000
JWT_SECRET=your_jwt_secret
MONGODB_URI=your_database_url
GROQ_API_KEY=your_ai_tool_api_key
MAIL_HOST=smtp.gmail.com
MAIL_USER= abcd@gmail.com
MAIL_PASS= 16 digit app password
```





------------

## Database Schema

##### Question : 
**questionTitle:** String, required
**options:** Contains four options (A, B, C, D) each of type String, required
**correctOption:** Enum of ["A", "B", "C", "D"], required


##### Quiz
**grade: **Number, required
**Subject**: String, required
**TotalQuestions**: Number, required
**Difficulty:** Enum of ["EASY", "MEDIUM", "HARD"], required
**questions**: Array of ObjectId, references Question
**MaxScore:** Number, required
**createdAt:** Date, default Date.now
**createdBy:** String, required

##### Response
**questionId: **ObjectId, references Question, required
**userResponse**: String, required

##### Submission
**quizId: **ObjectId, references Quiz, required
**username:** String, required
**responses**: Array of Response objects
**score: **Number, required
**submittedDate:** Date, default Date.now

------------




## API Documentation

**Base URL**: https://ai-quizzer-r8bz.onrender.com or http://localhost:4000

### Authentication

##### POST      **/auth/login**
- Authenticate users and return JWT tokens.

### Quiz Management

##### POST /quiz/create
- Create a quiz based on the provided grade, subject, and number of questions.

##### POST /quiz/submit
- Submit quiz answers and get evaluated scores.

##### GET /quiz/quizdetails/:quizId
- Get the details of a quiz by its ID.

##### GET /quiz/quizhistory
- Retrieve quiz history based on filters such as grade, subject, score range, and date.

##### POST /quiz/retry
- Retry a quiz and re-evaluate scores.

##### GET /quiz/gethint/:questionId
- Get a hint for a given question.

##### POST /quiz/mailed
- Sends quiz results via email with suggestions to improve based on quiz responses.


Please refer to API documentation:  [Postman](https://documenter.getpostman.com/view/32462157/2sAXqtc27D "Postman")

------------


