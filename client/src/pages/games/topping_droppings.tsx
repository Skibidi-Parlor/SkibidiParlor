import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

import Button from "../../components/games/slice_sweeper/Button";

import "../../styles/pages/games/topping_droppings.css"


const ToppingDroppings = () => {
    const navigate = useNavigate();

    const [gameStarted, setGameStarted] = useState<boolean>(false);
    const [score, setScore] = useState<number>(24);
    const [position, setPosition] = useState<number>(0);    // x value position

    const pizzaSrc: string = "../../../toppings/pizza.png";

    const toppings: string[] = [
        "../../../toppings/chez.png",
        "../../../toppings/mushroom.png",
        "../../../toppings/Onion.png",
        "../../../toppings/pepperoni.png",
        "../../../toppings/Pineapple.png"
    ];

    // idle menu background
    useEffect(() => {
        // spawns random toppings to fall in idle state
        const spawn = setInterval(() => {
            const randomTopping: number = Math.floor(Math.random() * 5);
            
            // container for topping images to fit to size
            const xval: number = Math.floor(Math.random() * (window.screen.width - 60));
            const container = document.createElement('div');
            
            container.className = `absolute animate-drop w-[60px] h-auto`;
            container.style.left =  `${xval}px`;
            
            // img + animation
            const spawnLocation = document.querySelector("#topping-spawner");
            const newToppingImg = document.createElement('img');
            newToppingImg.src = toppings[randomTopping];
            newToppingImg.className = `absolute animate-drop object-cover`;

            

            container.appendChild(newToppingImg);
            spawnLocation?.appendChild(container);

            // remove the img just in case so the cpu doesnt explode after a while
            container.addEventListener('animationend', () => {
                container.removeChild(newToppingImg);
            });
        }, 600);

        return () => clearInterval(spawn);
    }, []);

    // mouse capture / touch capture
    useEffect(() => {
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
        setGameStarted(true);
    };

    const endGame = () => {
        setGameStarted(false);
    };

    useEffect(() => {
        const pc = document.querySelector<HTMLElement>("#pizza-catcher");
        if (pc) {
            pc.style.left = "" + (position - pc.offsetWidth/2) + "px";
        } else {
            console.log("urmom");
        }
    });

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

                {/* background with the falling toppings */}
                <div id="topping-spawner" className="flex absolute w-full h-full min-h-[100vh] overflow-hidden">
                    
                </div>
            </div>
        )}
    </>);
};

export default ToppingDroppings;