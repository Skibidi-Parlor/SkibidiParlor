import { useState } from "react"
import "../../../styles/components/games/crust_connection/Tile.css"

type TileParams = {
    pictureOfFood: string;
    key: number;
}
const Tile = ({ key, pictureOfFood }: TileParams) => {
    const [isFlipped, setIsFlipped] = useState(false)


    return (
        <div className={`tile-container ${key}`}>
            <div className={`tile ${isFlipped ? "is-flipped" : ""}`} onClick={() => {setIsFlipped(!isFlipped)}}> 
                <div className="tile-show front">
                </div>
                <div className="tile-show not-the-front-but-the-other-side-the-reversed-side-if-you-like-to-call-it">

                    <img src={pictureOfFood} alt="" />
                </div>
            </div>
        </div>
    )
} 

export default Tile