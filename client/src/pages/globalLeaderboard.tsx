import { useState, useEffect } from "react";
// import ShouldBeLoggedIn from "../helpers/ShouldBeLoggedIn";
import { LeaderboardEntryModel } from "../../shared/src/models";
import { LeaderboardEntry } from "../components/ui/LeaderboardEntry";
import { trpc } from "../api";
import { socket } from "../socket";
import ShouldBeLoggedIn from "../helpers/ShouldBeLoggedIn";

const GlobalLeaderboard = () => {
  ShouldBeLoggedIn(true);

  const [showDropdown, setShowDropdown] = useState(false);
  const [data, setData] = useState<LeaderboardEntryModel[]>([]);
  const [currentFilter, setCurrentFilter] = useState<number>(0); // 0: by total points, 1: Topping Trouble, 2: Slice Sweeper, 3: Crust Connection, 4: Gatchaza, 5: Drop Top
  const [allTimeGame, setAllTimeGame] = useState(true);
  const gameDict: Record<number, string> = {
    0: "Total Points",
    1: "Topping Trouble",
    2: "Slice Sweeper",
    3: "Crust Connection",
    4: "Gatchaza",
    5: "Drop Top",
  };

  // display player's by total points first
  useEffect(() => {
    const fetchLeaderboard = async () => {
      await sortByTotal();
    };
    fetchLeaderboard();
  }, []);

  useEffect(() => {
    const sort = async () => {
      if (currentFilter === 0) {
        await sortByTotal();
      } else {
        await sortByGame(currentFilter);
      }
    };
    sort();
  }, [allTimeGame, currentFilter]);

  useEffect(() => {
    const handleIncomingLeaderboardMsg = async (data: {
      response: string;
      gameID: number;
    }) => {
      if (data.response == "Success") {
        sortByTotal();
        sortByGame(currentFilter);
      } else if (data.response == "Fail") {
        throw new Error("Fail");
      }
    };

    socket.on("leaderboard-update-from-server", handleIncomingLeaderboardMsg); // receive leaderboard data
  }, []);

  const sortByTotal = async () => {
    const topPlayers = await trpc.leaderboard.topPlayers.query();

    setData(topPlayers);
    setShowDropdown(false);
  };

  const sortByGame = async (gameID: number) => {
    let topPlayers;

    if (gameID === 0) {
      return;
    }

    if (allTimeGame) {
      topPlayers = await trpc.leaderboard.topPlayersByGame.query(gameID);
    } else {
      topPlayers = await trpc.leaderboard.topGamesByGame.query(gameID);
    }

    setData(topPlayers);
    setShowDropdown(false);
  };

  return (
    <div className="flex flex-col items-center w-screen h-screen bg-[#464D69] overflow-y-auto">
      <div className="flex text-center justify-center mt-16 text-4xl lg:text-5xl font-bold text-white text-shadow-amber-500">
        Leaderboard
      </div>

      <div className="flex justify-center mt-6 lg:w-[20vw] p-1 space-x-2">
        <div
          className={`flex flex-1 p-1 w-[32vw] justify-center text-center text-xl lg:text-3xl text-white font-semibold rounded-lg hover:bg-[#5c6792] ${
            currentFilter === 0 ? "bg-gray-800" : "bg-[#7D88B6]"
          } cursor-pointer`}
          onClick={sortByTotal}
        >
          Total
        </div>

        <div
          className={`flex flex-1 w-[32vw] relative justify-center text-center text-xl lg:text-3xl text-white font-semibold rounded-lg ${
            currentFilter != 0 ? "bg-gray-800" : "bg-[#7D88B6]"
          } hover:bg-[#5c6792] cursor-pointer`}
        >
          <div
            className="w-full h-full p-1 rounded-lg"
            onClick={() => {
              setShowDropdown(!showDropdown);
            }}
          >
            Game
          </div>

          {showDropdown && (
            <div className="absolute top-full z-10 mt-2 w-[40vw] lg:w-[15vw] py-1 px-1 rounded-md bg-[#7D88B6] border">
              <div
                className="p-1 text-sm lg:text-lg text-white hover:bg-[#5c6792] rounded-md"
                onClick={async () => {
                  setCurrentFilter(1);
                  await sortByGame(1);
                }}
              >
                Topping Trouble
              </div>
              <div
                className="p-1 text-sm lg:text-lg text-white hover:bg-[#5c6792] rounded-md"
                onClick={async () => {
                  setCurrentFilter(2);
                  await sortByGame(2);
                }}
              >
                Slice Sweeper
              </div>
              <div
                className="p-1 text-sm lg:text-lg text-white hover:bg-[#5c6792] rounded-md"
                onClick={async () => {
                  setCurrentFilter(3);
                  await sortByGame(3);
                }}
              >
                Crust Connection
              </div>
              <div
                className="p-1 text-sm lg:text-lg text-white hover:bg-[#5c6792] rounded-md"
                onClick={async () => {
                  setCurrentFilter(4);
                  await sortByGame(4);
                }}
              >
                Gatchaza
              </div>
              <div
                className="p-1 text-sm lg:text-lg text-white hover:bg-[#5c6792] rounded-md"
                onClick={async () => {
                  setCurrentFilter(5);
                  await sortByGame(5);
                }}
              >
                Drop Top
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="flex justify-center text-2xl lg:text-3xl mt-5 lg:mt-6 text-white">
        <div>{gameDict[currentFilter]}</div>
      </div>

      <div className="flex flex-col justify-center w-[94vw] lg:w-[35vw] px-3 py-5 mt-3 items-center bg-[#7D88B6] rounded-xl mb-5">
        {currentFilter !== 0 && (
          <div className="flex gap-2 mb-2 items-center">
            <button
              onClick={() => setAllTimeGame(true)}
              className={`text-2xl px-4 py-1 rounded-lg transition ${
                allTimeGame ? "bg-white text-black" : "text-white"
              }`}
            >
              All Time
            </button>
            <button
              onClick={() => setAllTimeGame(false)}
              className={`text-2xl px-4 py-1 rounded-lg transition ${
                !allTimeGame ? "bg-white text-black" : "text-white"
              }`}
            >
              Single Game
            </button>
          </div>
        )}

        <div className="flex flex-col space-y-3 overflow-y-auto max-h-[60vh] w-full pr-1">
          {data.map((player, index) => (
            <LeaderboardEntry
              key={player.id}
              id={player.id}
              placing={index + 1}
              username={player.username}
              points={player.total_points}
              pfp_path={player.pfp_path}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default GlobalLeaderboard;
