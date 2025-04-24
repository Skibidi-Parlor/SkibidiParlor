import { useEffect, useState } from "react";
import { trpc } from "../api";
import { socket } from "../socket";
import ShouldBeLoggedIn from "../helpers/ShouldBeLoggedIn";

import Modal from "../components/ui/Modal";
import PfpShopCard from "../components/games/pfpshowcase";
import PizzaPurchase from "../components/games/PizzaPurchase";
import { UserModel } from "../../shared/src/models";

const Store = () => {
  ShouldBeLoggedIn(true);

  const [allTimeScore, setAllTimeScore] = useState(0);
  const userID = Number(localStorage.getItem("userID")) as unknown as number;
  const [showNoMoneyModal, setShowNoMoneyModal] = useState(false);
  const [user, setUser] = useState<UserModel>();

  useEffect(() => {
    socket.emit("user-score-update-from-backend", {
      response: "Success",
      userID: userID,
    });
    const handleUpdate = async (data: { response: string; userID: number }) => {
      if (data.userID === Number(localStorage.getItem("userID"))) {
        const user = await trpc.user.byID.query(data.userID);

        setUser(user.rows[0]);
      }
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

  const purchase = async (pfp: string, price: number, name: string) => {
    confirm(`Are you sure you want to purchase ${name}`);
    if (allTimeScore < 50) {
      setShowNoMoneyModal(true);
      return;
    }
    try {
      await trpc.leaderboard.saveScore.mutate({
        user_id: Number(localStorage.getItem("userID")),
        game_id: -1,
        points: price * -1,
      });
      await trpc.user.update.mutate({
        id: Number(localStorage.getItem("userID")),
        pfp_path: pfp,
      });
      alert("Purchase Succesful!");
    } catch (error) {
      alert(error);
    }
  };

  const pizza = async (pizza: keyof UserModel, price: number, name: string) => {
    confirm(`Are you sure you want to purchase ${name}`);
    if (allTimeScore < 50) {
      setShowNoMoneyModal(true);
      return;
    }
    try {
      await trpc.leaderboard.saveScore.mutate({
        user_id: Number(localStorage.getItem("userID")),
        game_id: -1,
        points: price * -1,
      });
      console.log([pizza], user?.[pizza]);
      const hi = await trpc.user.update.mutate({
        id: Number(localStorage.getItem("userID")),
        [pizza]: user?.[pizza] ? (user?.[pizza] as unknown as number) + 1 : 1,
      });
      console.log(hi);
      alert("Purchase Succesful!");
    } catch (error) {
      alert(error);
    }
  };

  return (
    <>
      <div className="bg-linear-to-b h-screen from-[#7134DD] to-[#AF9CCF] min-w-screen min-h-screen flex flex-col items-center">
        <h1 className="text-7xl mt-15">Store </h1>
        <h2 className="text-xl">Your Score: {allTimeScore}</h2>
        <h3 className="mx-10 mb-10">
          All Purchases are one time purchases and will have to be purchased
          again if replaced
        </h3>

        <div className="flex flex-col gap-5 mx-5 overflow-scroll mb-5">
          <PfpShopCard
            imageUrl="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTcbg2z5yV-reM3XdYXgshvaxxo5eB4m3k1Mw&s"
            price={10}
            name="Fortnite Girl (PFP)"
            onBuy={() => {
              purchase(
                "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTcbg2z5yV-reM3XdYXgshvaxxo5eB4m3k1Mw&s",
                10,
                "Fortnite Girl"
              );
            }}
          />
          <PfpShopCard
            imageUrl="https://comicbook.com/wp-content/uploads/sites/4/2023/10/bd75c33f-599d-4301-807b-8acdab12d1b8.jpg?w=1024"
            price={10}
            name="Pikachu Van Gogh (PFP)"
            onBuy={() => {
              purchase(
                "https://comicbook.com/wp-content/uploads/sites/4/2023/10/bd75c33f-599d-4301-807b-8acdab12d1b8.jpg?w=1024",
                10,
                "Pikachu Van Gogh"
              );
            }}
          />
          <PfpShopCard
            imageUrl="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSKuECn0lzZKB4t34yzTn9MIba6GzFYgruxBGSa8JxSDhCHhqhn87BnQ_coXh8EbO9d32U&usqp=CAU"
            price={10}
            name="Severance (PFP)"
            onBuy={() => {
              purchase(
                "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSKuECn0lzZKB4t34yzTn9MIba6GzFYgruxBGSa8JxSDhCHhqhn87BnQ_coXh8EbO9d32U&usqp=CAU",
                10,
                "Severance"
              );
            }}
          />
          <PizzaPurchase
            pizza="buffalo"
            price={30}
            name="Buffalo (collection)"
            onBuy={() => {
              pizza("buffalo", 30, "buffalo");
            }}
          />
          <PizzaPurchase
            pizza="bbq"
            price={30}
            name="BBQ (collection)"
            onBuy={() => {
              pizza("bbq", 30, "bbq");
            }}
          />
          <PizzaPurchase
            pizza="elote"
            price={30}
            name="Elote (collection)"
            onBuy={() => {
              pizza("elote", 30, "elote");
            }}
          />
          <PizzaPurchase
            pizza="bubba"
            price={30}
            name="Bubba (collection)"
            onBuy={() => {
              pizza("bubba", 30, "bubba");
            }}
          />
          <PizzaPurchase
            pizza="supreme"
            price={30}
            name="Supreme (collection)"
            onBuy={() => {
              pizza("supreme", 30, "supreme");
            }}
          />
          <PizzaPurchase
            pizza="blt"
            price={30}
            name="BLT (collection)"
            onBuy={() => {
              pizza("blt", 30, "blt");
            }}
          />
        </div>
      </div>

      {showNoMoneyModal && (
        <Modal
          isOpen={showNoMoneyModal}
          onClose={() => {
            setShowNoMoneyModal(false);
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

export default Store;
