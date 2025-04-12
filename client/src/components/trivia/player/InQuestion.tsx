import { useEffect, useState } from "react";
import { type QuestionModel } from "../../../../../shared/src/models";
import { socket } from "../../../socket";

interface Params {
  question: QuestionModel;
}
const InQuestion = ({ question }: Params) => {
  const [selected, setSelected] = useState<"A" | "B" | "C" | "D" | undefined>(
    undefined
  );

  const [recieved, setRecieved] = useState<string>("...loading");
  const [alreadyAnswered, setAlreadyAnswered] = useState(false);

  const sendAnswer = (letter: "A" | "B" | "C" | "D") => {
    setSelected(letter);
    socket.emit("trivia-questions", {
      req: "sendAnswer",
      user: localStorage.getItem("nickname"),
      answer: letter,
    });
    socket.emit("trivia-questions", { req: "checkTriviaReceived" });
  };

  useEffect(() => {
    socket.emit("trivia-questions", { req: "checkTriviaReceived" });

    const handleIncomingQuestions = (data: {
      response: string;
      received: string;
      users: string[];
    }) => {
      console.log(data);
      if (data.response === "checkTriviaReceived") {
        setRecieved(data.received);
        console.log(data);
        setAlreadyAnswered(
          data.users.includes(localStorage.getItem("nickname")!)
        );
      }
    };

    socket.on("trivia-questions", handleIncomingQuestions);

    return () => {
      socket.off("trivia-questions", handleIncomingQuestions);
    };
  }, []);

  return (
    <div className="bg-white shadow-2xl rounded-2xl p-10 flex flex-col items-center w-[90%] max-w-md max-h-[85vh] overflow-scroll">
      <h1 className="text-5xl font-bold text-center text-[#FCCA46] mb-6">
        {question.question}
      </h1>
      <h2>{recieved}</h2>
      {alreadyAnswered ? (
        <div>Answer Submitted! </div>
      ) : (
        <div>
          {" "}
          <button
            className={`p-4 cursor-pointer ${
              selected === "A" ? "bg-green-300" : "bg-red-100"
            }`}
            onClick={() => sendAnswer("A")}
          >
            A: {question.A}
          </button>
          <button
            className={`p-4 cursor-pointer ${
              selected === "B" ? "bg-green-300" : "bg-red-200"
            }`}
            onClick={() => sendAnswer("B")}
          >
            B: {question.B}
          </button>
          <button
            className={`p-4 cursor-pointer ${
              selected === "C" ? "bg-green-300" : "bg-red-300"
            }`}
            onClick={() => sendAnswer("C")}
          >
            C: {question.C}
          </button>
          <button
            className={`p-4 cursor-pointer ${
              selected === "D" ? "bg-green-300" : "bg-red-400"
            }`}
            onClick={() => sendAnswer("D")}
          >
            D: {question.D}
          </button>
        </div>
      )}
    </div>
  );
};

export default InQuestion;
