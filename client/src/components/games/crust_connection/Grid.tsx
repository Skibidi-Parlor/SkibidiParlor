import "../../../styles/components/games/crust_connection/Grid.css"
import Tile from "./Tile"

type GridProps = {
  graph: string[];
};

const Grid = ({ graph } : GridProps) => {

    return (
        <div className="grid-container">
            {graph.map((_, index) => (
                 <Tile key={index} pictureOfFood={graph[index]}/>
            ))}
        </div>
    )
}

export default Grid