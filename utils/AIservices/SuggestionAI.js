import Groq from "groq-sdk";
import dotenv from "dotenv";
dotenv.config();

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function suggestionsGenerator(
  totalScore,
  MaxScore,
  evaluatedResponses
) {
  try {
    const suggestionsPrompt = `
    Based on the following performance in a quiz, provide two short skill improvement suggestions in second person
    (give entire two suggestion in one square bracket):
    Score: ${totalScore}/${MaxScore}
    Performance: ${evaluatedResponses
      .map(
        (response) => `
        Question: ${response.questionText}, Correct: ${
          response.isCorrect ? "Yes" : "No"
        }
    `
      )
      .join(" ")}
    `;
    const chatCompletion = await getGroqChatCompletion(suggestionsPrompt);
    const responseContent = chatCompletion.choices[0]?.message?.content || "";
    return responseContent;
  } catch (error) {
    console.error("Error generating Suggestion:", error);
    throw new Error("Failed to generate Suggestion");
  }
}
export async function getGroqChatCompletion(prompt) {
  return groq.chat.completions.create({
    messages: [
      {
        role: "user",
        content: prompt,
      },
    ],
    model: "llama3-8b-8192",
  });
}
