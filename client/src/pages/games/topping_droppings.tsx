import { useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";

import Button from "../../components/games/slice_sweeper/Button";
import DroppingTopping from "../../components/games/toppingDroppings/DroppingTopping";
import { DroppingToppingProps } from "../../components/games/toppingDroppings/DroppingTopping";

import "../../styles/pages/games/topping_droppings.css"


const ToppingDroppings = () => {
    const navigate = useNavigate();

    const [gameStarted, setGameStarted] = useState<boolean>(false);
    const [score, setScore] = useState<number>(0);
    const [position, setPosition] = useState<number>(0);    // x value position of cursor/touch input
    const [fallSpd, setFallSpd] = useState<number>(0);
    const [fallFreq, setFallFreq] = useState<number>(1200); // time in ms between each topping drop

    const [catcherY, setCatcherY] = useState<number | undefined>(0);

    const [toppingObjs, setToppingObjs] = useState<DroppingToppingProps[]>([]);
    const [iid, setIid] = useState<number>(0);

    const spdFactor: number = .97;
    const minInterval: number = 400;


    const pizzaSrc: string = "../../../toppings/pizza.png";

    const toppings: string[] = [
        "../../../toppings/chez.png",
        "../../../toppings/mushroom.png",
        "../../../toppings/Onion.png",
        "../../../toppings/pepperoni.png",
        "../../../toppings/Pineapple.png"
    ];

    // pregame falling toppings
    useEffect(() => {
        if (!gameStarted) {
            setFallFreq(1200);
            // spawns random toppings to fall in idle state
            const spawn = setInterval(() => {
                const randomTopping: number = Math.floor(Math.random() * 5);
                
                // container for topping images to fit to size
                const xval: number = Math.floor(Math.random() * (window.screen.width - 60));

                const enterProps: DroppingToppingProps = {
                    coordinates: {x: xval, y: 0}, 
                    toppingImgSrc: toppings[randomTopping],
                    instanceId: iid,
                    collided: false
                }

                setToppingObjs((prev) => [...prev, enterProps]);
                setIid((prev) => prev + 1);
            }, 600);

            return () => clearInterval(spawn);
        }
    }, [gameStarted]);

    // in game toppings falling
    useEffect(() => {
        if (gameStarted) {
            function doUrMom() {
                const randomTopping: number = Math.floor(Math.random() * 5);

                const xval: number = Math.floor(Math.random() * (window.screen.width - 60));

                const enterProps: DroppingToppingProps = {
                    coordinates: {x: xval, y: 0}, 
                    toppingImgSrc: toppings[randomTopping],
                    instanceId: iid,
                    collided: false
                }
                setToppingObjs((prev) => [...prev, enterProps]);
                setIid((prev) => prev + 1);

                setFallFreq((fallFreq) =>{
                    const newInterval = fallFreq * spdFactor;
                    return Math.max(newInterval, minInterval);
                });
            }
            console.log(fallFreq)
            const doit = setInterval(doUrMom, fallFreq);

            return () => {
                clearInterval(doit);
            }
        }
    }, [fallFreq, gameStarted]);

    // mouse capture / touch capture
    useEffect(() => {

        // set settings
        setScore(0);
        setFallSpd(0);
        setFallFreq(1200);

        const pc = document.querySelector('#pizza-catcher')?.getBoundingClientRect();
        setCatcherY(pc?.top);

        // handle input
        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('touchmove', handleTouchMove, {passive: false});
        document.addEventListener('touchstart', handleTouchStart, {passive: false});

        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('touchmove', handleTouchMove);
            document.removeEventListener('touchstart', handleTouchStart);
        }
    }, []);

    const startGame = () => {
        setToppingObjs([]);
        setGameStarted(true);
        setScore(0);
    };

    const endGame = () => {
        setGameStarted(false);
        setToppingObjs([]);
    };

    useEffect(() => {
        // position pizza catcher to input position
        const pc = document.querySelector<HTMLElement>("#pizza-catcher");
        if (pc) {
            pc.style.left = "" + (position - pc.offsetWidth/2) + "px";
        }
    });

    useEffect(() => {
        const interval = setInterval(() => {
            checkCollide();
        }, 50); // Check for collisions every 100ms
    
        return () => clearInterval(interval);
    }, [toppingObjs]);

    const checkCollide = () => {
        const pc = document.querySelector<HTMLElement>('#pizza-catcher');
        if (!pc) return;

        const pcRect = pc.getBoundingClientRect();

        setToppingObjs((prev) => 
            prev.map((topping) => {
                const toppingRect = document.getElementById(`container-item-${topping.instanceId}`)?.getBoundingClientRect();
                if (!toppingRect) return topping; // If toppingRect is null, keep the topping

                const isColliding = (
                    toppingRect.left < pcRect.right &&
                    toppingRect.right > pcRect.left &&
                    toppingRect.bottom > pcRect.top-91.5 &&
                    toppingRect.bottom < pcRect.bottom-91.5
                );


                if (isColliding && !topping.collided) {
                    setScore((prev) => prev + 1);
                    return {
                        ...topping,
                        collided: true
                    }
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

    return(<>
        { gameStarted ? (
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

                {/* Falling Toppings */}
                <div id="game-spawner" className="flex absolute w-full h-full min-h-[100vh] overflow-hidden">
                    {toppingObjs.map((daProps, index) => {
                            return(
                            <DroppingTopping 
                            key={index} 
                            coordinates={daProps.coordinates} 
                            toppingImgSrc={daProps.toppingImgSrc} 
                            instanceId={daProps.instanceId}
                            collided={daProps.collided}
                            />
                            )
                        })}
                </div>

                {/* Pizza Catching */}
                <div className={`w-full h-[10vh] mt-auto mx-auto mb-12 z-1 relative overflow-hidden`}>
                    <div id="pizza-catcher" className={`w-[35vw] h-auto md:w-[8vw] absolute`}>
                        <img src={pizzaSrc} className={`w-full h-auto`}></img>
                    </div>
                </div>
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
                    <h1>Topping Droppings</h1>
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
                <div id="topping-spawner" className="flex absolute w-full h-full min-h-[100vh] overflow-hidden">
                    {toppingObjs.map((daProps, index) => {
                        return(
                        <DroppingTopping 
                        key={index} 
                        coordinates={daProps.coordinates} 
                        toppingImgSrc={daProps.toppingImgSrc} 
                        instanceId={daProps.instanceId}
                        collided={daProps.collided}
                        />
                        )
                    })}
                </div>
            </div>
        )}
    </>);
};

export default ToppingDroppings;