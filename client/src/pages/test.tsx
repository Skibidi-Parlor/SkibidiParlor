import { useEffect } from "react";
import { trpc } from "../api";
import { TRPCClientError } from "@trpc/client";
import { socket } from "../socket"; 
import { LeaderboardTestModel } from "../../shared/src/models";

const test = () => {


  // useEffect(() => {
  //   const handleIncomingLeaderboardData = (data: {
  //     response: "Success" | "Fail";
  //     players: LeaderboardTestModel[];
  //   }) => {
  //     console.log("got something?");
  
  //     if (data.response == "Fail") {
  //       console.log("couldn't receive leaderboard data from serverside");
  //     } else {
  //       console.log("RECEIVED DATA FROM CLIENT SIDE!!!");
  //     }
  //   };

  //   socket.on("leaderboard-update", handleIncomingLeaderboardData);  // receive leaderboard data
  // }, [])

  // const bruh = () => {
  //   console.log("emitting event...")
  //   socket.emit("leaderboard-update", { req: "update-leaderboard-pls" });  // ask ws server for new leaderboard data  
  //   }


  useEffect(() => {
    const handleIncomingLeaderboardMsg = (data: {
      response: string;
    }) => {
      if (data.response == "Success") {
        console.log("user's new score was saved into database");
        console.log("fetching new leaderboard data...");
        console.log(trpc.leaderboard.topPlayers.query());
      } else if (data.response == "Fail") {
        console.log("user's new score unable to be saved into database");
        console.log("NOT fetching new leaderboard data");
      }
    };

    socket.on("leaderboard-update-from-server", handleIncomingLeaderboardMsg);  // receive leaderboard data
  }, [])

  const lebron = async() => {
    try {
      const timestamp = await trpc.leaderboard.test.query();
      console.log("fetched timestamp");
      console.log(timestamp);
    } catch (error) {
      console.log("unable to fetch user data: ", error)
    }
  }

  const getTopPlayers = async() => {
    try {
      const topPlayers = await trpc.leaderboard.topPlayers.query();
      console.log("fetched top players timestamp");
      console.log(topPlayers);
    } catch (error) {
      console.log("unable to fetch top players: ", error)
    }
    console.log("penis");
  }

  const saveScore = async() => {
    try {
      const newScoreID = await trpc.leaderboard.saveScore.mutate({
        user_id: 2,
        game_id: 2,
        points: 10
      });
      console.log("created new score record; new score ID: " + newScoreID);
    } catch (error) {
      console.log("unable to create new user: ", error);
    }
  }

  return (
    <div className="bg-[#B9C0DA] min-w-screen min-h-screen flex flex-col items-center">
      <div className="flex flex-col justify-center w-[90vw] lg:w-[35vw] p-5 items-center bg-white rounded-lg mt-20">

      <button
        type="button"
        className="bg-gray-500 hover:bg-gray-300 text-white font-bold py-2 px-4 rounded-lg text-[1.5rem] cursor-pointer"
        onClick={() => {
          getTopPlayers();
        }}>Save New Score
      </button>

      </div>
    </div>
  );
};

export default test;
