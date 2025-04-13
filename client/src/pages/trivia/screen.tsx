import { useEffect, useState } from "react";
import { socket } from "../../socket";
import {
  LeaderboardModel,
  type QuestionModel,
} from "../../../../shared/src/models";

const TriviaScreen = () => {
  const [inGame, setInGame] = useState(false);
  const [question, setQuestion] = useState<QuestionModel | undefined>(
    undefined
  );
  const [numberCompleted, setNumberCompleted] = useState<string>("...loading");
  const [questionInProgress, setQuestionInProgress] = useState(false);

  const [overallLeaderboard, setOverallLeaderboard] = useState<
    LeaderboardModel | undefined
  >(undefined);

  const [roundLeaderboard, setRoundLeaderboard] = useState<
    LeaderboardModel | undefined
  >(undefined);

  useEffect(() => {
    socket.emit("trivia-status", { req: "checkGameStatus" });
    socket.emit("trivia-questions", { req: "checkQuestionState" });
    socket.emit("trivia-questions", { req: "checkTriviaReceived" });

    const handleStatus = (data: { response: "No Game" | "In Game" }) => {
      if (data.response === "In Game") {
        setInGame(true);
      } else {
        setInGame(false);
      }
    };

    const handleIncomingQuestions = (data: {
      response: "In Question" | "No Question";
      data: QuestionModel;
      received: string;
      roundLeaderboard: LeaderboardModel;
      overallLeaderboard: LeaderboardModel;
    }) => {
      console.log(data);
      if (data.response === "In Question") {
        setQuestionInProgress(true);
        setQuestion(data.data);
      } else if (data.response === "No Question") {
        console.log("heu");
        setQuestionInProgress(false);
        setQuestion(data.data);
      } else if (data.response === "setQuestion") {
        setQuestionInProgress(true);
        setQuestion(data.data);
      } else if (data.response === "closeQuestion") {
        setQuestionInProgress(false);
        setRoundLeaderboard(data.roundLeaderboard);
        setOverallLeaderboard(data.overallLeaderboard);
      } else if (data.response === "checkTriviaReceived") {
        setNumberCompleted(data.received);
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
        <div className="bg-[#FAEBD7] min-w-screen h-fill h-screen flex flex-col items-center ">
          {questionInProgress ? (
            <div>
              <h1 className="text-3xl text-center">
                Question: {question?.question}
              </h1>
              <h2 className="text-center">{numberCompleted}</h2>
              <div className="grid grid-cols-2 gap-4 w-full">
                <h4 className="bg-white w-[40vw] h-[20vw]">A: {question?.A}</h4>
                <h4 className="bg-white w-[40vw] h-[20vw]">B: {question?.B}</h4>
                <h4 className="bg-white w-[40vw] h-[20vw]">C: {question?.C}</h4>
                <h4 className="bg-white w-[40vw] h-[20vw]">D: {question?.D}</h4>
              </div>
            </div>
          ) : (
            <div className="flex flex-col">
              <h1 className="text-3xl text-center">Trivia Night!!</h1>
              <div className="flex flex-col">
                {roundLeaderboard && (
                  <div className="bg-white p-4">
                    <h1>Round Leaderboard:</h1>
                    {Object.entries(roundLeaderboard).map(
                      ([key, value], index) => (
                        <div key={key}>
                          {index + 1}. {key}: {value}
                        </div>
                      )
                    )}
                  </div>
                )}
                {overallLeaderboard && (
                  <div className="bg-white p-4">
                    <h1>Session Leaderboard:</h1>
                    {Object.entries(overallLeaderboard).map(
                      ([key, value], index) => (
                        <div key={key}>
                          {index + 1}. {key}: {value}
                        </div>
                      )
                    )}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="bg-[#FAEBD7] min-w-screen h-fill h-screen flex flex-col items-center ">
          <h1 className="text-7xl font-bold text-center mt-[2rem]">
            No Game Going on ATM
          </h1>
        </div>
      )}
    </>
  );
};

export default TriviaScreen;
