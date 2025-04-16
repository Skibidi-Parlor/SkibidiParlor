import "../../../styles/components/games/crust_connection/Grid.css"
import LoadingTile from "./LoadingTile";

type GridProps = {
  graph: string[];
};

const LoadingGrid = ({ graph } : GridProps) => {

    return (
        <div className="grid-container">
            {graph.map((_, index) => (
                 <LoadingTile key={index} pictureOfFood={graph[index]}/>
            ))}
        </div>
    )
}

export default LoadingGrid