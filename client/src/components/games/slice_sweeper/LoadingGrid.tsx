import LoadingTile from "./LoadingTile";

const LoadingGrid = () => {
  const graph = Array(25).fill("Pizza");
  return (
    <div className="grid grid-cols-5 gap-3 mt-10 mx-auto">
      {graph.map((value, index) => (
        <LoadingTile key={value + index} />
      ))}
    </div>
  );
};

export default LoadingGrid;
