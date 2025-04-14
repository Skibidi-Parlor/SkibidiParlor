import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Button from "../../components/games/slice_sweeper/Button";
import "../../styles/pages/games/topping_droppings.css"

const ToppingDroppings = () => {
    const navigate = useNavigate();

    const [gameStarted, setGameStarted] = useState(false);

    const toppings: string[] = [
        "../../../toppings/chez.png",
        "../../../toppings/mushroom.png",
        "../../../toppings/Onion.png",
        "../../../toppings/pepperoni.png",
        "../../../toppings/Pineapple.png"
    ];

    useEffect(() => {
        // spawns random toppings to fall in idle state
        const spawn = setInterval(() => {
            const randomTopping: number = Math.floor(Math.random() * 5);
            
            // container for topping images to fit to size
            const xval: number = Math.floor(Math.random() * (window.screen.width - 60));
            const container = document.createElement('div');
            container.className = `absolute animate-drop w-[60px] h-auto left-[${xval}px]`;
            console.log(container.className);
            
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
        }, 800);

        return () => clearInterval(spawn);
    }, []);

    const startGame = () => {

    };


    return(<>
        { gameStarted ? (
            // In-Game Screen
            <div className="w-full h-full min-h-[100vh] bg-[#87CEEB] flex flex-col">

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
                <div className="mt-auto mx-auto mb-6">
                    <Button
                        title="Play Game"
                        className="text-3xl text-white animate-gradient bg-clip-text transition-all duration-500 px-6 py-3 rounded-lg"
                        onClick={startGame}
                    />
                </div>

                {/* background with the falling toppings */}
                <div id="topping-spawner" className="flex absolute w-full h-full min-h-[100vh]">
                    
                </div>
            </div>
        )}
    </>);
};

export default ToppingDroppings;