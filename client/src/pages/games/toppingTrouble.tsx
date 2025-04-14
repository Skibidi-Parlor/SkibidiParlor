import { useNavigate } from "react-router-dom";
import ShouldBeLoggedIn from "../../helpers/ShouldBeLoggedIn";
import Button from "../../components/games/slice_sweeper/Button";
import { useEffect, useState } from "react";
import { faQuestionCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Modal from "../../components/ui/Modal";

const ToppingTrouble = () => {
  ShouldBeLoggedIn(true);
  const navigate = useNavigate();
  const basil = "/games/ToppingTrouble/Basil.png";
  const mushroom = "/games/ToppingTrouble/Mushroom.png";
  const onion = "/games/ToppingTrouble/Onion.png";
  const pepperoni = "/games/ToppingTrouble/Pepperoni.png";
  const pineapple = "/games/ToppingTrouble/Pineapple.png";

  const toppingImages = [basil, mushroom, onion, pepperoni, pineapple];
  const [isShrunk, setIsShrunk] = useState(true);
  const [RNG, setRNG] = useState<number>(0);

  const [showFAQModal, setShowFAQModal] = useState(true);

  const newGame = () => {};

  useEffect(() => {
    const interval = setInterval(() => {
      if (isShrunk) {
        setRNG(Math.floor(Math.random() * 4));
      }
      setIsShrunk((prev) => !prev);
    }, 2000);

    return () => clearInterval(interval);
  }, [isShrunk]);

  return (
    <div className="bg-[#D9D9D9] min-w-screen min-h-screen flex flex-col items-center text-[#D0A26A]">
      <Button
        title="← Back to Menu"
        className="text-xs mt-5 mr-auto"
        onClick={() => navigate("/games")}
      />
      <div className="flex flex-col text-2xl mx-auto mt-10 gap-3 text-center">
        <h1>Topping Trouble</h1>
        <div className="flex mx-auto">
          <h2
            className="text-xl my-auto underline"
            onClick={() => {
              setShowFAQModal(true);
            }}
          >
            How To Play
          </h2>
          <FontAwesomeIcon
            icon={faQuestionCircle}
            className="text-sm my-auto ml-2"
          />
        </div>

        <div className="relative h-[40vh] w-[40vh]">
          <img
            src={toppingImages[RNG]}
            className={`absolute w-[35vw] h-auto z-1 inset-0 m-auto duration-2000 ${
              isShrunk ? "transform-[scale(0)]" : "transform-[scale(1)]"
            }`}
          />

          <img
            src="/games/ToppingTrouble/PlainPizza.png"
            className="absolute inset-0 m-auto w-[75vw] h-auto"
          />
        </div>

        <div className="flex flex-col mx-auto items-center">
          <h4>Code: </h4>
          <Button
            title={`Play Now`}
            className="text-3xl text-white bg-[#C28843] px-6 py-3 rounded-lg"
            onClick={newGame}
          />
          <Button
            title={`Join Game`}
            className="text-3xl text-white bg-[#C28843] px-6 py-3 rounded-lg"
            onClick={newGame}
          />
        </div>
      </div>
      {showFAQModal && (
        <Modal
          isOpen={showFAQModal}
          onClose={() => {
            setShowFAQModal(false);
          }}
        >
          <h1 className="text-center underline text-3xl text-black">
            How To Play
          </h1>
          <ul className="text-black">
            <li className="mx-3 my-auto">
              - Topping Trouble! A 2 person memory game battle!
            </li>
            <li className="mx-3 my-auto mt-2">
              - One person selects a topping, the next person has to select ALL
              the previous toppings + a new one and vise versa
            </li>
            <li className="mx-3 my-auto mt-2">
              - Ex:{" "}
              <li className="mx-3 my-auto text-xs"> Player 1: Pepperoni</li>
              <li className="mx-3 my-auto text-xs">
                Player2: Pepperoni + Pineapple
              </li>
              <li className="mx-3 my-auto text-xs">
                Player3: Pepperoni + Pineapple + Basil
              </li>
              <li className="mx-3 my-auto text-xs">
                Player4: Pepperoni + Pineapple + Basil + Pineapple...
              </li>
            </li>
            <li className="mx-3 my-aut mt-2">
              -First one to select a wrong topping, or run out of time loses!
              The winner will earn points equal to the amount of toppings that
              were in queue
            </li>
            <li className="mx-3 my-aut mt-2">- Good Luck!</li>
          </ul>
        </Modal>
      )}
    </div>
  );
};

export default ToppingTrouble;
