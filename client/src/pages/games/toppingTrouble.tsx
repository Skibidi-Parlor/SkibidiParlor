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

  const [inGame, setInGame] = useState(false);
  const [countdown, setCountdown] = useState("3");
  const [score, setScore] = useState(0);

  //Computer Showing Order
  const [pattern, setPattern] = useState<number[]>([1, 2, 3, 4]);
  const [isShowingOrder, setIsShowingOrder] = useState(false);
  const [currentPatternIndex, setCurrentPatternIndex] = useState<number>();

  //User Guesses
  const [attemptedPattern, setAttemptedPattern] = useState<number[]>([]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (isShrunk) {
        setIdle(Math.floor(Math.random() * 5));
      }
      setIsShrunk((prev) => !prev);
    }, 2000);

    return () => clearInterval(interval);
  }, [isShrunk]);

  const showOrder = async () => {
    setIsShowingOrder(true);
    const newPattern = [...pattern];
    newPattern.push(Math.floor(Math.random() * 5));
    setPattern(newPattern);
    const newAttemptedPattern = Array(newPattern.length).fill(-1) as number[];
    setAttemptedPattern(newAttemptedPattern);
    for (const image of newPattern) {
      setCurrentPatternIndex(image);
      showingOrderAudio.play();
      await new Promise((r) => setTimeout(r, 1000));
      showingOrderAudio.pause();
      showingOrderAudio.currentTime = 0;
    }
    setCurrentPatternIndex(undefined);
    setIsShowingOrder(false);
  };

  return (
    <div className="bg-[#D9D9D9] min-w-screen min-h-screen flex flex-col items-center text-[#D0A26A]">
      <Button
        title="← Back to Menu"
        className="text-xs mt-5 mr-auto bg-[#C28843] text-white"
        onClick={() => navigate("/games")}
      />
      <div className="flex flex-col text-2xl mx-auto mt-30 gap-3 text-center">
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
          <div>
            <div>Current Score: {score}</div>

            <div className="relative h-[40vh] w-[40vh] mx-auto">
              <img
                src={toppingImages[currentPatternIndex!]}
                className={`absolute w-[25vw] h-auto z-1 inset-0 m-auto`}
              />

              <img
                src="/games/ToppingTrouble/PlainPizza.png"
                className="absolute inset-0 m-auto w-[75vw] h-auto"
              />
            </div>
            {!isShowingOrder && (
              <div className="flex flex-col">
                <div className="flex justify-center gap-4">
                  <img
                    src={basil}
                    className="w-[15vw] h-auto bg-[#FFB051] p-2 rounded-xl"
                  ></img>
                  <img
                    src={mushroom}
                    className="w-[15vw] h-auto bg-[#FFB051] p-2 rounded-xl"
                  ></img>
                  <img
                    src={onion}
                    className="w-[15vw] h-auto bg-[#FFB051] p-2 rounded-xl"
                  ></img>
                  <img
                    src={pepperoni}
                    className="w-[15vw] h-auto bg-[#FFB051] p-2 rounded-xl"
                  ></img>
                  <img
                    src={pineapple}
                    className="w-[15vw] h-[17vw] bg-[#FFB051] p-2 rounded-xl"
                  ></img>
                </div>
                <div className="flex justify-center gap-4">
                  {attemptedPattern.map((image, index) =>
                    image === -1 ? (
                      <span key={index}>X</span>
                    ) : (
                      <img src={toppingImages[image]} key={index}></img>
                    )
                  )}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div>
            <div className="relative h-[40vh] w-[40vh]">
              <img
                src={toppingImages[idle]}
                className={`absolute w-[25vw] h-auto z-1 inset-0 m-auto duration-2000 ${
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
                  countdownAudio.play();
                  setInGame(true);
                  setShowCountdownModal(true);
                  await new Promise((r) => setTimeout(r, 1000));
                  countdownAudio.pause();
                  countdownAudio.currentTime = 0;
                  countdownAudio.play();
                  setCountdown("2");
                  await new Promise((r) => setTimeout(r, 1000));
                  countdownAudio.pause();
                  countdownAudio.currentTime = 0;
                  countdownAudio.play();
                  setCountdown("1");
                  await new Promise((r) => setTimeout(r, 1000));
                  countdownAudio.pause();
                  countdownAudio.currentTime = 0;
                  endCountdownAudio.play();
                  setCountdown("GO");
                  await new Promise((r) => setTimeout(r, 1000));
                  setShowCountdownModal(false);
                  setCountdown("3");
                  setIsShowingOrder(true);
                  showOrder();
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
              - Topping Trouble! A 2 person memory game battle!
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
      {showCountdownModal && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-5 text-5xl text-center mr-3">
          {countdown}
        </div>
      )}
    </div>
  );
};

export default ToppingTrouble;
