import Tile from "./Tile";

type GridProps = {
  graph: ("Bomb" | "Pizza")[];
  key: number;
  foundBomb: boolean;
  setCurrentMultiplier: React.Dispatch<React.SetStateAction<number>>;
  checkIfBomb: (value: "Pizza" | "Bomb") => boolean;
};

const Grid = ({
  graph,
  foundBomb,
  setCurrentMultiplier,
  checkIfBomb,
}: GridProps) => {
  return (
    <div className="grid grid-cols-5 gap-3 mt-5 mx-auto">
      {graph.map((tile, index) => (
        <Tile
          key={index}
          value={tile}
          foundBomb={foundBomb}
          checkIfBomb={checkIfBomb}
          setCurrentMultiplier={setCurrentMultiplier}
        />
      ))}
    </div>
  );
};

export default Grid;
