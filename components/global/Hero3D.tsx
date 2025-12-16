'use client';

import React from 'react';
import { motion } from 'framer-motion';

export const Hero3D = () => {
    return (
        <div className="w-full h-[400px] flex items-center justify-center relative z-0 perspective-[1000px]">
            {/* Abstract Geometric Shape created with CSS/divs */}
            <div className="relative w-64 h-64 animate-[spin_20s_linear_infinite]" style={{ transformStyle: 'preserve-3d' }}>
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                    className="absolute inset-0 bg-gradient-to-tr from-primary/80 to-purple-500/80 rounded-full blur-3xl opacity-50 mix-blend-screen"
                />

                {/* Orbital Rings */}
                <div className="absolute inset-0 border-2 border-primary/30 rounded-full" style={{ transform: 'rotateX(60deg) rotateY(15deg)' }} />
                <div className="absolute inset-0 border-2 border-purple-500/30 rounded-full" style={{ transform: 'rotateX(-60deg) rotateY(15deg)' }} />
                <div className="absolute inset-0 border-2 border-cyan-500/30 rounded-full" style={{ transform: 'rotateY(60deg) rotateX(15deg)' }} />

                {/* Extra Rings for complexity */}
                <div className="absolute inset-0 border border-pink-500/20 rounded-full scale-125" style={{ transform: 'rotateX(45deg) rotateY(-45deg)' }} />
                <div className="absolute inset-0 border border-yellow-500/20 rounded-full scale-150" style={{ transform: 'rotateX(-30deg) rotateY(30deg)' }} />


                {/* Floating Particles */}
                <div className="absolute top-0 left-1/2 w-2 h-2 bg-white rounded-full shadow-[0_0_10px_white] animate-pulse" style={{ transform: 'translateZ(100px)' }} />
                <div className="absolute bottom-0 right-1/2 w-3 h-3 bg-blue-400 rounded-full shadow-[0_0_15px_blue] animate-bounce" style={{ transform: 'translateZ(-50px)' }} />

                {/* Core */}
                <div className="absolute top-[25%] left-[25%] w-1/2 h-1/2 bg-gradient-to-br from-primary to-purple-600 rounded-full shadow-[0_0_50px_rgba(var(--primary),0.5)] animate-pulse" />
            </div>
        </div>
    );
};
