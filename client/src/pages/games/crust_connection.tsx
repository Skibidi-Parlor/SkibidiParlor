import "../../styles/pages/games/crust_connection.css"

import Grid from "../../components/games/crust_connection/Grid"
import LoadingGrid from "../../components/games/crust_connection/LoadingGrid";
import Modal from "../../components/ui/Modal";

import { faQuestionCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { useEffect, useRef, useState } from "react"
import { useNavigate } from "react-router-dom"
import { number } from "zod";


const CrustConnection = () => {
    const pizza = "../../../games/CrustConnection/pizza.webp";
    const cheese = "../../../games/CrustConnection/Cheese.png";
    const greenPepper = "../../../games/CrustConnection/GreenPepper.png";
    const mushroom = "../../../games/CrustConnection/Mushroom.png";
    const onion = "../../../games/CrustConnection/Onion.png";
    const pepperoni = "../../../games/CrustConnection/Peperoni.png";
    const sausage = "../../../games/CrustConnection/Sausage.png";
    const pineapple = "../../../games/CrustConnection/Pineapple.png";

    const navigate = useNavigate()

    const [inGame, setInGame] = useState(false)
    const [showFAQModal, setShowFAQModal] = useState(true);
    const [showJoinGame, setShowJoinGame] = useState(false)
    const [whichPlayer, setWhichPlayer] = useState(1)
    const [gameCode, setGameCode] = useState<number | null>(null)
    const [randomGrid, setRandomGrid] = useState<string[]>([])

    const inputRefs = [useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null)];

    useEffect(() => {
        if (showJoinGame) {
            inputRefs[0].current?.focus();
        }
    }, [showJoinGame]);

    useEffect(() => {
        const generateCode = (): number => Math.floor(1000 + Math.random() * 9000);
        setGameCode(generateCode())
    }, [])

    const handleInput = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;

        if (value.length > 1) {
            e.target.value = value.slice(0, 1);
        }

        if (value !== "" && index < inputRefs.length - 1) {
            inputRefs[index + 1].current?.removeAttribute("disabled");
            inputRefs[index + 1].current?.focus();
        }
    };

    const handleKeyUp = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Backspace" && index > 0) {
            e.currentTarget.value = "";
            inputRefs[index].current?.setAttribute("disabled", "true");
            inputRefs[index - 1].current?.focus();
        }
    };

    const playGame = () => {
        setRandomGrid(randomizeGrid())
    }

    

    const randomizeGrid = (): string[] => {
        const images = [pizza, cheese, greenPepper, mushroom, onion, pepperoni, sausage, pineapple]
        const makeItDouble = [... images, ...images]

        for (let i = makeItDouble.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1))
            [makeItDouble[i], makeItDouble[j]] = [makeItDouble[j], makeItDouble[i]]
        }

        return makeItDouble
    }
    
    const randomizedList = [
        pineapple, pizza, greenPepper, onion,
        onion, cheese, mushroom, pineapple,
        pepperoni, sausage, pizza, greenPepper,
        cheese, sausage, pepperoni, mushroom
    ]



    return (
        <>
            { !(!(!(inGame))) ? (
                <div>
                    <button className="crust-connection-back-button" onClick={() => navigate(-1)}>← Back to Menu</button>
                    <div className="crust-connection-container">
                        <div className="items-in-container">
                            <div className="top">
                                <div className="title-crust-con">
                                    <h1>Crust Connection</h1>
                                    <FontAwesomeIcon
                                        icon={faQuestionCircle}
                                        className="my-auto"
                                        onClick={() => {
                                        setShowFAQModal(true);
                                        }}
                                    />
                                </div>
                                <h2>Code: {gameCode}</h2>
                                <h2>Opponent: {}</h2>
                            </div>

                            <LoadingGrid graph={randomizedList} />
                            <div className="option-button">
                                <button onClick={() => {playGame()}}>Play Game</button>
                                <button onClick={() => {setShowJoinGame(true)}}>Join Game</button>
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <div>
                    <button className="crust-connection-back-button" onClick={() => navigate(-1)}>← Back to Menu</button>
                    <div className="crust-connection-container">
                        <div className="items-in-container">
                            <div className="title-crust-con">
                                <h1>Player {whichPlayer}'s Turn!</h1>
                            </div>
                            <Grid graph={randomizedList} />
                            <div className="score">
                                <h1>Player 1: <span>2</span></h1>
                                <h1>Player 2: <span>0</span></h1>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            {showJoinGame && (
            <Modal
            isOpen={showJoinGame}
            onClose={() => {
                setShowJoinGame(false);
            }}
                >
                <h1 className="text-center underline text-3xl">Join Game</h1>
                <br />
                <ul>
                    <li className="mx-3 my-auto">
                        Please enter your friend's game code shown above their screen (i.e. 1234)
                    </li>
                    <br />
                    <div className="flex justify-center gap-[0.5rem]">
                        <input ref={inputRefs[0]} onChange={(e) => handleInput(0, e)} onKeyUp={(e) => handleKeyUp(0, e)} type="number" className="border-none max-w-[20%] h-[60px] text-center rounded-[5px] bg-[#adadad] text-[2.5rem] overflow-y-hidden focus:outline focus:outline-[1.5px] focus:outline-[#286D40] focus:outline-offset-2"/>
                        <input ref={inputRefs[1]} type="number" disabled onChange={(e) => handleInput(1, e)} onKeyUp={(e) => handleKeyUp(1, e)} className="border-none max-w-[20%] h-[60px] text-center rounded-[5px] bg-[#adadad] text-[2.5rem] overflow-y-hidden focus:outline focus:outline-[1.5px] focus:outline-[#286D40] focus:outline-offset-2"/>
                        <input ref={inputRefs[2]} type="number" disabled onChange={(e) => handleInput(2, e)} onKeyUp={(e) => handleKeyUp(2, e)} className="border-none max-w-[20%] h-[60px] text-center rounded-[5px] bg-[#adadad] text-[2.5rem] overflow-y-hidden focus:outline focus:outline-[1.5px] focus:outline-[#286D40] focus:outline-offset-2"/>
                        <input ref={inputRefs[3]} type="number" disabled onChange={(e) => handleInput(3, e)} onKeyUp={(e) => handleKeyUp(3, e)} className="border-none max-w-[20%] h-[60px] text-center rounded-[5px] bg-[#adadad] text-[2.5rem] overflow-y-hidden focus:outline focus:outline-[1.5px] focus:outline-[#286D40] focus:outline-offset-2"/>
                    </div>
                </ul>
                <br />
                <div className="option-button">
                    <button className="" onClick={() => {setShowJoinGame(false)}}>Join Game</button>
                </div>
                </Modal>
            )}
            {showFAQModal && (
            <Modal
            isOpen={showFAQModal}
            onClose={() => {
                setShowFAQModal(false);
            }}
                >
                <h1 className="text-center underline text-3xl">How To Play</h1>
                <ul>
                    <li className="mx-3 my-auto">
                    - Crust Connection! Take turns trying to match up <b>toppings</b> behind the tiles
                    </li>
                    <li className="mx-3 my-auto">
                    - Whoever matches up the most <b>toppings</b> win!
                    </li>
                    <li className="mx-3 my-auto">- May the best player win!</li>
                </ul>
                </Modal>
            )}
        </>
    )
}

export default CrustConnection