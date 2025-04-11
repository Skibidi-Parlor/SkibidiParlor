import "../styles/pages/game.css"
import { useState } from "react"
import { useNavigate } from "react-router-dom"

const game = () => {
    const [activeSquare, setActiveSquare] = useState(0)

    const gameTitles = [
        "Slice Sweeper",
        "Topping Trouble",
        "Crust Connection",
        "Slots",
    ]

    const navigationLinks = [
        "./slicesweeper",
        "./toppingtrouble",
        "./crustconnection",
        "./slots",
    ]

    const navigate = useNavigate()

    return(
        <>
            <div className="game">
                <h1 className="title-game">Games</h1>

                <div className="container-of-games">
                    {gameTitles.map((gameTitle, index) => (
                        <div key={index} className={`game-square ${activeSquare === index ? "active-square" : ""}`} onClick={() => setActiveSquare(index)}>
                            <h1>{gameTitle}</h1>
                            <button onClick={() => navigate(navigationLinks[index])}><h1>Play</h1></button>
                        </div>
                    ))}
                </div>
            </div>
        </>
    )
}

export default game