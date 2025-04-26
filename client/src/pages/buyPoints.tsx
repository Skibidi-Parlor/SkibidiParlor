import { useState, useEffect } from "react";
import { trpc } from "../api";
import { socket } from "../socket";
import ShouldBeLoggedIn from "../helpers/ShouldBeLoggedIn";
import MyPaymentForm from "../components/square/MyPaymentForm";

const BuyPoints = () => {
  ShouldBeLoggedIn(true);

  const userID = Number(localStorage.getItem("userID")) || 0;

  const [allTimeScore, setAllTimeScore] = useState(0);
  const [desiredPoints, setDesiredPoints] = useState(0);
  const [newTotal, setNewTotal] = useState(0);

  useEffect(() => {
    socket.emit("user-score-update-from-backend", {
      response: "Success",
      userID,
    });

    const handleUpdate = async (data: { response: string; userID: number }) => {
      if (data.response === "Success") {
        const res = await trpc.user.totalPoints.query(userID);
        setAllTimeScore(res.total_points);
        if (userID === data.userID) {
          setNewTotal(res.total_points);
        }
      }
    };

    socket.on("user-score-update-from-server", handleUpdate);
    socket.on("leaderboard-update-from-server", handleUpdate);

    return () => {
      socket.off("user-score-update-from-server", handleUpdate);
      socket.off("leaderboard-update-from-server", handleUpdate);
    };
  }, [userID]);

  const purchase = async () => {
    await trpc.leaderboard.saveScore.mutate({
      user_id: Number(localStorage.getItem("userID")),
      game_id: -1,
      points: Number(desiredPoints),
    });
    alert(
      "Purchase Succesful, " +
        desiredPoints +
        " points has been added to your account"
    );
  };

  return (
    <div className="bg-gradient-to-b from-[#7134DD] to-[#AF9CCF] min-h-screen flex flex-col items-center justify-start px-6 py-12 text-white">
      <h1 className="text-4xl font-bold mb-6 text-center">Buy More Points</h1>
      <div className="bg-white text-black rounded-lg shadow-lg p-8 max-w-md w-full text-center">
        <h2 className="text-2xl font-semibold mb-4">
          Current Balance:{" "}
          <span className="font-bold text-green-500">{allTimeScore}</span>
        </h2>
        <h3 className="text-xs">
          Select amount of points you would like to purchase
        </h3>
        <input
          type="number"
          min={0}
          value={desiredPoints}
          onChange={(e) => {
            setDesiredPoints(e.target.value as unknown as number);
            setNewTotal(Number(e.target.value) + Number(allTimeScore));
          }}
          placeholder="Enter amount of points"
          className="w-full p-3 border border-gray-300 rounded-md mb-4 text-lg"
        />
        <div className="text-lg mb-4">
          <p>New Balance: {newTotal}</p>
        </div>
        <div className="text-xl text-green-500 mb-4">
          <p>({desiredPoints ? desiredPoints : 0} extra points)</p>
        </div>

        <p>
          Total Cost:
          <span className="font-bold">
            {" "}
            <span className="underline">${desiredPoints * 0.25}</span>
          </span>
        </p>

        <br />

        <label>Enter Card Information</label>
        <MyPaymentForm purchase={purchase} />
      </div>
    </div>
  );
};

export default BuyPoints;
