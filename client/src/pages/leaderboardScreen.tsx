import { useState, useEffect } from "react";
// import ShouldBeLoggedIn from "../helpers/ShouldBeLoggedIn";
import { LeaderboardEntryModel } from "../../shared/src/models";
import { LeaderboardEntry } from "../components/ui/LeaderboardEntry";
import { trpc } from "../api";
import { socket } from "../socket";

const LeaderboardScreen = () => {
  const [allData, setAllData] = useState<LeaderboardEntryModel[]>([]);
  const [dataByAllTime, setDataByAllTime] = useState<LeaderboardEntryModel[]>(
    []
  );
  const [dataByBestGame, setDataByBestGame] = useState<LeaderboardEntryModel[]>(
    []
  );
  const [currentFilter, setCurrentFilter] = useState<number>(1); // 0: by total points, 1: Topping Trouble, 2: Slice Sweeper, 3: Crust Connection, 4: Gatchaza, 5: Drop Top

  const gameDict: Record<number, string> = {
    0: "Total Points",
    1: "Topping Trouble",
    2: "Slice Sweeper",
    3: "Crust Connection",
    4: "Gatchaza",
    5: "Drop Top",
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentFilter((prev) => {
        sortByGame((prev % 5) + 1);
        return (prev % 5) + 1;
      }); // cycles through 1 to 5
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  // display player's by total points first
  useEffect(() => {
    const fetchLeaderboard = async () => {
      await sortByTotal();
      const topPlayers = await trpc.leaderboard.topPlayersByGame.query(
        currentFilter
      );
      setDataByAllTime(topPlayers);
      const topGames = await trpc.leaderboard.topGamesByGame.query(
        currentFilter
      );
      setDataByBestGame(topGames);
    };
    fetchLeaderboard();
  }, []);

  useEffect(() => {
    const handleIncomingLeaderboardMsg = async (data: {
      response: string;
      gameID: number;
    }) => {
      if (data.response == "Success") {
        sortByTotal();
        const topPlayers = await trpc.leaderboard.topPlayersByGame.query(
          currentFilter
        );
        setDataByAllTime(topPlayers);
        const topGames = await trpc.leaderboard.topGamesByGame.query(
          currentFilter
        );
        setDataByBestGame(topGames);
      } else if (data.response == "Fail") {
        throw new Error("Fail");
      }
    };

    socket.on("leaderboard-update-from-server", handleIncomingLeaderboardMsg); // receive leaderboard data
  }, []);

  const sortByTotal = async () => {
    const topPlayers = await trpc.leaderboard.topPlayers.query();

    setAllData(topPlayers);
  };

  const sortByGame = async (gameID: number) => {
    const topPlayers = await trpc.leaderboard.topPlayersByGame.query(gameID);
    setDataByAllTime(topPlayers);
    const topGames = await trpc.leaderboard.topGamesByGame.query(gameID);
    setDataByBestGame(topGames);
  };

  return (
    <div className="bg-linear-to-b h-screen from-[#7134DD] to-[#AF9CCF] min-w-screen min-h-screen flex flex-col items-center border-10 border-gray-500">
      <div className="flex text-center justify-center mt-16 text-4xl lg:text-5xl font-bold text-white text-shadow-amber-500">
        Leaderboard
      </div>

      <div className="flex justify-center mt-6 lg:w-[20vw] p-1 space-x-2">
        <div
          className={`flex flex-1 w-[32vw] relative justify-center text-center text-xl lg:text-3xl text-white font-semibold rounded-lg ${
            currentFilter != 0 ? "bg-gray-800" : "bg-[#7D88B6]"
          } hover:bg-[#5c6792] cursor-pointer`}
        ></div>
      </div>

      <div className="flex flex-col md:flex-row gap-5 overflow-scroll">
        <div className="flex flex-col justify-center w-[94vw] lg:w-[25vw] px-3 py-5 mt-3 items-center bg-[#7D88B6] rounded-xl mb-5">
          <div className="flex justify-center text-2xl lg:text-3xl lg:mt-1 text-white mb-3">
            All Time
          </div>
          <div className="flex flex-col space-y-3 overflow-y-auto max-h-[60vh] w-full pr-1">
            {allData.map((player, index) => (
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
        <div className="flex flex-col justify-center w-[94vw] lg:w-[25vw] px-3 py-5 mt-3 items-center bg-[#7D88B6] rounded-xl mb-5">
          <div className="flex justify-center text-2xl lg:text-3xl lg:mt-1 text-white mb-3">
            <div>{gameDict[currentFilter]} (All)</div>
          </div>
          <div className="flex flex-col space-y-3 overflow-y-auto max-h-[60vh] w-full pr-1">
            {dataByAllTime.map((player, index) => (
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
        <div className="flex flex-col justify-center w-[94vw] lg:w-[25vw] px-3 py-5 mt-3 items-center bg-[#7D88B6] rounded-xl mb-5">
          <div className="flex justify-center text-2xl lg:text-3xl lg:mt-1 text-white mb-3">
            <div>{gameDict[currentFilter]} (Game)</div>
          </div>
          <div className="flex flex-col space-y-3 overflow-y-auto max-h-[60vh] w-full pr-1">
            {dataByBestGame.map((player, index) => (
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
    </div>
  );
};

export default LeaderboardScreen;
