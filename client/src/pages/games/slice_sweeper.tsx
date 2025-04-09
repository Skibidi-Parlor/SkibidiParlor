import { useState } from "react";

import { faQuestionCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import Button from "../../components/games/slice_sweeper/Button";
import LoadingGrid from "../../components/games/slice_sweeper/LoadingGrid";
import Grid from "../../components/games/slice_sweeper/Grid";
import Wallet from "../../components/games/slice_sweeper/Wallet";

import { shuffle } from "../../helpers/shuffle";

import "../../styles/pages/games/slice_sweeper.css";
import { toDollarString } from "../../helpers/toDollarString";
import Modal from "../../components/ui/Modal";

const SliceSweeper = () => {
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
  const newGame = () => {
    if (balance < 1) {
      setNoMoneyModal(true);
      return;
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
      backgroundAudio.play();
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

  const cashOut = () => {
    cashoutAudio.play();
    setBalance((prev) => prev + currentMultiplier);
    setCurrentMultiplier(0);
    setFoundBomb(true); //Used to End Game
  };

  const startGameAudio = new Audio("/games/SliceSweeper/start.mp3");
  const backgroundAudio = new Audio("/games/SliceSweeper/background.mp3");
  const cashoutAudio = new Audio("/games/SliceSweeper/cashout.mp3");
  backgroundAudio.loop = true;
  backgroundAudio.volume = 0.7;

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
  const [noMoneyModal, setNoMoneyModal] = useState(false);
  const [transactionModal, setTransactionModal] = useState(false);

  return (
    <>
      {inGame ? (
        <div className="flex flex-col w-full h-full min-h-[100vh] bg-[#3D1C77]">
          <Button title="← Back to Menu" className="text-xs mt-5" />

          <div className="flex text-4xl text-white mx-auto mt-6 gap-3">
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
              >
                {currentMultiplier}x{` (${toDollarString(currentMultiplier)})`}
              </span>
            </h2>
            <Wallet
              balance={balance}
              onClick={() => {
                setTransactionModal(true);
              }}
            />
          </div>

          <span className="text-red-500 text-center mt-5">
            Make Sure to Avoide the <u>3 Bombs</u> in the grid!
          </span>

          <Grid
            graph={graph}
            key={gameId}
            checkIfBomb={checkIfBomb}
            foundBomb={foundBomb}
            setCurrentMultiplier={setCurrentMultiplier}
          />

          <div className="mx-auto my-5">
            <Button
              title={`${
                foundBomb
                  ? "Try Again ($1)"
                  : `Cash Out ${toDollarString(currentMultiplier)}`
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
        </div>
      ) : (
        <div className="flex flex-col w-full h-full min-h-[100vh] bg-[#3D1C77]">
          <Button title="← Back to Menu" className="text-xs mt-5" />

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
            <Wallet
              balance={balance}
              onClick={() => {
                setTransactionModal(true);
              }}
            />{" "}
          </div>

          <LoadingGrid />
          <div className="mx-auto my-6">
            <Button
              title={`Play Now ($1)`}
              className="text-3xl text-white animate-gradient bg-clip-text transition-all duration-500 px-6 py-3 rounded-lg"
              onClick={newGame}
            />
          </div>
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
              - Slice Sweeper! A game where you can earn <b>real money</b> by
              collecting pizza slices and avoiding bombs!
            </li>
            <li className="mx-3 my-auto">
              - Games cost $1 but each pizza you collect will earn you 20¢
            </li>
            <li className="mx-3 my-auto">
              - Be Careful Though! If you click on a bomb, all of your
              accumulative earnings go away for that game.
            </li>
            <li className="mx-3 my-auto">
              - There are <b>3 Bombs</b>, and you can <b>cashout any time</b> so
              play carefully!
            </li>
            <li>- Good Luck!</li>
          </ul>
        </Modal>
      )}
      {noMoneyModal && (
        <Modal
          isOpen={noMoneyModal}
          onClose={() => {
            setNoMoneyModal(false);
          }}
        >
          <div className="flex flex-col">
            <h1 className="text-center underline text-3xl text-red-500">
              Insufficient Funds
            </h1>
            <h2 className="text-center">
              Current Balance: {toDollarString(balance)}
            </h2>
            <div className="flex flex-col mx-auto">
              <Button
                title="Deposit Money"
                className="text-3xl text-white animate-green-gradient bg-clip-text transition-all duration-500 px-6 py-3 rounded-lg"
              />
              <Button
                title="Withdraw Money"
                className="text-3xl text-white animate-red-gradient bg-clip-text transition-all duration-500 px-6 py-3 rounded-lg"
              />
            </div>
          </div>
        </Modal>
      )}
      {transactionModal && (
        <Modal
          isOpen={transactionModal}
          onClose={() => {
            setTransactionModal(false);
          }}
        >
          <div className="flex flex-col">
            <h1 className="text-center underline text-3xl">
              Current Balance: {toDollarString(balance)}
            </h1>
            <div className="flex flex-col mx-auto">
              <Button
                title="Deposit Money"
                className="text-3xl text-white animate-green-gradient bg-clip-text transition-all duration-500 px-6 py-3 rounded-lg"
              />
              <Button
                title="Withdraw Money"
                className="text-3xl text-white animate-red-gradient bg-clip-text transition-all duration-500 px-6 py-3 rounded-lg"
              />
            </div>
          </div>
        </Modal>
      )}
    </>
  );
};

export default SliceSweeper;
