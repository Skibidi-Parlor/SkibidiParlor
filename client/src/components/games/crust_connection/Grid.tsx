import "../../../styles/components/games/crust_connection/Grid.css"
import Tile from "./Tile"

type GridProps = {
  graph: string[];
  flippedTiles: number[];
  matchedTiles: number[];
  handleFlip: (index: number) => void;
};

const Grid = ({ graph, flippedTiles, matchedTiles, handleFlip } : GridProps) => {

    return (
        <div className="grid-container">
            {graph.map((_, index) => (
                <Tile key={index} 
                pictureOfFood={graph[index]} 
                isFlipped={flippedTiles.includes(index)} 
                isMatching={matchedTiles.includes(index)} 
                handleFlip={handleFlip}/>
            ))}
        </div>
    )
}

export default Grid