import nodemailer from "nodemailer";

export const mailSender = async (
  userEmail,
  score,
  maxScore,
  evaluatedResponses,
  suggestions
) => {
  // console.log(responses);
  const transporter = nodemailer.createTransport({
    service: "gmail",
    host: process.env.MAIL_HOST,
    port: 587,
    secure: false, // true for port 465, false for other ports
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS,
    },
  });
  const mailOptions = {
    from: { name: "AI Quizzer", address: process.env.USER_MAIL },
    to: userEmail,
    subject: "Your Quiz Results are out",
    text: `
            Hi,
            
            You Scored : 
           ${score}/${maxScore}

            Your performance on each question:
            ${evaluatedResponses
              .map(
                (response) => `
                Question: ${response.questionTitle}
                Your Response: ${response.userResponse}
                Correct Answer: ${response.correctOption}
                Correct: ${response.isCorrect ? "Yes" : "No"}
            `
              )
              .join("")}

            Suggestions for improving your skills:
            ${suggestions}


            Keep Learning && Keep Grinding
        `,
  };

  // Send the email
  console.log("Inside nodemailer");
  console.log(evaluatedResponses);
  await transporter.sendMail(mailOptions);
};
