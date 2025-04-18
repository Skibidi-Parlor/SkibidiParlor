import { useState, useEffect } from "react";
import "../../../styles/components/games/slice_sweeper/Tile.css";

type TileParams = {
    pictureOfFood: string;
    key: number;
}

const LoadingTile = ({ key, pictureOfFood }: TileParams) => {
  const [isRevealed, setIsRevealed] = useState(false);

  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout>;

    const startRandomFlipLoop = () => {
      const randomDelay = Math.random() * (5000 - 500) + 500; 
      timeoutId = setTimeout(() => {
        setIsRevealed((prev) => !prev);
        startRandomFlipLoop();
      }, randomDelay);
    };

    startRandomFlipLoop();

    return () => clearTimeout(timeoutId);
  }, []);


  return (
    <div className={`tile-container ${key}`}>
            <div className={`tile ${isRevealed ? "is-flipped" : ""}`}> 
                <div className="tile-show front">
                </div>
                <div className="tile-show not-the-front-but-the-other-side-the-reversed-side-if-you-like-to-call-it">

                    <img src={pictureOfFood} alt="" />
                </div>
            </div>
        </div>
  );
};

export default LoadingTile;
