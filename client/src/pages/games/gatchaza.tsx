import { useEffect, useState } from "react";
import { motion, useAnimation } from "framer-motion";
// import { Link, useNavigate } from "react-router-dom";
import oar from "../../components/games/gatchaza/oar.png";
// import bricks from "../../components/games/gatchaza/bricks.png";
import oarpizza from "../../components/games/gatchaza/oarpizza.png";
import oven from "../../components/games/gatchaza/oven.png";
// import card from "../../components/games/gatchaza/card.png";
import cheese from "../../components/games/gatchaza/cheese.png";
import veggie from "../../components/games/gatchaza/veggie.png";
import vegan from "../../components/games/gatchaza/vegan.png";
import supreme from "../../components/games/gatchaza/supreme.png";
// import stuffedpep from "../../components/games/gatchaza/stuffedpep.png";
import sausage from "../../components/games/gatchaza/sausage.png";
import sauce from "../../components/games/gatchaza/sauce.png";
import pepperoni from "../../components/games/gatchaza/pepperoni.png";
import onion from "../../components/games/gatchaza/onion.png";
import olive from "../../components/games/gatchaza/olive.png";
import mushroom from "../../components/games/gatchaza/mushroom.png";
import mozz from "../../components/games/gatchaza/mozz.png";
import meatlovers from "../../components/games/gatchaza/meatlovers.png";
import magarita from "../../components/games/gatchaza/magarita.png";
import hawaiian from "../../components/games/gatchaza/hawaiian.png";
import elote from "../../components/games/gatchaza/elote.png";
import dough from "../../components/games/gatchaza/dough.png";
import combination from "../../components/games/gatchaza/combination.png";
import buffalo from "../../components/games/gatchaza/buffalo.png";
import bubba from "../../components/games/gatchaza/bubba.png";
import blt from "../../components/games/gatchaza/blt.png";
import bellpepper from "../../components/games/gatchaza/bellpepper.png";
import bbq from "../../components/games/gatchaza/bbq.png";
import { useNavigate } from "react-router-dom";
import { socket } from "../../socket";
import { trpc } from "../../api";
import { UserModel } from "../../../shared/src/models";
import Modal from "../../components/ui/Modal";
import Button from "../../components/games/slice_sweeper/Button";
import ShouldBeLoggedIn from "../../helpers/ShouldBeLoggedIn";

