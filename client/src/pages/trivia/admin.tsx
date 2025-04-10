import { useState } from "react";
import EnterCode from "../../components/trivia/admin/EnterCode";
import StartGame from "../../components/trivia/admin/StartGame";
import InGame from "../../components/trivia/admin/InGame";

const TriviaAdmin = () => {
  const [enteredCorrectCode, setEnteredCorrectCode] = useState(false);
  const confirmCode = (code: number) => {
    if (code != 1738) {
      return;
    }
    setEnteredCorrectCode(true);
  };

  const [inGame, setInGame] = useState(false);
  const [topic, setTopic] = useState("");
  const startNewGame = async (topic: string) => {
    if (!topic) {
      return;
    }
    setInGame(true);
    setTopic(topic);
  };

  return (
    <>
      {enteredCorrectCode ? (
        inGame ? (
          <InGame topic={topic}></InGame>
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
