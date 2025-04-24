import { useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";

import Button from "../../components/games/slice_sweeper/Button";
import DroppingTopping from "../../components/games/toppingDroppings/DroppingTopping";
import { DroppingToppingProps } from "../../components/games/toppingDroppings/DroppingTopping";

import "../../styles/pages/games/topping_droppings.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faQuestionCircle } from "@fortawesome/free-solid-svg-icons";
import { trpc } from "../../api";
import ShouldBeLoggedIn from "../../helpers/ShouldBeLoggedIn";

const ToppingDroppings = () => {
  ShouldBeLoggedIn(true);

  const navigate = useNavigate();

  const [gameStarted, setGameStarted] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);
  const [position, setPosition] = useState<number>(0); // x value position of cursor/touch input
  const [fallSpd, setFallSpd] = useState<number>(3000); // time in ms for each topping to fall from top to bottom
  const [fallFreq, setFallFreq] = useState<number>(1200); // time in ms between each topping drop

  const [toppingObjs, setToppingObjs] = useState<DroppingToppingProps[]>([]);
  const iid = useRef<number>(0); // instance id for each topping, used to identify each topping object

  const [showScoreBoard, setShowScoreBoard] = useState<boolean>(false);
  const [showHowTo, setShowHowTo] = useState<boolean>(false);

  const spdFactor: number = 0.97;
  const minInterval: number = 400;
  const fallFaster: number = 0.93;

  const iterationCounter = useRef<number>(0);

  const pizzaSrc: string = "../../../toppings/pizza.png";

  const toppings: string[] = [
    "../../../toppings/chez.png",
    "../../../toppings/mushroom.png",
    "../../../toppings/Onion.png",
    "../../../toppings/pepperoni.png",
    "../../../toppings/Pineapple.png",
  ];

  const dripAudio = new Audio("/games/ToppingDroppings/drip.mp3");
  const splashAudio = new Audio("/games/ToppingDroppings/splash.mp3");

  // pregame falling toppings
  useEffect(() => {
    if (!gameStarted) {
      setFallFreq(1200);
      // spawns random toppings to fall in idle state
      const spawn = setInterval(() => {
        const randomTopping: number = Math.floor(Math.random() * 5);

        // container for topping images to fit to size
        const xval: number = Math.floor(
          Math.random() * (window.screen.width - 60)
        );

        const enterProps: DroppingToppingProps = {
          coordinates: { x: xval, y: 0 },
          toppingImgSrc: toppings[randomTopping],
          toppingType: randomTopping,
          instanceId: iid.current++,
          collided: false,
          dropTime: 3000,
        };

        setToppingObjs((prev) => [...prev, enterProps]);
      }, 600);

      return () => clearInterval(spawn);
    }
  }, [gameStarted]);

  // in game toppings falling
  useEffect(() => {
    if (gameStarted) {
      function doUrMom() {
        const randomTopping: number = Math.floor(Math.random() * 5);

        const xval: number = Math.floor(
          Math.random() * (window.screen.width - 60)
        );

        const enterProps: DroppingToppingProps = {
          coordinates: { x: xval, y: 0 },
          toppingImgSrc: toppings[randomTopping],
          toppingType: randomTopping,
          instanceId: iid.current++,
          collided: false,
          dropTime: fallSpd,
        };
        setToppingObjs((prev) => [...prev, enterProps]);

        setFallFreq((fallFreq) => {
          const newInterval = fallFreq * spdFactor;
          return Math.max(newInterval, minInterval);
        });

        iterationCounter.current++;
        if (iterationCounter.current % 5 === 0) {
          setFallSpd((fallSpd) => (fallSpd * fallFaster * 2) / 3);
        }
      }
      const doit = setInterval(doUrMom, fallFreq);

      return () => {
        clearInterval(doit);
      };
    }
  }, [fallFreq, gameStarted]);

  // mouse capture / touch capture
  useEffect(() => {
    // set settings
    setScore(0);
    setFallSpd(3000);
    setFallFreq(1200);

    // handle input
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("touchmove", handleTouchMove, { passive: false });
    document.addEventListener("touchstart", handleTouchStart, {
      passive: false,
    });

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("touchmove", handleTouchMove);
      document.removeEventListener("touchstart", handleTouchStart);
    };
  }, []);

  const startGame = () => {
    setToppingObjs([]);
    setGameStarted(true);
    setScore(0);
    setFallSpd(3000);
  };

  const endGame = () => {
    setGameStarted(false);
    setToppingObjs([]);
  };

  useEffect(() => {
    // position pizza catcher to input position
    const pc = document.querySelector<HTMLElement>("#pizza-catcher");
    if (pc) {
      pc.style.left = "" + (position - pc.offsetWidth / 2) + "px";
    }
  });

  useEffect(() => {
    const interval = setInterval(() => {
      checkCollide();
    }, 33); // Check for collisions every 100ms

    return () => clearInterval(interval);
  }, [toppingObjs]);

  const checkCollide = () => {
    const pc = document.querySelector<HTMLElement>("#pizza-catcher");
    if (!pc) return;

    const pcRect = pc.getBoundingClientRect();

    setToppingObjs((prev) =>
      prev.map((topping) => {
        const toppingEl = document.getElementById(
          `container-item-${topping.instanceId}`
        );
        if (!toppingEl) return topping;

        const toppingRect = toppingEl.getBoundingClientRect();

        let isColliding = false;

        if (topping.toppingType === 0) {
          // cheese
          isColliding =
            toppingRect.left < pcRect.right &&
            toppingRect.right > pcRect.left &&
            toppingRect.bottom > pcRect.top - 36.5 &&
            toppingRect.bottom < pcRect.bottom - 36.5;
        } else if (topping.toppingType === 1) {
          // mushroom
          isColliding =
            toppingRect.left < pcRect.right &&
            toppingRect.right > pcRect.left &&
            toppingRect.bottom > pcRect.top - 45.5 &&
            toppingRect.bottom < pcRect.bottom - 45.5;
        } else if (topping.toppingType === 2) {
          // onion
          isColliding =
            toppingRect.left < pcRect.right &&
            toppingRect.right > pcRect.left &&
            toppingRect.bottom > pcRect.top - 30.5 &&
            toppingRect.bottom < pcRect.bottom - 30.5;
        } else if (topping.toppingType === 3) {
          // pepperoni
          isColliding =
            toppingRect.left < pcRect.right &&
            toppingRect.right > pcRect.left &&
            toppingRect.bottom > pcRect.top - 41.5 &&
            toppingRect.bottom < pcRect.bottom - 41.5;
        } else {
          // pineapple
          isColliding =
            toppingRect.left < pcRect.right &&
            toppingRect.right > pcRect.left &&
            toppingRect.bottom > pcRect.top - 91.5 &&
            toppingRect.bottom < pcRect.bottom - 91.5;
        }

        if (isColliding && !topping.collided) {
          dripAudio.play();
          setScore((prev) => prev + 1);
          setInterval(() => {}, 500);
          return {
            ...topping,
            collided: true,
          };
        }
        return topping; // Keep the topping in the state
      })
    );
  };

  const handleMouseMove = (event: MouseEvent) => {
    setPosition(event.clientX);
  };

  const handleTouchMove = (event: TouchEvent) => {
    if (event.touches.length > 0) {
      const touch = event.touches[0];
      setPosition(touch.clientX);
    }
  };

  const handleTouchStart = (event: TouchEvent) => {
    if (event.touches.length > 0) {
      const touch = event.touches[0];
      setPosition(touch.clientX);
    }
  };

  const handleGameLose = async () => {
    splashAudio.play();
    try {
      const newScoreID = await trpc.leaderboard.saveScore.mutate({
        user_id: Number(localStorage.getItem("userID")),
        game_id: 5,
        points: score,
      });
      console.log("created new score record; new score ID: " + newScoreID);
    } catch (error) {
      console.log("unable to create new user: ", error);
    }
    setGameStarted(false);
    setShowScoreBoard(true);
  };

  const handleScoreBoardClose = () => {
    setShowScoreBoard(false);
  };

  return (
    <>
      {gameStarted ? (
        // In-Game Screen
        <div className="w-full h-full min-h-[100vh] bg-[#87CEEB] flex flex-col">
          <Button
            title="← Leave Game"
            className="text-xs z-1"
            onClick={endGame}
          />

          {/* Score Counter */}
          <div className="flex flex-col text-white mx-auto mt-8 gap-3 z-1">
            <h1 className="text-4xl">Score</h1>
            <h2 className="text-3xl mx-auto">{score}</h2>
          </div>

          <img
            src={"/games/ToppingDroppings/clouds.png"}
            className="lg:w-[30vw] mx-auto"
          ></img>

          {/* Falling Toppings */}
          <div
            id="game-spawner"
            className="flex absolute w-full h-full min-h-[100vh] overflow-hidden"
          >
            {toppingObjs.map((daProps, index) => {
              return (
                <DroppingTopping
                  key={index}
                  coordinates={daProps.coordinates}
                  toppingImgSrc={daProps.toppingImgSrc}
                  toppingType={daProps.toppingType}
                  instanceId={daProps.instanceId}
                  collided={daProps.collided}
                  onAnimationFinished={handleGameLose}
                  dropTime={daProps.dropTime}
                />
              );
            })}
          </div>

          {/* Pizza Catching */}
          <div
            className={`w-full h-[10vh] mt-20 mx-auto z-1 relative overflow-hidden`}
          >
            <div
              id="pizza-catcher"
              className={`w-[35vw] h-auto md:w-[8vw] absolute`}
            >
              <img src={pizzaSrc} className={`w-full h-auto`}></img>
            </div>
          </div>
          <img src={"/games/ToppingDroppings/Ground.png"}></img>
        </div>
      ) : (
        // Pre-Game Screen
        <div className="w-full h-full min-h-[100vh] bg-[#87CEEB] flex flex-col">
          <Button
            title="← Back to Menu"
            className="text-xs z-1"
            onClick={() => navigate("/games")}
          />

          {/* Title */}
          <div className="flex text-4xl text-white mx-auto mt-8 gap-3 z-1">
            <h1>Drop Top</h1>
            <FontAwesomeIcon
              icon={faQuestionCircle}
              className="my-auto w-4 h-auto"
              onClick={() => {
                setShowHowTo(true);
              }}
            />
          </div>

          {/* Play Button */}
          <div className="mt-auto mx-auto mb-6 z-1">
            <Button
              title="Play Game"
              className="text-3xl text-white animate-gradient bg-clip-text transition-all duration-500 px-6 py-3 rounded-lg"
              onClick={startGame}
            />
          </div>

          {/* Falling Toppings */}
          <div
            id="topping-spawner"
            className="flex absolute w-full h-full min-h-[100vh] overflow-hidden"
          >
            {toppingObjs.map((daProps, index) => {
              return (
                <DroppingTopping
                  key={index}
                  coordinates={daProps.coordinates}
                  toppingImgSrc={daProps.toppingImgSrc}
                  toppingType={daProps.toppingType}
                  instanceId={daProps.instanceId}
                  collided={daProps.collided}
                  dropTime={daProps.dropTime}
                />
              );
            })}
          </div>
          <img src={"/games/ToppingDroppings/Ground.png"}></img>
        </div>
      )}
      {showScoreBoard && (
        <div
          className="fixed top-0 left-0 w-full h-full bg-white/50 bg-opacity-50 flex items-center justify-center z-10"
          onClick={handleScoreBoardClose}
        >
          <div className="bg-white p-6 rounded-lg shadow-lg text-center">
            <h2 className="text-2xl mb-4">Game Over!</h2>
            <p className="text-xl mb-4 font-bold">Your Score: {score}</p>

            <Button
              title="Return to Menu"
              className="border-1"
              onClick={handleScoreBoardClose}
            />
          </div>
        </div>
      )}
      {showHowTo && (
        <div
          className="fixed top-0 left-0 w-full h-full bg-white/50 bg-opacity-50 flex items-center justify-center z-10"
          onClick={() => setShowHowTo(false)}
        >
          <div className="bg-white w-[90%] p-6 rounded-lg shadow-lg text-center">
            <h2 className="text-2xl mb-4">How To Play</h2>
            <ul>
              <li className="mx-3 my-auto">
                - Move the pizza catcher with your mouse or touch input to catch
                falling toppings.
              </li>
              <li className="mx-3 my-auto">
                - Each topping you catch adds to your score.
              </li>
              <li className="mx-3 my-auto">
                - Missing a topping will result in ending the game!
              </li>
              <li className="mx-3 my-auto">
                - The game gets progressively harder as you catch more toppings.
              </li>
            </ul>
            <Button
              title="Close"
              className="border-1"
              onClick={() => setShowHowTo(false)}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default ToppingDroppings;
