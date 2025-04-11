import { useEffect, useState } from "react";
import { socket } from "../../socket";

interface QuestionModel {
  question: string;
  A: string;
  B: string;
  C: string;
  D: string;
  answer: string;
}
const TriviaScreen = () => {
  const [inGame, setInGame] = useState(false);
  const [question, setQuestion] = useState<QuestionModel | undefined>(
    undefined
  );
  const [questionInProgress, setQuestionInProgress] = useState(false);

  useEffect(() => {
    socket.emit("trivia-status", { req: "checkGameStatus" });
    socket.emit("trivia-questions", { req: "checkQuestionState" });

    const handleStatus = (data: { response: "No Game" | "In Game" }) => {
      if (data.response === "In Game") setInGame(true);
      else setInGame(false);
    };

    const handleIncomingQuestions = (data: {
      response: "In Question" | "No Question";
      data: QuestionModel;
    }) => {
      console.log(data);
      if (data.response === "In Question") {
        setQuestionInProgress(true);
        setQuestion(data.data);
      } else if (data.response === "No Question") {
        setQuestionInProgress(false);
        setQuestion(data.data);
      } else if (data.response === "setQuestion") {
        console.log("here");
        setQuestionInProgress(true);
        setQuestion(data.data);
      } else if (data.response === "closeQuestion") {
        setQuestionInProgress(false);
      }
    };

    socket.on("trivia-status", handleStatus);
    socket.on("trivia-questions", handleIncomingQuestions);

    return () => {
      socket.off("trivia-status", handleStatus);
      socket.off("trivia-questions", handleIncomingQuestions);
    };
  }, []);

  return (
    <>
      {inGame ? (
        <div className="bg-[#B9C0DA] min-w-screen h-fill h-[95vh] flex flex-col items-center ">
          <h1 className="text-7xl font-bold text-center mt-[2rem]">
            Trivia Screen
          </h1>
          {questionInProgress ? (
            <div>
              {" "}
              <h3>Question: {question?.question}</h3>
              <h4>A: {question?.A}</h4>
              <h4>B: {question?.B}</h4>
              <h4>C: {question?.C} </h4>
              <h4>D: {question?.D}</h4>
              <h4>Correct Answer: {question?.answer}</h4>
            </div>
          ) : (
            <div>No Question In Progress</div>
          )}
        </div>
      ) : (
        <div className="bg-[#B9C0DA] min-w-screen h-fill h-[95vh] flex flex-col items-center ">
          <h1 className="text-7xl font-bold text-center mt-[2rem]">
            No Game Going on ATM
          </h1>
        </div>
      )}
    </>
  );
};

export default TriviaScreen;
