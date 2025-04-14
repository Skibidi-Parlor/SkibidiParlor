import { useNavigate } from "react-router-dom";
import { useState } from "react";
import Button from "../../components/games/slice_sweeper/Button";
import "../../styles/pages/games/toppingFrenzy.css"

import pineapple from "../../../public/toppings/Pineapple.png"

const ToppingFrenzy = () => {
    const navigate = useNavigate();

    const [gameStarted, setGameStarted] = useState(false);

    const toppings = [
        "../../../public/toppings/chez.png",
        "../../../public/toppings/mushroom.png",
        "../../../public/toppings/Onion.png",
        "../../../public/toppings/pepperoni.png",
        "../../../public/toppings/Pineapple.png"
    ];

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
                    className="text-xs mt-12 z-1"
                    onClick={() => navigate(-1)}    
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
                <div className="flex absolute w-full h-full min-h-[100vh]">
                    
                </div>
            </div>
        )}
    </>);
};

export default ToppingFrenzy;