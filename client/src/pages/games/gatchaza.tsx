import React, { useState } from 'react';
import { motion, useAnimation, spring } from 'framer-motion';
import oar from "../../components/games/gatchaza/oar.png"
import bricks from "../../components/games/gatchaza/bricks.png"
import oarpizza from "../../components/games/gatchaza/oarpizza.png"
import oven from "../../components/games/gatchaza/oven.png"
import card from "../../components/games/gatchaza/card.png"


const Gatchaza = () => {
    
    const buttonControls = useAnimation();
    const [buttonPressed, setButtonPressed] = useState(false);
    const [pizzaBaked, setPizzaBaked] = useState(false);
    const [gatchaPulled, setGatchaPulled] = useState(false);
    const handleBake = () => {
        setButtonPressed(true);
        buttonControls.start({ opacity: 0});
    };

    const pizzaBake = () => {
        setPizzaBaked(true);
    };

    const gatcha = () => {
        setGatchaPulled(true);
    }

    const restart = () => {
        setButtonPressed(false);
        setPizzaBaked(false);
        setGatchaPulled(false);
    }

    return (
        <>
            <div className="w-[100vw] h-[100vh] bg-[#c85252] flex flex-col items-center justify-center overflow-clip relative">
                {!gatchaPulled && (
                    <>
                        <motion.img
                            src={oven}
                            className="z-1"
                        />
                        <motion.button
                            className="mt-5 mb-40 p-5 bg-[#FFE49A] rounded-2xl font-extrabold text-2xl"
                            onClick={handleBake}
                            animate={buttonControls}
                            initial = {{ opacity: 1 }}
                            whileHover={{ scale: 1.10}}
                        >
                            Bake Pizza
                        </motion.button>
                    </>
                    
                )}
                
                {buttonPressed && (
                    <>
                        <motion.img 
                            className="absolute"
                            src={oar}
                            initial={{ y: 500, opacity: 1}}
                            animate={{ y: 10, opacity: 0 }}
                            transition={{ y: {duration: 1.5}, opacity: {duration: 0, delay: 1.5} }}
                            onAnimationComplete={pizzaBake}
                            
                        />
                    </>
                )}   
                {pizzaBaked && (
                    <>
                        <motion.img
                            className="absolute"
                            src={oarpizza}
                            initial={{ y: 10  }}
                            animate={{ y: 325, opacity: 0, type: spring, bounce: 1}}
                            transition={{ y: {duration: 1.5}, opacity: {duration: 0, delay: 1.5} }}
                            onAnimationComplete={gatcha}
                        />
                    </>
                )} 

                {gatchaPulled && (
                    <>
                        <motion.img 
                            src={card}
                            className=""
                            initial={{ opacity: 0, scale: 0}}
                            animate={{ opacity: 1, scale: 1}}
                            transition={{ duration: 2, type: 'spring', bounce: .5}}
                        />
                        <motion.text
                            className="mt-10 font-extrabold text-5xl"
                            initial={{ x: -300 }}
                            animate={{ x: 0 }}
                            transition={{ duration: 2, type: 'spring', bounce: .5 }}
                        >
                            Name of Pizza
                        </motion.text>
                        <motion.button
                            className="mt-5 p-5 bg-[#FFE49A] rounded-2xl font-extrabold text-2xl hover:bg-[#ffe395]"
                            onClick={restart}
                            initial={{ x: 300 }}
                            animate={{ x: 0 }}
                            transition={{ duration: 2, type: 'spring', bounce: .5 }}
                            whileHover={{ scale: 1.10}}

                        >
                            Restart
                        </motion.button>
                    </>
                )}
                    
            </div>
            
        </>
    );
};

export default Gatchaza;