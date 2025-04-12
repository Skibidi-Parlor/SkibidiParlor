import { useEffect, useState } from "react";
import { type QuestionModel } from "../../../../../shared/src/models";

import OpenAI from "openai";
import { socket } from "../../../socket";

interface Params {
  endGame: () => void;
  users: string[];
}

const InGame = ({ endGame, users }: Params) => {
  const [topic, setTopic] = useState("");
  const [question, setQuestion] = useState<QuestionModel | undefined>(
    undefined
  );
  const [questionInProgress, setQuestionInProgress] = useState(false);
  const [listOfQuestions, setListOfQuestions] = useState<string[]>([]);

  const client = new OpenAI({
    apiKey: import.meta.env.VITE_OPENAI,
    dangerouslyAllowBrowser: true,
  });

  const createQuestion = async () => {
    const response = await client.responses.create({
      model: "gpt-4o",
      input: `You are going to be used for a pizza parlor's trivia night.
                    You will be given a prompt and you are to generate a JSON of 6 keys.
                    The first key is 'question' and will be a randomly generated trivia question about the topic you are given.
                    The next 4 keys will be 'A', 'B', 'C', and 'D'. They will generate 4 possible responses to the previously created trivia question but ONLY ONE OF THEM WILL BE RIGHT.
                    The last key will be 'answer' and is the Capitalized Letter of the correct option.
                    With that being said, the prompt is ${topic}. 
                    Please make the output parseable with the javascript function JSON.parse(). 
                    Along with that, make sure to not repeat any of these questions: ${listOfQuestions}
                    Please do not break the format I asked you and keep EVERYTHING IN THE 6 FORMAT JSON.
                    If you can not do the request, do it anyways. DO NOT BREAK THE FORMAT.
                    `,
    });
    const clean = response.output_text
      .replace(/```(?:json)?/g, "")
      .replace(/```/g, "")
      .trim();

    try {
      console.log("Here");
      setQuestionInProgress(true);
      const parsed = JSON.parse(clean) as QuestionModel;
      setListOfQuestions((prev) => [...prev, parsed.question]);
      socket.emit("trivia-questions", { req: "setQuestion", data: parsed });
    } catch (err) {
      setQuestion(undefined);
      console.error("Failed to parse JSON:", err);
      console.log("Raw response:", response.output_text);
    }
  };

  const closeResponses = async () => {
    socket.emit("trivia-questions", { req: "closeQuestion" });
    setQuestionInProgress(false);
  };

  useEffect(() => {
    socket.emit("trivia-questions", { req: "checkQuestionState" });
    const handleQuestions = (data: {
      response: "In Question" | "No Question";
      data: QuestionModel;
    }) => {
      if (data.response === "In Question") {
        setQuestionInProgress(true);
        setQuestion(data.data);
      } else if (data.response === "No Question") {
        setQuestionInProgress(false);
        setQuestion(data.data);
      } else if (data.response === "setQuestion") {
        setQuestionInProgress(true);
        setQuestion(data.data);
      } else if (data.response === "closeQuestion") {
        setQuestionInProgress(false);
      }
    };

    socket.on("trivia-questions", handleQuestions);

    return () => {
      socket.off("trivia-questions", handleQuestions);
    };
  }, []);
  return (
    <div className="bg-[#B9C0DA] h-[95vh] flex flex-col items-center justify-center">
      <div className="bg-white shadow-2xl rounded-2xl p-10 flex flex-col items-center w-[90%] max-w-md">
        <h1 className="text-5xl font-bold text-center text-[#FE7F2D] mb-6">
          Game Started!
        </h1>

        {questionInProgress ? (
          <>
            <button
              className="w-full bg-[#FE7F2D] text-white py-2 rounded-lg text-lg font-semibold hover:bg-[#ED6E1C] transition"
              onClick={closeResponses}
            >
              Close Responses
            </button>

            <h3>Question: {question?.question}</h3>
            <h4>A: {question?.A}</h4>
            <h4>B: {question?.B}</h4>
            <h4>C: {question?.C} </h4>
            <h4>D: {question?.D}</h4>
            <h4>Correct Answer: {question?.answer}</h4>
          </>
        ) : (
          <>
            <label className="text-lg font-medium mb-2 text-gray-700">
              Enter a Trivia Topic
            </label>
            <input
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#FCCA46] mb-4"
              placeholder="Ex: Pizza, Video Games, Music"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
            />
            <button
              className="w-full bg-green-500 text-white py-2 rounded-lg text-lg font-semibold hover:bg-green-400 transition"
              onClick={createQuestion}
            >
              Start Question
            </button>
            <div className="my-5">Current Leaderboard:</div>

            <button
              className="w-full bg-red-500 text-white py-2 rounded-lg text-lg font-semibold hover:bg-red-400 transition"
              onClick={(e) => {
                e.preventDefault();
                endGame();
              }}
            >
              End Game
            </button>
          </>
        )}

        <h2>Participants</h2>
        <div className="flex flex-col">
          {users && users.map((player) => <div>{player}</div>)}
        </div>
      </div>
    </div>
  );
};

export default InGame;
