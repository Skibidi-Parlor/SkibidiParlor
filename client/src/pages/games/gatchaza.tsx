import React, { useState } from "react";
import { motion, useAnimation, spring } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import oar from "../../components/games/gatchaza/oar.png";
import bricks from "../../components/games/gatchaza/bricks.png";
import oarpizza from "../../components/games/gatchaza/oarpizza.png";
import oven from "../../components/games/gatchaza/oven.png";
import card from "../../components/games/gatchaza/card.png";
import cheese from "../../components/games/gatchaza/cheese.png";
import veggie from "../../components/games/gatchaza/veggie.png";
import vegan from "../../components/games/gatchaza/vegan.png";
import supreme from "../../components/games/gatchaza/supreme.png";
import stuffedpep from "../../components/games/gatchaza/stuffedpep.png";
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

const Gatchaza = () => {
  const buttonControls = useAnimation();
  const [buttonPressed, setButtonPressed] = useState(false);
  const [pizzaBaked, setPizzaBaked] = useState(false);
  const [gatchaPulled, setGatchaPulled] = useState(false);
  const [howToPlay, setHowToPlay] = useState(false);
  const [pizzaCollection, setPizzaCollection] = useState(false);
  const handleBake = () => {
    setButtonPressed(true);
    buttonControls.start({ opacity: 0 });
  };

  const startGame = () => {
    setHowToPlay(true);
  };

  const pizzaBake = () => {
    setPizzaBaked(true);
  };

  const openPizza = () => {
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

  const [image, setImage] = useState("");
  const [imageTitle, setImageTitle] = useState("");

  const gatcha = () => {
    setGatchaPulled(true);
    const num = Math.floor(Math.random() * choices.length);
    if (choices[num] == 2) {
      const pick = Math.floor(Math.random() * twoStars.length);
      setImage(twoStars[pick]);
      setImageTitle(twoStarsNames[pick]);
    } else if (choices[num] == 3) {
      const pick = Math.floor(Math.random() * threeStars.length);
      setImage(threeStars[pick]);
      setImageTitle(threeStarsNames[pick]);
    } else if (choices[num] == 4) {
      const pick = Math.floor(Math.random() * fourStars.length);
      setImage(fourStars[pick]);
      setImageTitle(fourStarsNames[pick]);
    } else {
      const pick = Math.floor(Math.random() * fiveStars.length);
      setImage(fiveStars[pick]);
      setImageTitle(fiveStarsNames[pick]);
    }
  };

  const restart = () => {
    setButtonPressed(false);
    setPizzaBaked(false);
    setGatchaPulled(false);
    setImage("");
    setImageTitle("");
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
            <button
              className="py-2 px-5 mt-5 rounded-2xl bg-[#FFE49A] hover:bg-[#FFE49A]"
              onClick={startGame}
            >
              Close
            </button>
          </div>
        )}

        {pizzaCollection && (
          <div className="z-5 bg-white absolute p-4 rounded-3xl text-center">
            <div className="flex flex-row justify-center">
              <div className="w-[20vw] md:w-[5vw]">
                40%
                <img src={dough}></img>
                <img src={sauce}></img>
                <img src={cheese}></img>
                <img src={mozz}></img>
              </div>
              <div className="w-[20vw md:w-[5vw]">
                30%
                <img src={pepperoni}></img>
                <img src={sausage}></img>
                <img src={mushroom}></img>
                <img src={onion}></img>
                <img src={bellpepper}></img>
                <img src={olive}></img>
              </div>
              <div className="w-[20vw] md:w-[5vw]">
                20%
                <img src={meatlovers}></img>
                <img src={hawaiian}></img>
                <img src={magarita}></img>
                <img src={combination}></img>
                <img src={veggie}></img>
                <img src={vegan}></img>
              </div>
              <div className="w-[20vw] md:w-[5vw]">
                10%
                <img src={supreme}></img>
                <img src={bbq}></img>
                <img src={buffalo}></img>
                <img src={bubba}></img>
                <img src={elote}></img>
                <img src={blt}></img>
              </div>
            </div>
            <button
              className="py-2 px-5 mt-5 rounded-2xl bg-[#FFE49A] hover:bg-[#FFE49A]"
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
              Bake Pizza
            </motion.button>
          </>
        )}

        {buttonPressed && (
          <>
            <motion.img
              className="absolute md:w-[25vw]"
              src={oar}
              initial={{ y: 500, opacity: 1 }}
              animate={{ y: 10, opacity: 0 }}
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
              initial={{ y: 10 }}
              animate={{ y: 325, opacity: 0 }}
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
      </div>
    </>
  );
};

export default Gatchaza;
