interface Params {
  startNewGame: () => void;
  users: string[];
}
const StartGame = ({ startNewGame, users }: Params) => {
  return (
    <div className="bg-[#B9C0DA] h-screen flex items-center justify-center">
      <div className="bg-white shadow-2xl rounded-2xl p-10 flex flex-col items-center w-[90%] max-w-md max-h-[85vh] overflow-scroll">
        <h1 className="text-5xl font-bold text-center text-[#FCCA46] mb-6">
          Admin: Start Trivia Session
        </h1>

        <button
          className="w-full bg-[#FCCA46] text-white py-2 rounded-lg text-lg font-semibold hover:bg-[#EBBA45] transition"
          onClick={(e) => {
            e.preventDefault();
            startNewGame();
          }}
        >
          Start!
        </button>

        <label className="text-lg font-medium mb-2 text-gray-700 mt-1">
          Players:
        </label>
        <div className="flex flex-col">
          {users && users.map((player) => <div>{player}</div>)}
        </div>
      </div>
    </div>
  );
};

export default StartGame;
