import "../../../styles/components/games/crust_connection/Grid.css"
import Tile from "./Tile"

type GridProps = {
  graph: [16];
  key: number;
  foundBomb: boolean;
  setCurrentMultiplier: React.Dispatch<React.SetStateAction<number>>;
  checkIfBomb: (value: "Pizza" | "Bomb") => boolean;
};

const Grid = ({ graph } : GridProps) => {

    return (
        <div className="grid-container">
            {graph.map((_, index) => (
                 <Tile key={index} pictureOfFood={"../../../../public/games/SliceSweeper/pizza.webp"}/>
            ))}
            {/* [...Array(totalTiles)].map((_, index) => (
                <Tile key={index} pictureOfFood={"../../../../public/games/SliceSweeper/pizza.webp"} />
            )) */}
        </div>
    )
}

export default Grid