import { useEffect, useState } from "react";
import '../../../styles/pages/games/topping_droppings.css';

interface coordinates {
    x: number;
    y: number;
}

interface DroppingToppingProps {
    coordinates: coordinates,
    toppingImgSrc: string,
    toppingType: number, // just for tracking purposes
    instanceId: number,
    collided: boolean,
    onAnimationFinished?: () => void,
    dropTime: number
}

const DroppingTopping: React.FC<DroppingToppingProps> = (
    {coordinates, toppingImgSrc, toppingType, instanceId, collided, onAnimationFinished, dropTime},
) => {

    const [position, setPosition] = useState<coordinates>(coordinates);
    const [render, setRender] = useState<boolean>(true);

    useEffect(() => {
        const container = document.getElementById(`container-item-${instanceId}`);
        setPosition({x: coordinates.x, y: container?.getBoundingClientRect().bottom || 0});
    }, []);

    useEffect(() => {
        if (collided) {
            setRender(false);
        }
    }, [collided])

    const handleAnimEnd = () => {
        if (!collided) {
            onAnimationFinished?.();
        }
        setRender(false);
    }

    if (!render) {
        return null;
    }

    const divStyle: React.CSSProperties = {
        position: "absolute",
        // top: "-10vh",
        left: `${coordinates.x}px`, // Set the initial position directly
        animation: `vertical-drop ${dropTime / 1000}s linear forwards`, // Ensure animation is applied correctly
        // animationDuration: `${dropTime}s`, // Use the dropTime prop for animation duration
        width: "60px",
        height: "auto",
    };

    return(
        <div id={`container-item-${instanceId}`} onAnimationEnd={handleAnimEnd} style={divStyle}>
            <img src={toppingImgSrc} className="absolute object-cover"></img>
        </div>
    );
};

export default DroppingTopping;
export type {coordinates, DroppingToppingProps};