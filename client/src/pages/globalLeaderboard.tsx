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
  const [currentFilter, setCurrentFilter] = useState(0); // 0: by total points, 1: Topping Trouble, 2: Slice Sweeper, 3: Crust Connection, 4: Gatchaza, 5: Drop Top
  const [allTime, setAllTime] = useState(true);
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
    setCurrentFilter(0);

    const fetchLeaderboard = async () => {
      await sortByTotal();
    };
    fetchLeaderboard();
  }, []);

  useEffect(() => {
    const handleIncomingLeaderboardMsg = async (data: {
      response: string;
      gameID: number;
    }) => {
      if (data.response == "Success") {
        console.log("user's new score was saved into database");
        console.log("fetching new leaderboard data...");

        if (currentFilter == 0) {
          sortByTotal();
        } else if (currentFilter == Number(data.gameID)) {
          console.log(
            "the newly added score was for game ID which is the current filter: ",
            data.gameID
          );
          sortByGame(currentFilter);
        }
      } else if (data.response == "Fail") {
        console.log("user's new score unable to be saved into database");
        console.log("NOT fetching new leaderboard data");
      }
    };

    socket.on("leaderboard-update-from-server", handleIncomingLeaderboardMsg); // receive leaderboard data
  }, []);

  const sortByTotal = async () => {
    console.log("sorting by total number of points");

    const topPlayers = await trpc.leaderboard.topPlayers.query();
    console.log(topPlayers);

    setData(topPlayers);
    setCurrentFilter(0);
    setShowDropdown(false);
  };

  const sortByGame = async (gameID: number) => {
    console.log("sorting by game");
    const topPlayers = await trpc.leaderboard.topPlayersByGame.query(gameID);

    setData(topPlayers);
    setCurrentFilter(gameID);
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
                onClick={() => {
                  sortByGame(1);
                }}
              >
                Topping Trouble
              </div>
              <div
                className="p-1 text-sm lg:text-lg text-white hover:bg-[#5c6792] rounded-md"
                onClick={() => {
                  sortByGame(2);
                }}
              >
                Slice Sweeper
              </div>
              <div
                className="p-1 text-sm lg:text-lg text-white hover:bg-[#5c6792] rounded-md"
                onClick={() => {
                  sortByGame(3);
                }}
              >
                Crust Connection
              </div>
              <div
                className="p-1 text-sm lg:text-lg text-white hover:bg-[#5c6792] rounded-md"
                onClick={() => {
                  sortByGame(4);
                }}
              >
                Gatchaza
              </div>
              <div
                className="p-1 text-sm lg:text-lg text-white hover:bg-[#5c6792] rounded-md"
                onClick={() => {
                  sortByGame(5);
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
          <div className="flex gap-2 mb-2">
            <div className="text-2xl text-white">All Time</div>
            <div className="relative my-auto">
              <input
                onChange={() => {
                  setAllTime(!allTime);
                }}
                className="mr-2 mt-[0.3rem] h-3.5 w-8 appearance-none rounded-[0.4375rem] bg-neutral-300 before:pointer-events-none before:absolute before:h-3.5 before:w-3.5 before:rounded-full before:bg-transparent before:content-[''] after:absolute after:z-[2] after:-mt-[0.1875rem] after:h-5 after:w-5 after:rounded-full after:border-none after:bg-neutral-100 after:shadow-[0_0px_3px_0_rgb(0_0_0_/_7%),_0_2px_2px_0_rgb(0_0_0_/_4%)] after:transition-[background-color_0.2s,transform_0.2s] after:content-[''] checked:bg-primary checked:after:absolute checked:after:z-[2] checked:after:-mt-[3px] checked:after:ml-[1.0625rem] checked:after:h-5 checked:after:w-5 checked:after:rounded-full checked:after:border-none checked:after:bg-primary checked:after:shadow-[0_3px_1px_-2px_rgba(0,0,0,0.2),_0_2px_2px_0_rgba(0,0,0,0.14),_0_1px_5px_0_rgba(0,0,0,0.12)] checked:after:transition-[background-color_0.2s,transform_0.2s] checked:after:content-[''] hover:cursor-pointer focus:outline-none focus:ring-0 focus:before:scale-100 focus:before:opacity-[0.12] focus:before:shadow-[3px_-1px_0px_13px_rgba(0,0,0,0.6)] focus:before:transition-[box-shadow_0.2s,transform_0.2s] focus:after:absolute focus:after:z-[1] focus:after:block focus:after:h-5 focus:after:w-5 focus:after:rounded-full focus:after:content-[''] checked:focus:border-primary checked:focus:bg-primary checked:focus:before:ml-[1.0625rem] checked:focus:before:scale-100 checked:focus:before:shadow-[3px_-1px_0px_13px_#3b71ca] checked:focus:before:transition-[box-shadow_0.2s,transform_0.2s] dark:bg-neutral-600 dark:after:bg-neutral-400 dark:checked:bg-primary dark:checked:after:bg-primary dark:focus:before:shadow-[3px_-1px_0px_13px_rgba(255,255,255,0.4)] dark:checked:focus:before:shadow-[3px_-1px_0px_13px_#3b71ca]"
                type="checkbox"
                role="switch"
                id="flexSwitchCheckDefault01"
              />
            </div>
            <div className="text-2xl text-white">Single Game</div>
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
