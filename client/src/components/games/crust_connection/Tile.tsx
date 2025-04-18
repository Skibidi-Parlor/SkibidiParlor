import "../../../styles/components/games/crust_connection/Tile.css"

type TileParams = {
    pictureOfFood: string;
    key: number;
    index: number;
    isFlipped: boolean;
    isMatching: boolean;
    handleFlip: (index: number) => void;
}
const Tile = ({ key, index, pictureOfFood, isFlipped, isMatching, handleFlip }: TileParams) => {
    const tileFlip = new Audio('../../../../public/games/CrustConnection/tile-flip.mp3')
    return (
        <div className={`tile-container ${key}`}>
            <div className={`tile ${isFlipped || isMatching ? "is-flipped" : ""}`} onClick={() => {
                if (!isFlipped && !isMatching) {
                    tileFlip.play()
                    handleFlip(index)
                }
            }}> 
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