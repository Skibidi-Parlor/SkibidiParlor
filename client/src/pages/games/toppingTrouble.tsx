import { useNavigate } from "react-router-dom";
import ShouldBeLoggedIn from "../../helpers/ShouldBeLoggedIn";
import Button from "../../components/games/slice_sweeper/Button";
import { useEffect, useState } from "react";
import { faQuestionCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Modal from "../../components/ui/Modal";

const ToppingTrouble = () => {
  const countdownAudio = new Audio("/games/ToppingTrouble/Countdown.mp3");
  const endCountdownAudio = new Audio("/games/ToppingTrouble/EndCountdown.mp3");
  const showingOrderAudio = new Audio("/games/ToppingTrouble/ShowingOrder.mp3");
  const correctToppingAudio = new Audio(
    "/games/ToppingTrouble/CorrectTopping.mp3"
  );
  const correctRoundAudio = new Audio("/games/ToppingTrouble/CorrectRound.mp3");
  const gameOverAudio = new Audio("/games/ToppingTrouble/GameOver.mp3");

  ShouldBeLoggedIn(true);
  const navigate = useNavigate();
  const basil = "/games/ToppingTrouble/Basil.png";
  const mushroom = "/games/ToppingTrouble/Mushroom.png";
  const onion = "/games/ToppingTrouble/Onion.png";
  const pepperoni = "/games/ToppingTrouble/Pepperoni.png";
  const pineapple = "/games/ToppingTrouble/Pineapple.png";

  const toppingImages = [basil, mushroom, onion, pepperoni, pineapple];
  const [isShrunk, setIsShrunk] = useState(true);
  const [idle, setIdle] = useState<number>(0);

  const [showFAQModal, setShowFAQModal] = useState(true);
  const [showCountdownModal, setShowCountdownModal] = useState(false);
  const [showGameOverModal, setShowGameOverModal] = useState(false);

  const [inGame, setInGame] = useState(false);
  const [countdown, setCountdown] = useState("3");
  const [score, setScore] = useState(0);

  //Computer Showing Order
  const [pattern, setPattern] = useState<number[]>([]);
  const [isShowingOrder, setIsShowingOrder] = useState(false);
  const [currentPatternIndex, setCurrentPatternIndex] = useState<number>();
  const [checkMark, setShowCheckMark] = useState(false);

  //User Guesses
  const [attemptedPattern, setAttemptedPattern] = useState<number[]>([]);
  const [attemptedIndex, setAttemptedIndex] = useState<number>(0);
  const [showTimer, setShowTimer] = useState(false);
  const [startTimer, setStartTimer] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      if (isShrunk) {
        setIdle(Math.floor(Math.random() * 5));
      }
      setIsShrunk((prev) => !prev);
    }, 2000);

    return () => clearInterval(interval);
  }, [isShrunk]);

  useEffect(() => {
    let cancelled = false;
    const resetTimer = async () => {
      if (!isShowingOrder && inGame) {
        console.log("hi");
        setStartTimer(true);
        setShowTimer(true);
        await new Promise((r) => setTimeout(r, 6000));
        if (cancelled) return;
        endGame();
      }
    };
    resetTimer();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inGame, isShowingOrder, attemptedIndex]);

  const countdownPopup = async () => {
    setInGame(true);
    setShowCountdownModal(true);

    countdownAudio.play();
    await new Promise((r) => setTimeout(r, 500));
    countdownAudio.pause();
    countdownAudio.currentTime = 0;
    countdownAudio.play();
    setCountdown("2");
    await new Promise((r) => setTimeout(r, 500));
    countdownAudio.pause();
    countdownAudio.currentTime = 0;
    countdownAudio.play();
    setCountdown("1");
    await new Promise((r) => setTimeout(r, 500));
    countdownAudio.pause();
    countdownAudio.currentTime = 0;
    endCountdownAudio.play();
    setCountdown("GO");
    await new Promise((r) => setTimeout(r, 1000));
    setShowCountdownModal(false);
    setCountdown("3");
  };

  const showOrder = async (newGame: boolean) => {
    setStartTimer(false);
    setIsShowingOrder(true);

    await countdownPopup();

    const newPattern = newGame ? [] : [...pattern];
    newPattern.push(Math.floor(Math.random() * 5));
    setPattern(newPattern);
    const newAttemptedPattern = Array(newPattern.length).fill(-1) as number[];
    setAttemptedPattern(newAttemptedPattern);

    for (const image of newPattern) {
      setCurrentPatternIndex(image);
      showingOrderAudio.play();
      await new Promise((r) => setTimeout(r, 500));
      showingOrderAudio.pause();
      showingOrderAudio.currentTime = 0;
    }

    setAttemptedIndex(0);
    setCurrentPatternIndex(undefined);
    setIsShowingOrder(false);
    setShowTimer(true);
    setStartTimer(false);
  };

  const guess = async (index: number) => {
    if (index === pattern[attemptedIndex]) {
      setStartTimer(false);
      const newAttemptedPattern = [...attemptedPattern];
      newAttemptedPattern[attemptedIndex] = index;
      setAttemptedPattern(newAttemptedPattern);
      setAttemptedIndex((prev) => prev + 1);

      if (attemptedIndex == attemptedPattern.length - 1) {
        correctRoundAudio.play();
        setScore((prev) => prev + 1);
        setIsShowingOrder(true);
        setShowCheckMark(true);
        await new Promise((r) => setTimeout(r, 1000));
        setShowCheckMark(false);
        await showOrder(false);
      } else {
        correctToppingAudio.play();
      }
    } else {
      endGame();
    }
  };

  const endGame = () => {
    setStartTimer(false);
    setShowTimer(false);
    gameOverAudio.play();
    setShowGameOverModal(true);
    setInGame(false);
    setAttemptedPattern([]);
    setAttemptedIndex(0);
    setScore(0);
  };

  return (
    <div className="bg-[#D9D9D9] min-w-screen min-h-screen flex flex-col items-center text-[#D0A26A] border-[#D0A26A] border-10 border-double">
      <Button
        title="← Back to Menu"
        className="text-xs mt-5 mr-auto bg-[#C28843] text-white"
        onClick={() => navigate("/games")}
      />
      <div className="flex flex-col text-2xl mx-auto mt-10 lg:mt-10 gap-3 text-center">
        <h1 className="text-5xl">Topping Trouble</h1>
        <div
          className="flex mx-auto"
          onClick={() => {
            setShowFAQModal(true);
          }}
        >
          <h2 className="text-xl my-auto underline">How To Play</h2>
          <FontAwesomeIcon
            icon={faQuestionCircle}
            className="text-sm my-auto ml-2"
          />
        </div>
        {inGame ? (
          <div className="flex flex-col justify-center items-center">
            <div>Current Score: {score}</div>

            <div className="relative h-[40vh] w-[40vh]">
              <div className="absolute inset-0 m-auto w-full h-full flex items-center justify-center">
                <img
                  src={
                    checkMark
                      ? "/games/ToppingTrouble/CheckMark.webp"
                      : toppingImages[currentPatternIndex!]
                  }
                  className={`w-[25vw] lg:w-[5vw] h-auto z-10 duration-2000 ${
                    isShrunk ? "transform scale-0" : "transform scale-100"
                  }`}
                />
                {showCountdownModal && (
                  <div className="absolute text-5xl text-center z-20">
                    {countdown}
                  </div>
                )}
              </div>

              {/* Pizza base at the bottom layer */}
              <img
                src="/games/ToppingTrouble/PlainPizza.png"
                className="absolute inset-0 m-auto w-[75vw] h-auto z-0"
              />
            </div>
            {!isShowingOrder && (
              <div className="flex flex-col">
                <div className="flex justify-center gap-4 mt-4">
                  <img
                    src={basil}
                    className="w-[15vw] sm:w-[10vw] lg:w-[5vw] h-auto bg-[#FFB051] p-2 rounded-xl"
                    onClick={() => {
                      guess(0);
                    }}
                  ></img>
                  <img
                    src={mushroom}
                    className="w-[15vw] sm:w-[10vw] lg:w-[5vw] h-auto bg-[#FFB051] p-2 rounded-xl"
                    onClick={() => {
                      guess(1);
                    }}
                  ></img>
                  <img
                    src={onion}
                    className="w-[15vw] sm:w-[10vw] lg:w-[5vw] h-auto bg-[#FFB051] p-2 rounded-xl"
                    onClick={() => {
                      guess(2);
                    }}
                  ></img>
                  <img
                    src={pepperoni}
                    className="w-[15vw] sm:w-[10vw] lg:w-[5vw] h-auto bg-[#FFB051] p-2 rounded-xl"
                    onClick={() => {
                      guess(3);
                    }}
                  ></img>
                  <img
                    src={pineapple}
                    className="w-[15vw] sm:w-[10vw] lg:w-[5vw] h-[15vw] sm:h-[10vw] lg:h-[5vw] bg-[#FFB051] p-2 rounded-xl"
                    onClick={() => {
                      guess(4);
                    }}
                  ></img>
                </div>
                <div className="flex justify-center gap-2 mt-5">
                  {attemptedPattern.map((image, index) =>
                    image === -1 ? (
                      <span key={index}>X</span>
                    ) : (
                      <img
                        src={toppingImages[image]}
                        key={index}
                        className="w-[5vw] lg:w-[2vw] h-[5vw] lg:h-[2vw] my-auto"
                      ></img>
                    )
                  )}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="flex flex-col justify-center items-center">
            <div className="relative h-[40vh] w-[40vh]">
              <img
                src={toppingImages[idle]}
                className={`absolute w-[25vw] lg:w-[5vw] h-auto z-1 inset-0 m-auto duration-2000 ${
                  isShrunk ? "transform-[scale(0)]" : "transform-[scale(1)]"
                }`}
              />
              <img
                src="/games/ToppingTrouble/PlainPizza.png"
                className="absolute inset-0 m-auto w-[75vw] h-auto"
              />
            </div>
            <div className="flex flex-col mx-auto items-center">
              <Button
                title={`Start Game`}
                className="text-3xl text-white bg-[#C28843] px-6 py-3 rounded-lg"
                onClick={async () => {
                  showOrder(true);
                }}
              />
            </div>
          </div>
        )}
      </div>
      {showFAQModal && (
        <Modal
          isOpen={showFAQModal}
          onClose={() => {
            setShowFAQModal(false);
          }}
        >
          <h1 className="text-center underline text-3xl text-black">
            How To Play
          </h1>
          <ul className="text-black">
            <div className="mx-3 my-auto">
              - Topping Trouble! A Test of your Memory!
            </div>
            <div className="mx-3 my-auto mt-2">
              - One person selects a topping, the next person has to select ALL
              the previous toppings + a new one and vise versa
            </div>
            <div className="mx-3 my-auto mt-2">
              - Ex:{" "}
              <div className="mx-3 my-auto text-xs"> Player1: Pepperoni</div>
              <div className="mx-3 my-auto text-xs">
                Player2: Pepperoni + Pineapple
              </div>
              <div className="mx-3 my-auto text-xs">
                Player3: Pepperoni + Pineapple + Basil
              </div>
              <div className="mx-3 my-auto text-xs">
                Player4: Pepperoni + Pineapple + Basil + Pineapple...
              </div>
            </div>
            <div className="mx-3 my-aut mt-2">
              -First one to select a wrong topping, or run out of time loses!
              The winner will earn points equal to the amount of toppings that
              were in queue
            </div>
            <div className="mx-3 my-aut mt-2">- Good Luck!</div>
          </ul>
        </Modal>
      )}
      {showGameOverModal && (
        <Modal
          isOpen={showGameOverModal}
          onClose={() => {
            setShowGameOverModal(false);
          }}
        >
          <div className="flex flex-col items-center">
            <div className="text-5xl text-red-500 text-center">GAME OVER</div>
            <div>Your Score: {score}</div>
            <div className="flex justify-center gap-2 mt-5">
              {pattern.map((image, index) =>
                image === -1 ? (
                  <span key={index}>X</span>
                ) : (
                  <img
                    src={toppingImages[image]}
                    key={index}
                    className="w-[5vw] h-[5vw] my-auto"
                  ></img>
                )
              )}
            </div>
          </div>
        </Modal>
      )}
      {showTimer && (
        <span
          className={`absolute bottom-1 h-[10px] w-[100vw] bg-red-500 transition-all ${
            startTimer ? "transition-all duration-7000" : ""
          }`}
          style={{
            transform: startTimer ? `translate(0vw)` : `translate(-100vw)`,
          }}
        >
          Hi
        </span>
      )}
    </div>
  );
};

export default ToppingTrouble;
