import { useEffect, useState } from "react";
import { trpc } from "../api";
import { socket } from "../socket";
import ProgressBar from "../components/ui/ProgressBar";
import ShouldBeLoggedIn from "../helpers/ShouldBeLoggedIn";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faQuestionCircle } from "@fortawesome/free-solid-svg-icons";
import Modal from "../components/ui/Modal";

const Ranked = () => {
  ShouldBeLoggedIn(true);

  const [allTimeScore, setAllTimeScore] = useState(0);
  const userID = Number(localStorage.getItem("userID")) as unknown as number;
  const [showRankedModal, setShowRankedModal] = useState(false);

  useEffect(() => {
    socket.emit("user-score-update-from-backend", {
      response: "Success",
      userID: userID,
    });
    const handleUpdate = async (data: { response: string; userID: number }) => {
      if (data.response === "Success") {
        const res = await trpc.user.totalPoints.query(userID);
        setAllTimeScore(res.total_points);
      } else if (data.response === "Fail") {
        throw new Error("Failed to fetch");
      }
    };

    socket.on("user-score-update-from-server", handleUpdate);
    socket.on("leaderboard-update-from-server", handleUpdate);

    return () => {
      socket.off("user-score-update-from-server", handleUpdate);
      socket.off("leaderboard-update-from-server", handleUpdate);
    };
  }, [userID]);

  interface RankedDisplayProps {
    value: number;
  }

  interface RankedDisplayProps {
    value: number;
  }

  const RankedDisplay = ({ value }: RankedDisplayProps) => {
    let bgClass = "";

    if (value >= 100) {
      bgClass = "bg-gradient-to-r from-blue-400 via-cyan-400 to-indigo-500";
    } else if (value >= 50) {
      bgClass = "bg-[#ffd700]"; // Gold
    } else if (value >= 25) {
      bgClass = "bg-[#8a8a8a]"; // Silver
    } else {
      bgClass = "bg-[#cd7f32]"; // Bronze
    }

    return (
      <div
        className={`mt-5 h-[60vh] w-[80vw] flex items-center justify-center rounded-2xl ${bgClass}`}
      >
        {value >= 100 ? (
          <div className="flex flex-col text-2xl text-center items-center">
            <h1>PLATINUM PIZZA!!!</h1>
            <img
              src="/PlatinumPizza.gif"
              alt="Platinum Pizza"
              className=" w-[50vw] h-[30vh]"
            />
          </div>
        ) : value >= 50 ? (
          <div className="flex flex-col items-center">
            <h1 className="text-2xl text-center ">Gold Guacamole</h1>
            <h1 className="text-xl text-center ">
              Points left to next rank:{" "}
              <span className="text-red-500">{100 - value}</span>
            </h1>
            <img
              src="/GoldGuacamole.gif"
              alt="Gold Guacamole"
              className=" w-[50vw] h-[30vh]"
            />
          </div>
        ) : value >= 25 ? (
          <div className="flex flex-col items-center">
            <h1 className="text-2xl text-center ">Silver Sauce</h1>
            <h1 className="text-xl text-center ">
              Points left to next rank:{" "}
              <span className="text-red-500">{50 - value}</span>
            </h1>{" "}
            <img
              src="/SilverSauce.gif"
              alt="Saucy Silver"
              className=" w-[50vw] h-[30vh]"
            />
          </div>
        ) : (
          <div className="flex flex-col items-center">
            <h1 className="text-2xl text-center ">Bronze Buns</h1>
            <h1 className="text-xl text-center ">
              Points left to next rank:{" "}
              <span className="text-red-500">{25 - value}</span>
            </h1>{" "}
            <img
              src="/BronzeBuns.gif"
              alt="Bronze Buns"
              className=" w-[50vw] h-[30vh]"
            />
          </div>
        )}
      </div>
    );
  };

  return (
    <>
      <div className="bg-linear-to-b h-screen from-[#7134DD] to-[#AF9CCF] min-w-screen min-h-screen flex flex-col items-center">
        <h1 className="text-5xl mt-15">Ranked/Rewards </h1>
        <h2 className="text-xl">Your Score: {allTimeScore}</h2>
        <span className="text-md">
          Benefits:{" "}
          <FontAwesomeIcon
            icon={faQuestionCircle}
            onClick={() => {
              setShowRankedModal(true);
            }}
          />
        </span>
        <div className="w-[80vw]">
          <ProgressBar value={allTimeScore > 100 ? 100 : allTimeScore} />
        </div>
        <div className="flex flex-col">
          <RankedDisplay value={allTimeScore} />
        </div>
      </div>
      {showRankedModal && (
        <Modal
          isOpen={showRankedModal}
          onClose={() => {
            setShowRankedModal(false);
          }}
        >
          <div className="flex flex-col items-center text-center gap-4 max-w-[80vw] max-h-[80vh] overflow-y-auto p-4 text-black">
            <h2 className="text-3xl font-bold ">Benefits per Rank</h2>
            <h3>All Prizes are accumulative/stack!</h3>
            {[
              {
                title: "🥉 Bronze Buns (0+)",
                perks: ["1 free refill per order", "1 free cookie per day"],
                color: "text-[#cd7f32]",
              },
              {
                title: "🥈 Silver Sauce (25+)",
                perks: [
                  "1 double ice cream per week",
                  "1 Free Topping Upgrade per order",
                ],
                color: "text-[#8a8a8a]",
              },
              {
                title: "🥇 Gold Guacamole (50+)",
                perks: [
                  "10% Off your entire purchase",
                  "1 free hot dog per day",
                ],
                color: "text-[#ffd700]",
              },
              {
                title: "👑 Platinum Pizza (100+)",
                perks: ["1 Free pizza slice a day", "Unlimited Refills!!"],
                color: "text-indigo-500",
              },
            ].map((tier, i) => (
              <div key={i} className="text-left w-full">
                <h3 className={`text-xl font-semibold mb-1 ${tier.color}`}>
                  {tier.title}
                </h3>
                <ul className="list-disc list-inside">
                  {tier.perks.map((perk, j) => (
                    <li key={j}>{perk}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </Modal>
      )}
    </>
  );
};

export default Ranked;
