import { useEffect, useState } from "react";
import { type QuestionModel } from "../../../../shared/src/models";
import { socket } from "../../../socket";

interface Params {
  question: QuestionModel;
}
const InQuestion = ({ question }: Params) => {
  const [recieved, setRecieved] = useState<string>("...loading");
  const [alreadyAnswered, setAlreadyAnswered] = useState(false);

  const sendAnswer = (letter: "A" | "B" | "C" | "D") => {
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
      if (data.response === "checkTriviaReceived") {
        setRecieved(data.received);

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
    <div className="bg-[#FCE9C9] min-w-screen h-fill h-screen max-h-screen flex flex-col items-center border-15 border-[#B24B0C] border-double">
      {" "}
      <h2>{recieved}</h2>
      {alreadyAnswered ? (
        <div className="flex flex-col">
          <div className="text-7xl text-center text-[#4A2006]">
            Answer Submitted!{" "}
          </div>
          <img src="/trivia/Hourglass.webp"></img>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-8">
          <h1 className="text-3xl text-center text-[#4A2006] font-bold mt-3">
            Question: {question?.question}
          </h1>

          <div className="flex flex-col lg:grid lg:grid-cols-2 gap-3">
            <div className="flex justify-center items-center bg-[#D96F1D] p-4 lg:ml-2">
              <h4
                className="text-center text-2xl text-[#FCE9C9]"
                onClick={() => {
                  sendAnswer("A");
                }}
              >
                A: {question?.A}
              </h4>
            </div>
            <div className="flex justify-center items-center bg-[#D96F1D] p-4 lg:mr-2">
              <h4
                className="text-center text-2xl text-[#FCE9C9]"
                onClick={() => {
                  sendAnswer("B");
                }}
              >
                B: {question?.B}
              </h4>
            </div>
            <div className="flex justify-center items-center bg-[#D96F1D] p-4 lg:ml-2">
              <h4
                className="text-center text-2xl text-[#FCE9C9]"
                onClick={() => {
                  sendAnswer("C");
                }}
              >
                C: {question?.C}
              </h4>
            </div>
            <div className="flex justify-center items-center bg-[#D96F1D] p-4 lg:mr-2">
              <h4
                className="text-center text-2xl text-[#FCE9C9]"
                onClick={() => {
                  sendAnswer("D");
                }}
              >
                D: {question?.D}
              </h4>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InQuestion;
