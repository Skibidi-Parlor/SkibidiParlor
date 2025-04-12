import { useEffect, useState } from "react";
import { socket } from "../../socket";
import { type QuestionModel } from "../../../../shared/src/models";

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
        <div className="bg-[#FAEBD7] min-w-screen h-fill h-[95vh] flex flex-col items-center ">
          <h1 className="text-7xl font-bold text-center mt-[2rem]">
            Trivia Screen
          </h1>
          {questionInProgress ? (
            <div>
              <h1>Question: {question?.question}</h1>
              <div className="grid grid-cols-2 gap-4 w-full">
                <h4 className="bg-white w-[40vw] h-[20vw]">A: {question?.A}</h4>
                <h4 className="bg-white w-[40vw] h-[20vw]">B: {question?.B}</h4>
                <h4 className="bg-white w-[40vw] h-[20vw]">C: {question?.C}</h4>
                <h4 className="bg-white w-[40vw] h-[20vw]">D: {question?.D}</h4>
              </div>
            </div>
          ) : (
            <div>No Question In Progress</div>
          )}
        </div>
      ) : (
        <div className="bg-[#FAEBD7] min-w-screen h-fill h-[95vh] flex flex-col items-center ">
          <h1 className="text-7xl font-bold text-center mt-[2rem]">
            No Game Going on ATM
          </h1>
        </div>
      )}
    </>
  );
};

export default TriviaScreen;
