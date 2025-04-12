import { useEffect, useState } from "react";
import EnterCode from "../../components/trivia/admin/EnterCode";
import StartGame from "../../components/trivia/admin/StartGame";
import InGame from "../../components/trivia/admin/InGame";
import { socket } from "../../socket";

const TriviaAdmin = () => {
  const [enteredCorrectCode, setEnteredCorrectCode] = useState(false);
  const confirmCode = (code: number) => {
    if (code != 1738) {
      return;
    }
    setEnteredCorrectCode(true);
    if (!inGame) {
      socket.emit("trivia-status", { type: "setInGame" });
    }
  };

  const [inGame, setInGame] = useState(false);
  const [topic, setTopic] = useState("");
  const startNewGame = async (topic: string) => {
    if (!topic) {
      return;
    }
    socket.emit("trivia-status", { type: "setInGame" });
    setInGame(true);
    setTopic(topic);
  };

  const endGame = () => {
    if (!inGame) {
      return;
    }
    setInGame(false);
    socket.emit("trivia-status", { type: "setNoGame" });
  };

  useEffect(() => {
    const handleStatus = (data: {
      response: "Closed" | "Open" | "In Game";
    }) => {
      if (data.response === "In Game") {
        setInGame(true);
      }
    };

    socket.on("trivia-status", handleStatus);

    return () => {
      socket.off("trivia-status", handleStatus);
    };
  }, []);

  return (
    <>
      {enteredCorrectCode ? (
        inGame ? (
          <InGame topic={topic} endGame={endGame}></InGame>
        ) : (
          <StartGame startNewGame={startNewGame} />
        )
      ) : (
        <EnterCode confirmCode={confirmCode} />
      )}
    </>
  );
};

export default TriviaAdmin;
