import { useEffect, useState } from "react";
import { socket } from "../../socket"; // assumes socket is already connected in this module
import {
  LeaderboardModel,
  type QuestionModel,
} from "../../../shared/src/models";
import InQuestion from "../../components/trivia/player/InQuestion";
import NoQuestion from "../../components/trivia/player/NoQuestion";
import { Link } from "react-router-dom";
import {
  faBrain,
  faFaceFrown,
  faLightbulb,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ShouldBeLoggedIn from "../../helpers/ShouldBeLoggedIn";

const TriviaPlayer = () => {
  ShouldBeLoggedIn(true);

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
        setUsers(data.users ? data.users : []);
        if (data.users.includes(localStorage.getItem("nickname")!)) {
          setUserIsPartOfGame(true);
        } else {
          setUserIsPartOfGame(false);
        }
      }
    };

    const handleIncomingQuestions = (data: {
      response: "In Question" | "No Question";
      data: QuestionModel;
      roundLeaderboard: LeaderboardModel;
      overallLeaderboard: LeaderboardModel;
    }) => {
      if (data.response === "In Question") {
        setQuestionInProgress(true);
        setQuestion(data.data);
      } else if (data.response === "No Question") {
        setQuestionInProgress(false);
        setQuestion(data.data);
        setRoundLeaderboard(data.roundLeaderboard);
        setOverallLeaderboard(data.overallLeaderboard);
      } else if (data.response === "setQuestion") {
        setQuestionInProgress(true);
        setQuestion(data.data);
      } else if (data.response === "closeQuestion") {
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
        <div className="bg-[#FCE9C9] h-screen flex flex-col items-center border-15 border-[#B24B0C] border-double gap-10">
          {!questionInProgress && (
            <Link
              to="/games"
              className="mr-auto mt-3 ml-3 bg-[#B24B0C] p-2 rounded-3xl text-[#FCE9C9]"
            >
              ← Back to Menu
            </Link>
          )}

          {userIsPartOfGame ? (
            questionInProgress && question ? (
              <InQuestion question={question} />
            ) : (
              <NoQuestion
                overallLeaderboard={overallLeaderboard}
                roundLeaderboard={roundLeaderboard}
                question={question}
              />
            )
          ) : (
            <div className="flex flex-col">
              <div className="text-5xl lg:text-9xl text-center text-[#B24B0C]">
                Sorry the game has already started, please join the next one
              </div>
              <FontAwesomeIcon
                icon={faFaceFrown}
                className="text-8xl text-center text-[#B24B0C] mt-5"
              />
            </div>
          )}
        </div>
      ) : (
        <div className="bg-[#FCE9C9] h-screen flex flex-col items-center border-15 border-[#B24B0C] border-double text-[#B24B0C]">
          <Link
            to="/games"
            className="mr-auto mt-3 ml-3 bg-[#B24B0C] p-2 rounded-3xl text-[#FCE9C9]"
          >
            ← Back to Menu
          </Link>
          <h1 className="text-6xl font-bold text-center mt-20">
            Trivia Night!
          </h1>
          <div className="flex mt-5">
            <FontAwesomeIcon
              icon={faBrain}
              className="text-5xl lg:text-9xl text-center text-[#B24B0C]"
            />
            <FontAwesomeIcon
              icon={faLightbulb}
              className="text-5xl lg:text-9xl text-center text-[#B24B0C]"
            />
          </div>
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
          {users.map((user, key) => (
            <div key={key} className="text-xs">
              {user}
            </div>
          ))}
        </div>
      )}
    </>
  );
};

export default TriviaPlayer;
