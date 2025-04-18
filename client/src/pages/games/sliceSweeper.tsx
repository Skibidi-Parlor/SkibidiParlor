import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { faQuestionCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import Button from "../../components/games/slice_sweeper/Button";
import LoadingGrid from "../../components/games/slice_sweeper/LoadingGrid";
import Grid from "../../components/games/slice_sweeper/Grid";

import { shuffle } from "../../helpers/shuffle";

import "../../styles/pages/games/slice_sweeper.css";

import Modal from "../../components/ui/Modal";
import ShouldBeLoggedIn from "../../helpers/ShouldBeLoggedIn";
import { trpc } from "../../api";
import { socket } from "../../socket";

const SliceSweeper = () => {
  ShouldBeLoggedIn(true);
  const navigate = useNavigate();

  const userID = Number(localStorage.getItem("userID")) as unknown as number;
  const [allTimeScore, setAllTimeScore] = useState<number>(0);

  useEffect(() => {
    socket.emit("user-score-update-from-backend", {
      response: "Success",
      userID: userID,
    });
    const handleUpdate = async (data: { response: string; userID: number }) => {
      if (data.userID != userID) {
        return;
      }
      if (data.response === "Success" && data.userID === userID) {
        const res = await trpc.user.totalPoints.query(userID);
        setAllTimeScore(res.total_points);
      } else if (data.response === "Fail") {
        throw new Error("Failed to fetch");
      }
    };

    socket.on("user-score-update-from-server", handleUpdate);
    return () => {
      socket.off("user-score-update-from-server", handleUpdate);
    };
  }, []);

  const generateGraph = () => {
    const initialGraph = [] as ("Pizza" | "Bomb")[];
    for (let i = 0; i < 25; i++) {
      if (i < 23) {
        initialGraph.push("Pizza");
      } else {
        initialGraph.push("Bomb");
      }
    }
    return shuffle(initialGraph);
  };
  const newGame = async () => {
    if (allTimeScore < 10) {
      setNoPointsModal(true);
      return;
    }
    setAllTimeScore((prev) => (prev -= 10));
    try {
      const newScoreID = await trpc.leaderboard.saveScore.mutate({
        user_id: Number(localStorage.getItem("userID")),
        game_id: 2,
        points: -10,
      });
      console.log("created new score record; new score ID: " + newScoreID);
    } catch (error) {
      console.log("unable to create new user: ", error);
    }

    const initialGraph = generateGraph();

    const shuffledGraph = shuffle(initialGraph);
    const newBalance = balance - 1;
    setGraph(shuffledGraph);
    setGameId((prev) => prev + 1);
    setBalance(newBalance);
    setInGame(true);
    setFoundBomb(false);

    startGameAudio.play();
    if (!hasBackgroundAudio) {
      setHasBackgroundAudio(true);
    }
  };

  const checkIfBomb = (value: "Bomb" | "Pizza") => {
    if (value === "Bomb") {
      setFoundBomb(true);
      setCurrentMultiplier(0.0);
      return true;
    }

    return false;
  };

  const cashOut = async () => {
    setAllTimeScore((prev) => prev + currentMultiplier);
    cashoutAudio.play();
    setBalance((prev) => prev + currentMultiplier);
    try {
      const newScoreID = await trpc.leaderboard.saveScore.mutate({
        user_id: Number(localStorage.getItem("userID")),
        game_id: 2,
        points: currentMultiplier,
      });
      console.log("created new score record; new score ID: " + newScoreID);
    } catch (error) {
      console.log("unable to create new user: ", error);
    }
    setCurrentMultiplier(0);
    setFoundBomb(true); //Used to End Game
  };

  const startGameAudio = new Audio("/games/SliceSweeper/start.mp3");
  const cashoutAudio = new Audio("/games/SliceSweeper/cashout.mp3");

  const [hasBackgroundAudio, setHasBackgroundAudio] = useState(false);
  const [graph, setGraph] = useState<("Bomb" | "Pizza")[]>(generateGraph);
  const [gameId, setGameId] = useState(0); //Used for grid rerender issues
  const [balance, setBalance] = useState<number>(10.0);
  const [inGame, setInGame] = useState(false);

  //Used During Game
  const [foundBomb, setFoundBomb] = useState(false);
  const [currentMultiplier, setCurrentMultiplier] = useState(0.0);

  //Modals
  const [showFAQModal, setShowFAQModal] = useState(true);
  const [noPointsModal, setNoPointsModal] = useState(false);

  return (
    <>
      {inGame ? (
        <div className="flex flex-col w-full h-full min-h-[100vh] bg-[#3D1C77]">
          <Button
            title="← Back to Menu"
            className="text-xs mt-8 bg-white"
            onClick={() => navigate("/games")}
          />
          <div className="flex text-4xl text-white mx-auto mt-10 gap-3">
            <h1>Slice Sweeper</h1>{" "}
            <FontAwesomeIcon
              icon={faQuestionCircle}
              className="my-auto"
              onClick={() => {
                setShowFAQModal(true);
              }}
            />
          </div>

          <div className="flex mx-auto mt-5 gap-10">
            <h2 className="text-white my-auto">
              Current Multiplier:{" "}
              <span
                className={`ml-2 ${
                  currentMultiplier >= 1 ? "text-green-500" : "text-red-500"
                }`}
              ></span>
            </h2>
          </div>

          <span className="text-red-500 text-center mt-5">
            Make Sure to Avoid the <u>2 Bombs</u> in the grid!
          </span>

          <Grid
            graph={graph}
            key={gameId}
            checkIfBomb={checkIfBomb}
            foundBomb={foundBomb}
            setCurrentMultiplier={setCurrentMultiplier}
          />

          <div className="mx-auto my-2">
            <Button
              title={`${
                foundBomb
                  ? "Try Again (10 Points)"
                  : `Cash Out ${currentMultiplier}`
              }`}
              className={`text-3xl text-white ${
                foundBomb
                  ? "animate-gradient"
                  : currentMultiplier >= 1
                  ? "animate-green-gradient"
                  : "animate-red-gradient"
              } bg-clip-text transition-all duration-500 px-6 py-3 rounded-lg`}
              onClick={
                foundBomb
                  ? newGame
                  : currentMultiplier != 0
                  ? cashOut
                  : () => {}
              }
            />
          </div>
          {allTimeScore && (
            <h2 className="text-white text-center mt-3">
              Your points: {allTimeScore}
            </h2>
          )}
        </div>
      ) : (
        <div className="flex flex-col w-full h-full min-h-[100vh] bg-[#3D1C77]">
          <Button
            title="← Back to Menu"
            className="text-xs mt-12 bg-white"
            onClick={() => navigate("/games")}
          />
          <div className="flex text-4xl text-white mx-auto mt-10 gap-3">
            <h1>Slice Sweeper</h1>
          </div>
          <div className="flex mx-auto mt-5 gap-10">
            <h2
              className="text-white my-auto underline"
              onClick={() => {
                setShowFAQModal(true);
              }}
            >
              How To Play
            </h2>
          </div>
          <LoadingGrid />
          <div className="mx-auto mt-6">
            <Button
              title={`Play Now (10 Points)`}
              className="text-3xl text-white animate-gradient bg-clip-text transition-all duration-500 px-6 py-3 rounded-lg"
              onClick={newGame}
            />
          </div>
          {allTimeScore && (
            <h2 className="text-white text-center mt-3">
              Your points: {allTimeScore}
            </h2>
          )}
        </div>
      )}
      {showFAQModal && (
        <Modal
          isOpen={showFAQModal}
          onClose={() => {
            setShowFAQModal(false);
          }}
        >
          <h1 className="text-center underline text-3xl">How To Play</h1>
          <ul>
            <li className="mx-3 my-auto">
              - Slice Sweeper! A game where you can wager points by collecting
              pizza slices and avoiding bombs!
            </li>
            <li className="mx-3 my-auto">
              - Games cost 10 points to play, with the chance of earning up to
              46 points!
            </li>
            <li className="mx-3 my-auto">
              - Be Careful Though! If you click on a bomb, all of your
              accumulative earnings go away for that game.
            </li>
            <li className="mx-3 my-auto">
              - There are <b>2 Bombs</b>, and you can <b>cashout any time</b> so
              play carefully!
            </li>
            <li>- Good Luck!</li>
          </ul>
        </Modal>
      )}
      {noPointsModal && allTimeScore && (
        <Modal
          isOpen={noPointsModal}
          onClose={() => {
            setNoPointsModal(false);
          }}
        >
          <div className="flex flex-col items-center">
            <h1 className="text-center underline text-3xl text-red-500">
              Out of Points {":("}
            </h1>
            <h2 className="text-center text-xl text-red-500">
              Need <b>{10 - allTimeScore} </b>more points to play
            </h2>
            <Button
              title={`Play Other Games`}
              className="text-3xl text-white animate-gradient bg-clip-text transition-all duration-500 px-6 py-3 rounded-lg"
              onClick={() => {
                navigate("/games");
              }}
            />
          </div>
        </Modal>
      )}
    </>
  );
};

export default SliceSweeper;
