import { useEffect, useState } from "react";
import { socket } from "../../socket";
// import {
//   LeaderboardModel,
//   type QuestionModel,
// } from "../../../../shared/src/models";
import { LeaderboardModel, QuestionModel } from "../../../shared/src/models";
import { faBrain, faLightbulb } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

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
      if (data.response === "In Question") {
        setQuestionInProgress(true);
        setQuestion(data.data);
      } else if (data.response === "No Question") {
        setQuestionInProgress(false);
        setRoundLeaderboard(data.roundLeaderboard);
        setOverallLeaderboard(data.overallLeaderboard);
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
        <div className="bg-[#FCE9C9] min-w-screen h-fill h-screen max-h-screen flex flex-col items-center border-15 border-[#B24B0C] border-double">
          {questionInProgress ? (
            <div className="flex flex-col items-center gap-8">
              <h1 className="text-5xl text-center text-[#4A2006] font-bold mt-3">
                Question: {question?.question}
              </h1>
              <h2 className="text-center h-[10vh] w-[10vh] bg-[#FCE9C9] rounded-full border border-[#4A2006] flex items-center justify-center text-3xl text-[#4A2006]">
                {numberCompleted}
              </h2>
              <div className="flex flex-col lg:grid lg:grid-cols-2 gap-3">
                <div className="flex justify-center items-center bg-[#D96F1D] p-4 lg:ml-2">
                  <h4 className="text-center text-5xl text-[#FCE9C9]">
                    A: {question?.A}
                  </h4>
                </div>
                <div className="flex justify-center items-center bg-[#D96F1D] p-4 lg:mr-2">
                  <h4 className="text-center text-5xl text-[#FCE9C9]">
                    B: {question?.B}
                  </h4>
                </div>
                <div className="flex justify-center items-center bg-[#D96F1D] p-4 lg:ml-2">
                  <h4 className="text-center text-5xl text-[#FCE9C9]">
                    C: {question?.C}
                  </h4>
                </div>
                <div className="flex justify-center items-center bg-[#D96F1D] p-4 lg:mr-2">
                  <h4 className="text-center text-5xl text-[#FCE9C9]">
                    D: {question?.D}
                  </h4>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-8">
              <h1 className="text-xl lg:text-7xl text-center text-[#4A2006] font-bold mt-3">
                Trivia Night
              </h1>
              <div className="flex justify-evenly gap-8">
                {roundLeaderboard && (
                  <div className="bg-white border-3 border-[#D96F1D] h-[75vh] w-[40vw] rounded-2xl">
                    <h1 className="text-sm lg:text-6xl text-[#D96F1D] text-center">
                      Round Leaderboard
                    </h1>
                    {Object.entries(roundLeaderboard).map(
                      ([key, value], index) => (
                        <div
                          className="text-center text-xs lg:text-4xl"
                          key={key}
                        >
                          {index + 1}. {key}: {value}
                        </div>
                      )
                    )}
                  </div>
                )}
                {overallLeaderboard && (
                  <div className="bg-white border-3 border-[#D96F1D] h-[75vh] w-[40vw] rounded-2xl">
                    <h1 className="text-sm lg:text-6xl text-[#D96F1D] text-center">
                      Session Leaderboard
                    </h1>
                    {Object.entries(overallLeaderboard).map(
                      ([key, value], index) => (
                        <div
                          key={key}
                          className={`text-center text-xs lg:text-4xl ${
                            key in roundLeaderboard!
                              ? "text-green-400"
                              : "text-red-400"
                          }`}
                        >
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
        <div className="bg-[#FCE9C9] min-w-screen h-fill h-screen max-h-screen flex flex-col items-center border-15 border-[#B24B0C] border-double gap-10">
          <h1 className="text-5xl lg:text-9xl font-bold text-center text-[#B24B0C] mt-8">
            Trivia Night!
          </h1>
          <h2 className="text-lg lg:text-7xl text-center text-[#B24B0C]">
            Everyday from 9:00Pm-10:00Pm
          </h2>
          <div className="flex">
            <FontAwesomeIcon
              icon={faBrain}
              className="text-5xl lg:text-9xl text-center text-[#B24B0C]"
            />
            <FontAwesomeIcon
              icon={faLightbulb}
              className="text-5xl lg:text-9xl text-center text-[#B24B0C]"
            />
          </div>
        </div>
      )}
    </>
  );
};

export default TriviaScreen;
