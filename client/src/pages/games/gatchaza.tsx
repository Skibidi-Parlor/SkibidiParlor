
import oar from "../../components/games/gatchaza/oar.png"
import bricks from "../../components/games/gatchaza/bricks.png"
import oarpizza from "../../components/games/gatchaza/oarpizza.png"
import oven from "../../components/games/gatchaza/oven.png"
import card from "../../components/games/gatchaza/card.png"

const Gatchaza = () => {
    return (
        <>
            <div className="w-[100vw] h-[100vh] bg-[#F76666] flex flex-col items-center justify-center">
                <img src={oven}></img>
                <button className="p-5 bg-[#FFE49A] rounded-2xl font-extrabold text-2xl">
                    Bake Pizza
                </button>
            </div>
            
        </>
    );
};

export default Gatchaza;