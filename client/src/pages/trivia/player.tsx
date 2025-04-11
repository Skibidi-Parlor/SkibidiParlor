import { useEffect, useState } from "react";
import { socket } from "../../socket"; // assumes socket is already connected in this module

const TriviaPlayer = () => {
  const [inGame, setInGame] = useState<boolean>(false);
  const [hasJoined, setHasJoined] = useState(false);
  const [users, setUsers] = useState<string[]>([]);

  useEffect(() => {
    socket.emit("trivia-status", { req: "checkGameStatus" });
    socket.emit("trivia-room", { req: "checkRoomUsers" });

    const handleStatus = (data: { response: "No Game" | "In Game" }) => {
      if (data.response === "In Game") setInGame(true);
      else setInGame(false);
    };

    const handleRoom = (data: { response: string[] }) => {
      setUsers(data.response as string[]);
    };

    socket.on("trivia-status", handleStatus);

    socket.on("trivia-room", handleRoom);

    return () => {
      socket.off("trivia-status", handleStatus);
      socket.off("trivia-room", handleRoom);
    };
  }, []);

  const join = () => {
    socket.emit("trivia-room", { req: "joined" });
    setHasJoined(true);
  };

  const leave = () => {
    socket.emit("trivia-room", { req: "left" });
    setHasJoined(false);
  };

  return (
    <>
      {inGame ? (
        <div className="bg-[#B9C0DA] min-w-screen h-fill h-[95vh] flex flex-col items-center ">
          <h1 className="text-6xl font-bold text-center mt-[2rem]">
            Game in Progress
          </h1>
        </div>
      ) : (
        <div className="bg-[#B9C0DA] min-w-screen h-fill h-[95vh] flex flex-col items-center ">
          <h1 className="text-6xl font-bold text-center mt-[2rem]">
            Trivia Night!
          </h1>
          <h1 className="text-xl font-bold text-center mt-[2rem]">
            A game hasn't started yet. You can press "Get Ready!" if a game is
            starting soon.
          </h1>
          <button
            className={`w-1/2 text-white py-2 rounded-lg text-lg font-semibold transition mt-10 ${
              hasJoined
                ? "bg-[#FCCA46] hover:bg-[#EBBA45]"
                : "bg-green-300 hover:bg-green-200]"
            }`}
            onClick={hasJoined ? leave : join}
          >
            {hasJoined ? "Changed My Mind" : "Get Ready!"}
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
