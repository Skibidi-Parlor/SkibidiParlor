import { useEffect, useState } from "react";
import StartGame from "../../components/trivia/admin/StartGame";
import InGame from "../../components/trivia/admin/InGame";
import { socket } from "../../socket";
import ShouldBeLoggedIn from "../../helpers/ShouldBeLoggedIn";
import { LeaderboardModel } from "../../../shared/src/models";
import { useNavigate } from "react-router-dom";

const TriviaAdmin = () => {
  const navigate = useNavigate();
  ShouldBeLoggedIn(true);

  if (!localStorage.getItem("isAdmin")) {
    navigate("/");
  }

  const [inGame, setInGame] = useState(false);
  const [users, setUsers] = useState<string[]>([]);

  const startNewGame = async () => {
    socket.emit("trivia-status", { req: "setInGame" });
    setInGame(true);
  };

  const endGame = () => {
    if (!inGame) {
      return;
    }
    setInGame(false);
    setUsers([]);
    socket.emit("trivia-status", { req: "setNoGame" });
  };

  useEffect(() => {
    socket.emit("trivia-status", { req: "checkGameStatus" });
    socket.emit("trivia-room", { req: "checkRoomUsers" });

    const handleStatus = (data: {
      response: "No Game" | "In Game";
      overallLeaderboard: LeaderboardModel;
    }) => {
      console.log(data);
      if (data.response === "In Game") {
        setInGame(true);
      } else if (data.response === "No Game") {
        setInGame(false);
        console.log("hi");
        if (data.overallLeaderboard) {
          console.log(data.overallLeaderboard);
        }
      } else {
        setInGame(false);
      }
    };

    const handleRoom = (data: { response: string; users: string[] }) => {
      setUsers(data.users as string[]);
    };

    socket.on("trivia-status", handleStatus);
    socket.on("trivia-room", handleRoom);

    return () => {
      socket.off("trivia-status", handleStatus);
      socket.off("trivia-room", handleRoom);
    };
  }, []);

  return (
    <>
      {inGame ? (
        <InGame endGame={endGame} users={users}></InGame>
      ) : (
        <StartGame startNewGame={startNewGame} users={users} />
      )}
    </>
  );
};

export default TriviaAdmin;
