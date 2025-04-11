import { useState } from "react";

interface Params {
  startNewGame: (topic: string) => void;
}
const StartGame = ({ startNewGame }: Params) => {
  const [topic, setTopic] = useState("");
  const [numberOfQuestions, setNumberOfQuestions] = useState<number>(3);
  const [timePerQuestion, setTimePerQuestion] = useState<number>(5);

  const players = ["A", "B", "C", "D"];

  return (
    <div className="bg-[#B9C0DA] min-h-[95vh] max-h-[95vh] flex items-center justify-center">
      <div className="bg-white shadow-2xl rounded-2xl p-10 flex flex-col items-center w-[90%] max-w-md max-h-[85vh] overflow-scroll">
        <h1 className="text-5xl font-bold text-center text-[#FCCA46] mb-6">
          Start a Trivia Session!
        </h1>

        <label className="text-lg font-medium mb-2 text-gray-700">
          Enter a Trivia Topic
        </label>
        <input
          className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#FCCA46] mb-4"
          placeholder="Ex: Pizza, Video Games, Music"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
        />

        <label className="text-lg font-medium mb-2 text-gray-700">
          Select # of questions
        </label>
        <input
          type="number"
          className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#FCCA46] mb-4"
          placeholder="Ex: Pizza, Video Games, Music"
          value={numberOfQuestions}
          onChange={(e) =>
            setNumberOfQuestions(e.target.value as unknown as number)
          }
        />

        <label className="text-lg font-medium mb-2 text-gray-700">
          Set Time per Question
        </label>
        <input
          type="number"
          className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#FCCA46] mb-4"
          placeholder="Ex: Pizza, Video Games, Music"
          value={timePerQuestion}
          onChange={(e) =>
            setTimePerQuestion(e.target.value as unknown as number)
          }
        />

        <button
          className="w-full bg-[#FCCA46] text-white py-2 rounded-lg text-lg font-semibold hover:bg-[#EBBA45] transition"
          onClick={(e) => {
            e.preventDefault();
            startNewGame(topic);
          }}
        >
          Start Trivia Session
        </button>

        <label className="text-lg font-medium mb-2 text-gray-700 mt-1">
          Players:
        </label>
        <div className="flex flex-col">
          {players.map((player) => (
            <div>{player}</div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StartGame;
