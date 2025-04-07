import { useState } from "react";
import "../../../styles/components/games/slice_sweeper/Tile.css";
type TileProps = {
  value: "Bomb" | "Pizza";
  foundBomb: boolean;
  setCurrentMultiplier: React.Dispatch<React.SetStateAction<number>>;
  checkIfBomb: (value: "Pizza" | "Bomb") => boolean;
};

const Tile = ({
  value,
  foundBomb,
  setCurrentMultiplier,
  checkIfBomb,
}: TileProps) => {
  const pizzaAudio = new Audio("/games/SliceSweeper/pizza.mp3");
  pizzaAudio.volume = 1;
  const bombAudio = new Audio("/games/SliceSweeper/bomb.mp3");

  const [isRevealed, setIsRevealed] = useState(false);

  const click = () => {
    if (!foundBomb) {
      setIsRevealed(true);
      const isThisTheBomb = checkIfBomb(value);
      if (isThisTheBomb) {
        bombAudio.play();
        setCurrentMultiplier(0.0);
      } else {
        pizzaAudio.play();
        setCurrentMultiplier((prev) => Number((prev + 0.2).toFixed(1)));
      }
    }
  };

  return (
    <div
      onClick={click}
      className={`w-[12vw] sm:w-[8vw] lg:w-[4vw] h-[12vw] sm:h-[8vw] lg:h-[4vw] perspective ${
        isRevealed && "pointer-events-none"
      }`}
    >
      <div
        className={`relative w-full h-full  transition-transform duration-500 transform-style-preserve-3d ${
          isRevealed || foundBomb ? "rotate-y-180" : ""
        }`}
      >
        <div
          className={`absolute w-full h-full rounded-xl backface-hidden rotate-y-180 flex items-center justify-center ${
            value === "Pizza" ? "bg-white" : "bg-red-500"
          }`}
        >
          <img
            src={
              value === "Pizza"
                ? "/games/SliceSweeper/pizza.webp"
                : "/games/SliceSweeper/bomb.webp"
            }
            alt={value}
            className="w-3/4 h-3/4 object-contain"
          />
        </div>

        <div className="absolute w-full h-full rounded-xl backface-hidden bg-[#250E35]"></div>
      </div>
    </div>
  );
};

export default Tile;
