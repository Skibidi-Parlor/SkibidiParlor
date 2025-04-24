import "../styles/pages/game.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ShouldBeLoggedIn from "../helpers/ShouldBeLoggedIn";
import Modal from "../components/ui/Modal";

const Game = () => {
  ShouldBeLoggedIn(true);

  const [activeSquare, setActiveSquare] = useState(0);
  const [hidePlayButton, setHidePlayButton] = useState(false);
  const [showCantPlayModal, setShowCantPlayModal] = useState(false);

  const gameTitles = [
    "Topping Trouble",
    "Slice Sweeper",
    "Crust Connection",
    "Gatchaza",
    "Drop Top",
  ];

  const navigationLinks = [
    "./toppingtrouble",
    "./slicesweeper",
    "./crustconnection",
    "./gatchaza",
    "./toppingdroppings",
  ];

  const navigate = useNavigate();

  return (
    <>
      <div className="game">
        <h1 className="title-game">Games</h1>

        <div className="container-of-games">
          {gameTitles.map((gameTitle, index) => (
            <div
              key={index}
              className={`game-square ${
                activeSquare === index ? "active-square" : ""
              }`}
              onClick={async () => {
                if (activeSquare !== index) {
                  setHidePlayButton(true);
                  setActiveSquare(index);
                  await new Promise((r) => setTimeout(r, 300));
                  setHidePlayButton(false);
                }
              }}
            >
              <h1>{gameTitle}</h1>
              {!hidePlayButton && (
                <button
                  onClick={() => {
                    console.log(index);
                    if (
                      !localStorage.getItem("userID") &&
                      (index === 0 || index === 3)
                    ) {
                      setShowCantPlayModal(true);
                    } else {
                      navigate(navigationLinks[index]);
                    }
                  }}
                >
                  <h1>Play</h1>
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
      {showCantPlayModal && (
        <Modal
          isOpen={showCantPlayModal}
          onClose={() => {
            setShowCantPlayModal(false);
          }}
        >
          <div className="flex flex-col items-center text-center gap-4">
            <h1 className="text-2xl">
              An account is required to play this game
            </h1>
            <button
              className="p-2 bg-gray-300 rounded-3xl"
              onClick={() => {
                localStorage.clear();
                navigate("/createAccount");
              }}
            >
              Create Account
            </button>
            <button
              className="p-2 bg-gray-300 rounded-3xl"
              onClick={() => {
                setShowCantPlayModal(false);
              }}
            >
              I'll Play Something Else
            </button>
          </div>
        </Modal>
      )}
    </>
  );
};

export default Game;
