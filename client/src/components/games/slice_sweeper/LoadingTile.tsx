import { useState, useEffect } from "react";
import "../../../styles/components/games/slice_sweeper/Tile.css";

const LoadingTile = () => {
  const [value, setValue] = useState<"Pizza" | "Bomb">("Pizza");
  const [isRevealed, setIsRevealed] = useState(false);

  useEffect(() => {
    const options = ["Pizza", "Bomb"];
    const rng = Math.floor(Math.random() * options.length);
    setValue(options[rng] as "Pizza" | "Bomb");
    const intervalID = setInterval(() => {
      setIsRevealed((isRevealed) => !isRevealed);
    }, Math.random() * (15000 - 500) + 500);

    return () => clearInterval(intervalID);
  }, []);
  return (
    <div className={`w-[15vw] h-[15vw] perspective`}>
      <div
        className={`relative w-full h-full  transition-transform duration-500 transform-style-preserve-3d ${
          isRevealed ? "rotate-y-180" : ""
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

export default LoadingTile;
