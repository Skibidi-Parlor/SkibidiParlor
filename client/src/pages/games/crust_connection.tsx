import "../../styles/pages/games/crust_connection.css"

import Grid from "../../components/games/crust_connection/Grid"
import Tile from "../../components/games/crust_connection/Tile"
import GameCode from "../../components/games/crust_connection/GameCode";

import { faQuestionCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"


const CrustConnection = () => {
    const pizza = "../../../../public/games/SliceSweeper/pizza.webp";
    const navigate = useNavigate()

    const [inGame, setInGame] = useState(false)
    const [showFAQModal, setShowFAQModal] = useState(true);
    const [joinGame, setJoinGame] = useState(false)

    useEffect(() => {
        
    })

    const randomizedList = [
        pizza, pizza, pizza, pizza,
        pizza, pizza, pizza, pizza,
        pizza, pizza, pizza, pizza,
        pizza, pizza, pizza, pizza
    ]



    return (
        <>
            { !(!(!(inGame))) ? (
                <div>
                    <button className="crust-connection-back-button" onClick={() => navigate(-1)}>← Back to Menu</button>
                    <div className="crust-connection-container">
                        <div className="items-in-container">
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
                            <Grid graph={randomizedList} />
                            <div className="option-button">
                                <button>Play Game</button>
                                <button>Join Game</button>
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <div>

                </div>
            )}
            {joinGame && (<GameCode />)}
        </>
    )
}

export default CrustConnection