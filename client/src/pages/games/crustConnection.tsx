import "../../styles/pages/games/crust_connection.css";

import Grid from "../../components/games/crust_connection/Grid";
import LoadingGrid from "../../components/games/crust_connection/LoadingGrid";
import Modal from "../../components/ui/Modal";

import { faQuestionCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { trpc } from "../../api";

const CrustConnection = () => {
  const pizza = "../../../games/CrustConnection/pizza.webp";
  const cheese = "../../../games/CrustConnection/Cheese.png";
  const greenPepper = "../../../games/CrustConnection/GreenPepper.png";
  const mushroom = "../../../games/CrustConnection/Mushroom.png";
  const onion = "../../../games/CrustConnection/Onion.png";
  const pepperoni = "../../../games/CrustConnection/Peperoni.png";
  const sausage = "../../../games/CrustConnection/Sausage.png";
  const pineapple = "../../../games/CrustConnection/Pineapple.png";
  const gameWin = new Audio(
    "../../../public/games/CrustConnection/game-win.mp3"
  );
  const gameLose = new Audio(
    "../../../public/games/CrustConnection/game-lose.mp3"
  );
  const tileMatch = new Audio(
    "../../../public/games/CrustConnection/tile-match.mp3"
  );
  const tileNotMatch = new Audio(
    "../../../public/games/CrustConnection/tile-not-match.mp3"
  );

  const navigate = useNavigate();

  const [inGame, setInGame] = useState(false);
  const [showFAQModal, setShowFAQModal] = useState(true);
  const [showJoinGame, setShowJoinGame] = useState(false);
  const [showGameOverScreen, setShowGameOverScreen] = useState(false);
  const [randomGrid, setRandomGrid] = useState<string[]>([]);
  const [flippedTiles, setFlippedTiles] = useState<number[]>([]);
  const [matchedTiles, setMatchedTiles] = useState<number[]>([]);
  const [playerScore, setPlayerScore] = useState(0);
  const [strikes, setStrikes] = useState(5);

  const inputRefs = [
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
  ];

  useEffect(() => {
    if (showJoinGame) {
      inputRefs[0].current?.focus();
    }
  }, [showJoinGame]);

  useEffect(() => {
    if (matchedTiles.length === 16) {
      gameWin.play();
      setShowGameOverScreen(true);
    } else if (strikes === 0) {
      gameLose.play();
      setShowGameOverScreen(true);
    }
  }, [matchedTiles, strikes]);

  const handleInput = (
    index: number,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = e.target.value;

    if (value.length > 1) {
      e.target.value = value.slice(0, 1);
    }

    if (value !== "" && index < inputRefs.length - 1) {
      inputRefs[index + 1].current?.removeAttribute("disabled");
      inputRefs[index + 1].current?.focus();
    }
  };

  const handleKeyUp = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Backspace" && index > 0) {
      e.currentTarget.value = "";
      inputRefs[index].current?.setAttribute("disabled", "true");
      inputRefs[index - 1].current?.focus();
    }
  };

  const playGame = () => {
    setRandomGrid(randomizeGrid());
    setInGame(true);
    setPlayerScore(0);
    setStrikes(5);
    setMatchedTiles([]);
    setFlippedTiles([]);
  };

  const handleFlip = (index: number) => {
    if (flippedTiles.length === 2 || flippedTiles.includes(index)) return;

    const newFlipped = [...flippedTiles, index];
    setFlippedTiles(newFlipped);

    if (newFlipped.length === 2) {
      const [first, second] = newFlipped;

      if (randomGrid[first] === randomGrid[second]) {
        tileMatch.play();
        setMatchedTiles((prev) => [...prev, first, second]);
        setPlayerScore((prev) => prev + 2);
        setTimeout(() => setFlippedTiles([]), 1000);
      } else {
        tileNotMatch.play();
        setStrikes((prev) => prev - 1);
        setTimeout(() => setFlippedTiles([]), 1000);
      }
    }
  };

  const randomizeGrid = () => {
    const images = [
      pizza,
      cheese,
      greenPepper,
      mushroom,
      onion,
      pepperoni,
      sausage,
      pineapple,
    ];
    const makeItDouble = [...images, ...images];

    for (let i = makeItDouble.length - 1; i > 0; i--) {
      const j: number = Math.floor(Math.random() * (i + 1));
      let temp: string = makeItDouble[i];
      makeItDouble[i] = makeItDouble[j];
      makeItDouble[j] = temp;
    }

    return makeItDouble;
  };

  const randomizedList = [
    pineapple,
    pizza,
    greenPepper,
    onion,
    onion,
    cheese,
    mushroom,
    pineapple,
    pepperoni,
    sausage,
    pizza,
    greenPepper,
    cheese,
    sausage,
    pepperoni,
    mushroom,
  ];

  const endGame = async () => {
    try {
      const newScoreID = await trpc.leaderboard.saveScore.mutate({
        user_id: Number(localStorage.getItem("userID")),
        game_id: 1,
        points: playerScore,
      });
      console.log("created new score record; new score ID: " + newScoreID);
    } catch (error) {
      console.log("unable to create new user: ", error);
    }
  };

  return (
    <>
      {!!!inGame ? (
        <div>
          <button
            className="crust-connection-back-button"
            onClick={() => navigate(-1)}
          >
            ← Back to Menu
          </button>
          <div className="crust-connection-container">
            <div className="items-in-container">
              <div className="title-crust-con">
                <h1>Crust Connection</h1>
                <FontAwesomeIcon
                  icon={faQuestionCircle}
                  className="my-auto"
                  onClick={() => {
                    setShowFAQModal(true);
                  }}
                />
              </div>
              <LoadingGrid graph={randomizedList} />
              <div className="option-button">
                <button
                  onClick={() => {
                    playGame();
                  }}
                >
                  Play Game
                </button>
                {/* <button onClick={() => {setShowJoinGame(true)}}>Join Game</button> */}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div>
          <button
            className="crust-connection-back-button"
            onClick={() => navigate(-1)}
          >
            ← Back to Menu
          </button>
          <div className="crust-connection-container">
            <div className="items-in-container">
              <div className="title-crust-con">
                <h1>Match the Tiles!</h1>
              </div>
              <Grid
                graph={randomGrid}
                flippedTiles={flippedTiles}
                matchedTiles={matchedTiles}
                handleFlip={handleFlip}
              />
              <div className="score">
                <h1>Score: {playerScore}</h1>
                <h1>Attempts Left: {strikes}</h1>
              </div>
            </div>
          </div>
        </div>
      )}
      {showJoinGame && (
        <Modal
          isOpen={showJoinGame}
          onClose={() => {
            setShowJoinGame(false);
          }}
        >
          <h1 className="text-center underline text-3xl">Join Game</h1>
          <br />
          <ul>
            <li className="mx-3 my-auto">
              Please enter your friend's game code shown above their screen
              (i.e. 1234)
            </li>
            <br />
            <div className="flex justify-center gap-[0.5rem]">
              <input
                ref={inputRefs[0]}
                onChange={(e) => handleInput(0, e)}
                onKeyUp={(e) => handleKeyUp(0, e)}
                type="number"
                className="border-none max-w-[20%] h-[60px] text-center rounded-[5px] bg-[#adadad] text-[2.5rem] overflow-y-hidden focus:outline focus:outline-[1.5px] focus:outline-[#286D40] focus:outline-offset-2"
              />
              <input
                ref={inputRefs[1]}
                type="number"
                disabled
                onChange={(e) => handleInput(1, e)}
                onKeyUp={(e) => handleKeyUp(1, e)}
                className="border-none max-w-[20%] h-[60px] text-center rounded-[5px] bg-[#adadad] text-[2.5rem] overflow-y-hidden focus:outline focus:outline-[1.5px] focus:outline-[#286D40] focus:outline-offset-2"
              />
              <input
                ref={inputRefs[2]}
                type="number"
                disabled
                onChange={(e) => handleInput(2, e)}
                onKeyUp={(e) => handleKeyUp(2, e)}
                className="border-none max-w-[20%] h-[60px] text-center rounded-[5px] bg-[#adadad] text-[2.5rem] overflow-y-hidden focus:outline focus:outline-[1.5px] focus:outline-[#286D40] focus:outline-offset-2"
              />
              <input
                ref={inputRefs[3]}
                type="number"
                disabled
                onChange={(e) => handleInput(3, e)}
                onKeyUp={(e) => handleKeyUp(3, e)}
                className="border-none max-w-[20%] h-[60px] text-center rounded-[5px] bg-[#adadad] text-[2.5rem] overflow-y-hidden focus:outline focus:outline-[1.5px] focus:outline-[#286D40] focus:outline-offset-2"
              />
            </div>
          </ul>
          <br />
          <div className="option-button">
            <button
              className=""
              onClick={() => {
                setShowJoinGame(false);
              }}
            >
              Join Game
            </button>
          </div>
        </Modal>
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
              - Crust Connection! Try to match up all of the <b>toppings</b>{" "}
              behind the tiles
            </li>
            <li className="mx-3 my-auto">
              - You get 3 tries to get as many <b>pairs</b> as you can !
            </li>
          </ul>
        </Modal>
      )}
      {showGameOverScreen &&
        (strikes === 0 ? (
          <Modal
            isOpen={showGameOverScreen}
            onClose={() => {
              setShowGameOverScreen(false);
              endGame();
              setInGame(false);
            }}
          >
            <h1 className="text-center underline text-3xl">You Lost!</h1>
            <br />
            <ul>
              <li className="mx-3 my-auto text-center">
                Better Luck Next Time...
              </li>
              <li className="mx-3 my-auto text-center">
                Your Score: {playerScore}
              </li>
            </ul>
          </Modal>
        ) : (
          <Modal
            isOpen={showGameOverScreen}
            onClose={() => {
              setShowGameOverScreen(false);
              endGame();
              setInGame(false);
            }}
          >
            <h1 className="text-center underline text-3xl">You Won!</h1>
            <br />
            <ul>
              <li className="mx-3 my-auto text-center">Good Job !!!!!</li>
              <li className="mx-3 my-auto text-center">
                Your Score: {playerScore}
              </li>
            </ul>
          </Modal>
        ))}
    </>
  );
};

export default CrustConnection;