const Gatchaza = () => {
  ShouldBeLoggedIn(true);

  const pizzaAudio = new Audio("/games/Gatchaza/pizza.mp3");
  const fireAudio = new Audio("/games/Gatchaza/fire.mp3");

  const navigate = useNavigate();
  const buttonControls = useAnimation();
  const [buttonPressed, setButtonPressed] = useState(false);
  const [pizzaBaked, setPizzaBaked] = useState(false);
  const [gatchaPulled, setGatchaPulled] = useState(false);
  const [howToPlay, setHowToPlay] = useState(false);
  const [pizzaCollection, setPizzaCollection] = useState(false);
  const [userData, setUserData] = useState<UserModel>();

  const userID = Number(localStorage.getItem("userID")) as unknown as number;
  const [score, setScore] = useState(0);
  const [allTimeScore, setAllTimeScore] = useState<number>(0);

  const [noPointsModal, setNoPointsModal] = useState(false);
  const [typeOfPizzaModal, setTypeOfPizzaModal] = useState(false);

  useEffect(() => {
    fetchUserData();
  }, []);

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

  const fetchUserData = async () => {
    try {
      const res = await trpc.user.byID.query(userID);

      setUserData(res.rows[0]);
    } catch (error) {
      alert("Unable to fetch user's collection" + error);
    }
  };

  const handleBake = async () => {
    if (allTimeScore < 7) {
      setNoPointsModal(true);
      return;
    }
    try {
      const newScoreID = await trpc.leaderboard.saveScore.mutate({
        user_id: Number(localStorage.getItem("userID")),
        game_id: 4,
        points: -7,
      });
      setAllTimeScore((prev) => prev - 7);
      console.log("created new score record; new score ID: " + newScoreID);
    } catch (error) {
      console.log("unable to create new user: ", error);
    }
    setButtonPressed(true);
    buttonControls.start({ opacity: 0 });
    fireAudio.play();
    await new Promise((r) => setTimeout(r, 5000));
    pizzaAudio.play();
    setButtonPressed(false);
    setPizzaBaked(false);
  };

  const startGame = () => {
    setHowToPlay(true);
  };

  const pizzaBake = () => {
    setPizzaBaked(true);
  };

  const openPizza = () => {
    fetchUserData();
    setPizzaCollection(true);
  };

  const closePizza = () => {
    setPizzaCollection(false);
  };

  const choices = [2, 3, 4, 5, 2, 3, 4, 2, 3, 2];
  const twoStars = [cheese, dough, mozz, sauce];
  const twoStarsNames = [
    "Cheese Pizza",
    "Pizza Dough",
    "Mozzerella Pizza",
    "Sauce Only Pizza",
  ];
  const threeStars = [onion, pepperoni, sausage, mushroom, bellpepper, olive];
  const threeStarsNames = [
    "Onion Pizza",
    "Pepperoni Pizza",
    "Sausage Pizza",
    "Mushroom Pizza",
    "Bell Pepper Pizza",
    "Olive Pizza",
  ];
  const fourStars = [
    meatlovers,
    hawaiian,
    magarita,
    veggie,
    vegan,
    combination,
  ];
  const fourStarsNames = [
    "Meat Lovers",
    "Hawaiian",
    "Magarita",
    "Veggie",
    "Vegan",
    "Discontinued Costco Combination Pizza",
  ];
  const fiveStars = [buffalo, bbq, elote, bubba, supreme, blt];
  const fiveStarsNames = ["Buffalo", "BBQ", "Elote", "Bubba", "Supreme", "BLT"];

  const [selectedPizzaKey, setSelectedPizzaKey] = useState<string | null>(null);

  const openPizzaModal = (pizzaKey: string) => {
    setSelectedPizzaKey(pizzaKey);
    setTypeOfPizzaModal(true);
  };

  const closePizzaModal = () => {
    setTypeOfPizzaModal(false);
    setSelectedPizzaKey(null);
  };
  const stringFormat = {
    cheesepizza: "Cheese Pizza",
    pizzadough: "Pizza Dough",
    mozzerellapizza: "Mozzerella Pizza",
    sauceonlypizza: "Sauce Only Pizza",

    onionpizza: "Onion Pizza",
    pepperonipizza: "Pepperoni Pizza",
    sausagepizza: "Sausage Pizza",
    mushroompizza: "Mushroom Pizza",
    bellpepperpizza: "Bell Pepper Pizza",
    olivepizza: "Olive Pizza",

    meatlovers: "Meat Lovers",
    hawaiian: "Hawaiian",
    magarita: "Magarita",
    veggie: "Veggie",
    vegan: "Vegan",
    discontinuedcostcocombinationpizza: "Discontinued Costco Combination Pizza",

    buffalo: "Buffalo",
    bbq: "BBQ",
    elote: "Elote",
    bubba: "Bubba",
    supreme: "Supreme",
    blt: "BLT",
  };

  const [image, setImage] = useState("");
  const [imageTitle, setImageTitle] = useState("");

  const gatcha = async () => {
    setGatchaPulled(true);
    const num = Math.floor(Math.random() * choices.length);
    let res = 0;
    let choice;
    if (choices[num] == 2) {
      const pick = Math.floor(Math.random() * twoStars.length);
      setImage(twoStars[pick]);
      choice = twoStarsNames[pick];
      setImageTitle(choice);
      setScore(4);
      res = 4;
      setAllTimeScore((prev) => prev + 4);
    } else if (choices[num] == 3) {
      const pick = Math.floor(Math.random() * threeStars.length);
      setImage(threeStars[pick]);
      choice = threeStarsNames[pick];
      setImageTitle(choice);
      setScore(6);
      res = 6;
      setAllTimeScore((prev) => prev + 6);
    } else if (choices[num] == 4) {
      const pick = Math.floor(Math.random() * fourStars.length);
      setImage(fourStars[pick]);
      choice = fourStarsNames[pick];
      setImageTitle(choice);
      setScore(15);
      res = 15;
      setAllTimeScore((prev) => prev + 15);
    } else {
      const pick = Math.floor(Math.random() * fiveStars.length);
      setImage(fiveStars[pick]);
      choice = fiveStarsNames[pick];
      setImageTitle(choice);
      setScore(20);
      res = 20;
      setAllTimeScore((prev) => prev + 20);
    }

    try {
      const newScoreID = await trpc.leaderboard.saveScore.mutate({
        user_id: Number(localStorage.getItem("userID")),
        game_id: 4,
        points: res,
      });

      const key = choice
        .replace(/\s|t/g, "")
        .toLocaleLowerCase() as keyof UserModel;

      const updatedUser = await trpc.user.update.mutate({
        id: Number(localStorage.getItem("userID")),
        [key]: Number(userData![key]) + 1,
      });

      console.log("created new score record; new score ID: " + newScoreID);
      console.log("created new pizza; user: " + updatedUser);
    } catch (error) {
      console.log("unable to create new user: ", error);
    }
  };

  const restart = () => {
    setButtonPressed(false);
    setPizzaBaked(false);
    setGatchaPulled(false);
    setImage("");
    setImageTitle("");
    setScore(0);
    console.log("Here");
  };

  return (
    <>
      <div className="w-[100vw] h-[100vh] bg-[#c85252] flex flex-col items-center justify-center overflow-clip relative">
        <div>
          <button
            className="bg-white rounded-2xl px-2 py-2 "
            onClick={() => navigate("/games")}
          >
            Back to Menu
          </button>
          <button
            className="ml-3 bg-white rounded-2xl px-2 py-2"
            onClick={openPizza}
          >
            Pizza Collection
          </button>
        </div>

        {allTimeScore && (
          <h2 className="text-white text-center mt-3">
            Your points: {allTimeScore}
          </h2>
        )}

        {!howToPlay && (
          <div className="bg-white p-5 rounded-4xl absolute z-2 text-center pt-5">
            <h1 className="text-3xl font-extrabold">How To Play</h1>
            <p>It costs 7 points to play</p>
            <p>Press the button "Bake Pizza"</p>
            <p>
              Depending on the Rarity, you'll receive a # of points that'll be
              added to your score
            </p>
            <p className="underline mt-4 text-2xl font-extrabold">Point Key</p>
            <p> Two Stars: 4 points </p>
            <p> Three Stars: 6 points </p>
            <p> Four Stars: 15 points </p>
            <p> Five Stars: 20 points </p>
            <p>Collect all the possible pizzas possible</p>
            <button
              className="py-2 px-5 mt-5 rounded-2xl bg-[#FFE49A] hover:bg-[#FFE49A]"
              onClick={startGame}
            >
              Close
            </button>
          </div>
        )}

        {pizzaCollection && (
          <div className="z-5 bg-white absolute p-4 rounded-3xl text-center border">
            <div className="flex flex-row items-center justify-center gap-2 p-3 rounded-xl">
              <div
                className="flex flex-col w-12 cursor-pointer"
                onClick={() => openPizzaModal("pizzadough")}
              >
                <img src={dough} className="w-12" />
                <span className="text-sm">{userData?.pizzadough}</span>
              </div>
              <div
                className="flex flex-col w-12 cursor-pointer"
                onClick={() => openPizzaModal("sauceonlypizza")}
              >
                <img src={sauce} className="w-12" />
                <span className="text-sm">{userData?.sauceonlypizza}</span>
              </div>
              <div
                className="flex flex-col w-12 cursor-pointer"
                onClick={() => openPizzaModal("cheesepizza")}
              >
                <img src={cheese} className="w-12" />
                <span className="text-sm">{userData?.cheesepizza}</span>
              </div>
              <div
                className="flex flex-col w-12 cursor-pointer"
                onClick={() => openPizzaModal("mozzerellapizza")}
              >
                <img src={mozz} className="w-12" />
                <span className="text-sm">{userData?.mozzerellapizza}</span>
              </div>
            </div>

            <div className="flex flex-row items-center justify-center gap-2 p-3 rounded-xl">
              <div
                className="flex flex-col w-12 cursor-pointer"
                onClick={() => openPizzaModal("onionpizza")}
              >
                <img src={onion} className="w-12" />
                <span className="text-sm">{userData?.onionpizza}</span>
              </div>
              <div
                className="flex flex-col w-12 cursor-pointer"
                onClick={() => openPizzaModal("pepperonipizza")}
              >
                <img src={pepperoni} className="w-12" />
                <span className="text-sm">{userData?.pepperonipizza}</span>
              </div>
              <div
                className="flex flex-col w-12 cursor-pointer"
                onClick={() => openPizzaModal("sausagepizza")}
              >
                <img src={sausage} className="w-12" />
                <span className="text-sm">{userData?.sausagepizza}</span>
              </div>
              <div
                className="flex flex-col w-12 cursor-pointer"
                onClick={() => openPizzaModal("mushroompizza")}
              >
                <img src={mushroom} className="w-12" />
                <span className="text-sm">{userData?.mushroompizza}</span>
              </div>
              <div
                className="flex flex-col w-12 cursor-pointer"
                onClick={() => openPizzaModal("bellpepperpizza")}
              >
                <img src={bellpepper} className="w-12" />
                <span className="text-sm">{userData?.bellpepperpizza}</span>
              </div>
              <div
                className="flex flex-col w-12 cursor-pointer"
                onClick={() => openPizzaModal("olivepizza")}
              >
                <img src={olive} className="w-12" />
                <span className="text-sm">{userData?.olivepizza}</span>
              </div>
            </div>

            <div className="flex flex-row items-center justify-center gap-2 p-3 rounded-xl">
              <div
                className="flex flex-col w-12 cursor-pointer"
                onClick={() => openPizzaModal("meatlovers")}
              >
                <img src={meatlovers} />
                <span className="text-sm">{userData?.meatlovers}</span>
              </div>
              <div
                className="flex flex-col w-12 cursor-pointer"
                onClick={() => openPizzaModal("hawaiian")}
              >
                <img src={hawaiian} className="w-12" />
                <span className="text-sm">{userData?.hawaiian}</span>
              </div>
              <div
                className="flex flex-col w-12 cursor-pointer"
                onClick={() => openPizzaModal("magarita")}
              >
                <img src={magarita} className="w-12" />
                <span className="text-sm">{userData?.magarita}</span>
              </div>
              <div
                className="flex flex-col w-12 cursor-pointer"
                onClick={() => openPizzaModal("veggie")}
              >
                <img src={veggie} className="w-12" />
                <span className="text-sm">{userData?.veggie}</span>
              </div>
              <div
                className="flex flex-col w-12 cursor-pointer"
                onClick={() => openPizzaModal("vegan")}
              >
                <img src={vegan} className="w-12" />
                <span className="text-sm">{userData?.vegan}</span>
              </div>
              <div
                className="flex flex-col w-12 cursor-pointer"
                onClick={() =>
                  openPizzaModal("discontinuedcostcocombinationpizza")
                }
              >
                <img src={combination} className="w-12" />
                <span className="text-sm">
                  {userData?.discontinuedcostcocombinationpizza}
                </span>
              </div>
            </div>

            <div className="flex flex-row items-center justify-center gap-2 p-3 rounded-xl">
              <div
                className="flex flex-col w-12 cursor-pointer"
                onClick={() => openPizzaModal("buffalo")}
              >
                <img src={buffalo} className="w-12" />
                <span className="text-sm">{userData?.buffalo}</span>
              </div>
              <div
                className="flex flex-col w-12 cursor-pointer"
                onClick={() => openPizzaModal("bbq")}
              >
                <img src={bbq} className="w-12" />
                <span className="text-sm">{userData?.bbq}</span>
              </div>
              <div
                className="flex flex-col w-12 cursor-pointer"
                onClick={() => openPizzaModal("elote")}
              >
                <img src={elote} className="w-12" />
                <span className="text-sm">{userData?.elote}</span>
              </div>
              <div
                className="flex flex-col w-12 cursor-pointer"
                onClick={() => openPizzaModal("bubba")}
              >
                <img src={bubba} className="w-12" />
                <span className="text-sm">{userData?.bubba}</span>
              </div>
              <div
                className="flex flex-col w-12 cursor-pointer"
                onClick={() => openPizzaModal("supreme")}
              >
                <img src={supreme} className="w-12" />
                <span className="text-sm">{userData?.supreme}</span>
              </div>
              <div
                className="flex flex-col w-12 cursor-pointer"
                onClick={() => openPizzaModal("blt")}
              >
                <img src={blt} className="w-12" />
                <span className="text-sm">{userData?.blt}</span>
              </div>
            </div>

            <button
              className="py-2 px-5 mt-1 rounded-2xl bg-[#FFE49A] hover:bg-[#FFE49A]"
              onClick={closePizza}
            >
              Close
            </button>
          </div>
        )}

        {!gatchaPulled && (
          <>
            <motion.img src={oven} className="z-1 md:w-[25vw] w-[90vw]" />
            <motion.button
              className="mt-5 mb-40 md:mb-30 p-5 bg-[#FFE49A] rounded-2xl font-extrabold text-2xl"
              onClick={handleBake}
              animate={buttonControls}
              initial={{ opacity: 1 }}
              whileHover={{ scale: 1.1 }}
            >
              Bake Pizza (7 Points)
            </motion.button>
          </>
        )}

        {buttonPressed && (
          <>
            <motion.img
              className="absolute md:w-[25vw]"
              src={oar}
              initial={{ y: 500, opacity: 1 }}
              animate={{ y: 40, opacity: 0 }}
              transition={{
                y: { duration: 1.5 },
                opacity: { duration: 0, delay: 1.5 },
              }}
              onAnimationComplete={pizzaBake}
            />
          </>
        )}
        {pizzaBaked && (
          <>
            <motion.img
              className="absolute md:w-[25vw]"
              src={oarpizza}
              initial={{ y: 40 }}
              animate={{ y: 350, opacity: 0 }}
              transition={{
                y: { duration: 1.5 },
                opacity: { duration: 0, delay: 1.5 },
              }}
              onAnimationComplete={gatcha}
            />
          </>
        )}

        {gatchaPulled && (
          <>
            <motion.img
              src={image}
              className="md:w-[25vw]"
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 0.9 }}
              transition={{ duration: 2, type: "spring", bounce: 0.5 }}
            />
            <motion.div
              className="font-extrabold text-3xl text-center"
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              transition={{ duration: 2, type: "spring", bounce: 0.5 }}
            >
              {imageTitle}
            </motion.div>
            <div>Your Score: {score}</div>
            <motion.button
              className="mt-5 p-5 bg-[#FFE49A] rounded-2xl font-extrabold text-3xl hover:bg-[#ffe395] x-3"
              onClick={restart}
              initial={{ x: 300 }}
              animate={{ x: 0 }}
              transition={{ duration: 2, type: "spring", bounce: 0.5 }}
              whileHover={{ scale: 1.1 }}
            >
              Restart
            </motion.button>
          </>
        )}
        {noPointsModal && (
          <Modal
            isOpen={noPointsModal}
            onClose={() => {
              setNoPointsModal(false);
            }}
          >
            <div className="flex flex-col items-center">
              <h1 className="text-center underline text-3xl text-red-500">
                Out of Points {":("}
              </h1>
              <h2 className="text-center text-xl text-red-500">
                Need <b>{7 - allTimeScore} </b>more points to play
              </h2>
              <Button
                title={`Play Other Games`}
                className="text-3xl text-white animate-gradient bg-clip-text transition-all duration-500 px-6 py-3 rounded-lg"
                onClick={() => {
                  navigate("/games");
                }}
              />
            </div>
          </Modal>
        )}
        {typeOfPizzaModal && selectedPizzaKey && (
          <Modal isOpen={typeOfPizzaModal} onClose={closePizzaModal}>
            <div className="flex flex-col items-center justify-center">
              <img
                src={
                  {
                    cheesepizza: cheese,
                    pizzadough: dough,
                    mozzerellapizza: mozz,
                    sauceonlypizza: sauce,
                    onionpizza: onion,
                    pepperonipizza: pepperoni,
                    sausagepizza: sausage,
                    mushroompizza: mushroom,
                    bellpepperpizza: bellpepper,
                    olivepizza: olive,
                    meatlovers: meatlovers,
                    hawaiian: hawaiian,
                    magarita: magarita,
                    veggie: veggie,
                    vegan: vegan,
                    discontinuedcostcocombinationpizza: combination,
                    buffalo: buffalo,
                    bbq: bbq,
                    elote: elote,
                    bubba: bubba,
                    supreme: supreme,
                    blt: blt,
                  }[selectedPizzaKey]
                }
                className="w-40 h-40 mb-4"
              />
              <h1 className="text-2xl font-bold">
                {stringFormat[selectedPizzaKey as keyof typeof stringFormat]}
              </h1>

              <button
                className="mt-5 px-4 py-2 bg-yellow-300 rounded-xl"
                onClick={closePizzaModal}
              >
                Close
              </button>
            </div>
          </Modal>
        )}
      </div>
    </>
  );
};

export default Gatchaza;
