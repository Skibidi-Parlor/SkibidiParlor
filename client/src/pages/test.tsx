import { useEffect } from "react";
import { trpc } from "../api";
import { TRPCClientError } from "@trpc/client";
import { useNavigate } from "react-router-dom";

const test = () => {

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
        user_id: 1,
        game_id: 2,
        points: 69
      });
      console.log("created new score record; new score ID: " + newScoreID.rows[0].id);
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
          saveScore();
        }}>Save New Score
      </button>

      </div>
    </div>
  );
};

export default test;
