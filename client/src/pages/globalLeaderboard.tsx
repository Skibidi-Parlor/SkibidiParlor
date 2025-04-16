import { useState, useEffect } from "react";
// import ShouldBeLoggedIn from "../helpers/ShouldBeLoggedIn";
import { LeaderboardEntryModel } from "../../shared/src/models";
import { LeaderboardEntry } from "../components/ui/LeaderboardEntry";

const globalLeaderboard = () => {
  // ShouldBeLoggedIn(false);

  useEffect(() => {
    setDummyData(totalData);
  }, []);

  const [showDropdown, setShowDropdown] = useState(false);
  const [dummyData, setDummyData] = useState<LeaderboardEntryModel[]>([]);

  const totalData: LeaderboardEntryModel[] = [
    { id: 1, username: "chillwafflez", pfp_path: "https://i.pinimg.com/736x/34/e9/0b/34e90b0e834f2cb0deccb0f7a9beb41d.jpg", points: 420 },
    { id: 2, username: "saltybagels", pfp_path: "https://i.pinimg.com/originals/1f/a9/16/1fa9164a3757278dae14b55cba05a4f2.jpg", points: 234 },
    { id: 3, username: "kafkalover", pfp_path: "https://i.pinimg.com/736x/4b/e8/b9/4be8b9842a4bfe0ff89b2a0d6d3a2cae.jpg", points: 200 },
    { id: 4, username: "gojo's dog", pfp_path: "https://cdn.pfps.gg/pfps/7609-gojo-mask.png", points: 156 },
    { id: 5, username: "god", pfp_path: "https://th.bing.com/th/id/OIP.SBKhiGelEi9VSQJhHdByuQHaHa?rs=1&pid=ImgDetMain", points: 102 },
    { id: 6, username: "aura farmer", pfp_path: "https://i.pinimg.com/originals/f0/b0/d0/f0b0d0301b0e665bd1ba62e69d065655.jpg", points: 69 }
  ]

  const toppingTroubleData: LeaderboardEntryModel[] = [
    { id: 5, username: "god", pfp_path: "https://th.bing.com/th/id/OIP.SBKhiGelEi9VSQJhHdByuQHaHa?rs=1&pid=ImgDetMain", points: 65 },
    { id: 3, username: "kafkalover", pfp_path: "https://i.pinimg.com/736x/4b/e8/b9/4be8b9842a4bfe0ff89b2a0d6d3a2cae.jpg", points: 64 },
    { id: 4, username: "gojo's dog", pfp_path: "https://cdn.pfps.gg/pfps/7609-gojo-mask.png", points: 34 },
    { id: 1, username: "chillwafflez", pfp_path: "https://i.pinimg.com/736x/34/e9/0b/34e90b0e834f2cb0deccb0f7a9beb41d.jpg", points: 20 },
    { id: 6, username: "aura farmer", pfp_path: "https://i.pinimg.com/originals/f0/b0/d0/f0b0d0301b0e665bd1ba62e69d065655.jpg", points: 7 },
    { id: 2, username: "saltybagels", pfp_path: "https://i.pinimg.com/originals/1f/a9/16/1fa9164a3757278dae14b55cba05a4f2.jpg", points: 1 }
  ]

  const sliceSweeperData: LeaderboardEntryModel[] = [
    { id: 4, username: "gojo's dog", pfp_path: "https://cdn.pfps.gg/pfps/7609-gojo-mask.png", points: 58 },
    { id: 3, username: "kafkalover", pfp_path: "https://i.pinimg.com/736x/4b/e8/b9/4be8b9842a4bfe0ff89b2a0d6d3a2cae.jpg", points: 34 },
    { id: 5, username: "god", pfp_path: "https://th.bing.com/th/id/OIP.SBKhiGelEi9VSQJhHdByuQHaHa?rs=1&pid=ImgDetMain", points: 32 },
    { id: 1, username: "chillwafflez", pfp_path: "https://i.pinimg.com/736x/34/e9/0b/34e90b0e834f2cb0deccb0f7a9beb41d.jpg", points: 10 },
    { id: 2, username: "saltybagels", pfp_path: "https://i.pinimg.com/originals/1f/a9/16/1fa9164a3757278dae14b55cba05a4f2.jpg", points: 6 },
    { id: 6, username: "aura farmer", pfp_path: "https://i.pinimg.com/originals/f0/b0/d0/f0b0d0301b0e665bd1ba62e69d065655.jpg", points: 2 }
  ]

  const sortByTotal = () => {
    console.log("sorting by total number of pizza points");
    setDummyData(totalData);
    setShowDropdown(false);
  }

  const sortByGame = (game: number) => {
    console.log("sorting by game");
    switch (game) {
      case 0:
        setDummyData(toppingTroubleData);
        break
      case 1:
        setDummyData(sliceSweeperData);
        break
      default:
        break;
    }
    setShowDropdown(false);
  }

  return (
    <div className="flex flex-col items-center min-w-screen min-h-screen max-h-screen bg-[#464D69]">
      <div className="flex text-center justify-center mt-16 text-4xl lg:text-5xl font-bold text-white text-shadow-amber-500">Leaderboard</div>

      <div className="flex justify-center mt-6 lg:w-[20vw] p-1 space-x-2">
        <div 
          className="flex flex-1 p-1 w-[32vw] justify-center text-center text-xl lg:text-3xl text-white font-semibold rounded-lg bg-[#7D88B6] hover:bg-[#5c6792] cursor-pointer" 
          onClick={sortByTotal}>Total</div>

        <div className="flex flex-1 w-[32vw] relative justify-center text-center text-xl lg:text-3xl text-white font-semibold rounded-lg bg-[#7D88B6] hover:bg-[#5c6792] cursor-pointer">
          <div 
            className="w-full h-full p-1 rounded-lg" 
            onClick={() => {setShowDropdown(!showDropdown)}}>Game
          </div>

          {showDropdown && 
            <div className="absolute top-full z-10 mt-2 w-[40vw] lg:w-[15vw] py-1 px-1 rounded-md bg-[#7D88B6] border">
                <div className="p-1 text-sm lg:text-lg text-white hover:bg-[#5c6792] rounded-md" onClick={() => {sortByGame(0)}}>Topping Trouble</div>
                <div className="p-1 text-sm lg:text-lg text-white hover:bg-[#5c6792] rounded-md" onClick={() => {sortByGame(1)}}>Slice Sweeper</div>
                <div className="p-1 text-sm lg:text-lg text-white hover:bg-[#5c6792] rounded-md" onClick={() => {sortByGame(2)}}>Crust Connection</div>
                <div className="p-1 text-sm lg:text-lg text-white hover:bg-[#5c6792] rounded-md" onClick={() => {sortByGame(3)}}>Slots</div>
            </div>
          }
        </div>
      </div>

      <div className="flex flex-col justify-center w-[94vw] lg:w-[35vw] px-3 py-5 mt-3 items-center bg-[#7D88B6] rounded-xl space-y-3">
        {dummyData.map((player, index) => (
          <LeaderboardEntry id={player.id} placing={index + 1} username={player.username} points={player.points} pfp_path={player.pfp_path} />
        ))}
      </div>
    </div>
  );
};

export default globalLeaderboard;