import { useEffect, useState } from "react";
import { socket } from "../../socket"; // assumes socket is already connected in this module
import {
  LeaderboardModel,
  type QuestionModel,
} from "../../../../shared/src/models";
import InQuestion from "../../components/trivia/player/InQuestion";
import NoQuestion from "../../components/trivia/player/NoQuestion";

const TriviaPlayer = () => {
  const [inGame, setInGame] = useState<boolean>(false);
  const [userIsPartOfGame, setUserIsPartOfGame] = useState(false);
  const [question, setQuestion] = useState<QuestionModel | undefined>(
    undefined
  );
  const [questionInProgress, setQuestionInProgress] = useState(false);
  const [users, setUsers] = useState<string[]>([]);

  const [overallLeaderboard, setOverallLeaderboard] = useState<
    LeaderboardModel | undefined
  >(undefined);

  const [roundLeaderboard, setRoundLeaderboard] = useState<
    LeaderboardModel | undefined
  >(undefined);

  useEffect(() => {
    socket.emit("trivia-status", { req: "checkGameStatus" });
    socket.emit("trivia-room", { req: "checkRoomUsers" });
    socket.emit("trivia-questions", { req: "checkQuestionState" });

    const handleStatus = (data: {
      response: "No Game" | "In Game";
      users: string[];
    }) => {
      if (data.response === "In Game") {
        setInGame(true);
      } else {
        setInGame(false);
        socket.emit("trivia-room", {
          req: "left",
          user: localStorage.getItem("nickname"),
        });
        if (data.users) {
          setUsers(data.users);
        }
      }
    };

    const handleIncomingQuestions = (data: {
      response: "In Question" | "No Question";
      data: QuestionModel;
      roundLeaderboard: LeaderboardModel;
      overallLeaderboard: LeaderboardModel;
    }) => {
      console.log(data);
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
        console.log(data);
        setQuestionInProgress(false);
        setRoundLeaderboard(data.roundLeaderboard);
        setOverallLeaderboard(data.overallLeaderboard);
      }
    };
    const handleRoom = (data: { response: string; users: string[] }) => {
      if (data.users.includes(localStorage.getItem("nickname")!)) {
        setUserIsPartOfGame(true);
      } else {
        setUserIsPartOfGame(false);
      }
      setUsers(data.users as string[]);
    };

    socket.on("trivia-status", handleStatus);
    socket.on("trivia-room", handleRoom);
    socket.on("trivia-questions", handleIncomingQuestions);

    return () => {
      socket.off("trivia-status", handleStatus);
      socket.off("trivia-room", handleRoom);
      socket.off("trivia-questions", handleIncomingQuestions);
    };
  }, []);

  const join = () => {
    socket.emit("trivia-room", {
      req: "joined",
      user: localStorage.getItem("nickname"),
    });
    setUserIsPartOfGame(true);
  };

  const leave = () => {
    socket.emit("trivia-room", {
      req: "left",
      user: localStorage.getItem("nickname"),
    });
    setUserIsPartOfGame(false);
  };

  return (
    <>
      {inGame ? (
        <div className="bg-[#B9C0DA] min-w-screen h-fill h-screen flex flex-col items-center ">
          {userIsPartOfGame ? (
            questionInProgress && question ? (
              <InQuestion question={question} />
            ) : (
              <NoQuestion
                overallLeaderboard={overallLeaderboard}
                roundLeaderboard={roundLeaderboard}
              />
            )
          ) : (
            <div>
              Sorry the game has already started, please join the next one
            </div>
          )}
        </div>
      ) : (
        <div className="bg-[#B9C0DA] min-w-screen h-fill h-screen flex flex-col items-center ">
          <h1 className="text-6xl font-bold text-center mt-[2rem]">
            Trivia Night!
          </h1>
          <h1 className="text-xl font-bold text-center mt-[2rem]">
            A game hasn't started yet. You can press "Get Ready!" if a game is
            starting soon.
          </h1>
          <button
            className={`w-1/2 text-white py-2 rounded-lg text-lg font-semibold transition mt-10 ${
              userIsPartOfGame
                ? "bg-[#FCCA46] hover:bg-[#EBBA45]"
                : "bg-green-300 hover:bg-green-200]"
            }`}
            onClick={userIsPartOfGame ? leave : join}
          >
            {userIsPartOfGame ? "Changed My Mind" : "Get Ready!"}
          </button>
          <h4>Players awaiting game:</h4>
          {users.map((user) => (
            <div>{user}</div>
          ))}
        </div>
      )}
    </>
  );
};

export default TriviaPlayer;
