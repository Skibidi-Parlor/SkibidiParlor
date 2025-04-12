import { useEffect, useState } from "react";
import StartGame from "../../components/trivia/admin/StartGame";
import InGame from "../../components/trivia/admin/InGame";
import { socket } from "../../socket";

const TriviaAdmin = () => {
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
    socket.emit("trivia-status", { req: "checkGameStatus" });

    const handleStatus = (data: { response: "No Game" | "In Game" }) => {
      if (data.response === "In Game") {
        setInGame(true);
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
