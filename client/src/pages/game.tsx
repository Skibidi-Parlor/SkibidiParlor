import "../styles/pages/game.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ShouldBeLoggedIn from "../helpers/ShouldBeLoggedIn";

const Game = () => {
  ShouldBeLoggedIn(true);

  const [activeSquare, setActiveSquare] = useState(0);
  const [hidePlayButton, setHidePlayButton] = useState(false);

  const gameTitles = [
    "Slice Sweeper",
    "Topping Trouble",
    "Crust Connection",
    "Slots",
  ];

  const navigationLinks = [
    "./slicesweeper",
    "./toppingtrouble",
    "./crustconnection",
    "./slots",
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
                setHidePlayButton(true);
                setActiveSquare(index);
                await new Promise((r) => setTimeout(r, 300));
                setHidePlayButton(false);
              }}
            >
              <h1>{gameTitle}</h1>
              {!hidePlayButton && (
                <button onClick={() => navigate(navigationLinks[index])}>
                  <h1>Play</h1>
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default Game;
