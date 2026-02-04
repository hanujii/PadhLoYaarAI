'use client';

import React from 'react';
import { motion } from 'framer-motion';

export const Hero3D = () => {
    return (
        <div className="w-full h-full flex items-center justify-center relative z-0 perspective-[1000px] overflow-visible">
            {/* Abstract Geometric Shape */}
            <div
                className="relative w-[60vw] h-[60vw] max-w-[300px] max-h-[300px] md:max-w-[500px] md:max-h-[500px] animate-[spin_30s_linear_infinite] will-change-transform"
                style={{ transformStyle: 'preserve-3d' }}
            >
                {/* Central Glow - Deepened */}
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                    className="absolute inset-0 bg-gradient-to-tr from-primary/20 via-blue-600/20 to-purple-600/20 rounded-full blur-[80px] mix-blend-screen animate-pulse-glow"
                />

                {/* Main Orbital Rings - Stronger contrast */}
                <div className="absolute inset-0 border-[1px] border-primary/40 rounded-full will-change-transform shadow-[0_0_30px_rgba(139,92,246,0.1)]" style={{ transform: 'rotateX(70deg) rotateY(15deg)' }} />
                <div className="absolute inset-0 border-[1px] border-cyan-500/30 rounded-full will-change-transform shadow-[0_0_30px_rgba(6,182,212,0.1)]" style={{ transform: 'rotateX(-70deg) rotateY(15deg)' }} />
                <div className="absolute inset-0 border-[1px] border-purple-500/30 rounded-full will-change-transform" style={{ transform: 'rotateY(70deg) rotateX(15deg)' }} />

                {/* Floating Particles - Stardust */}
                <div className="absolute top-0 left-1/2 w-1 h-1 bg-white rounded-full shadow-[0_0_10px_white] animate-float" style={{ transform: 'translateZ(60px)', animationDelay: '0s' }} />
                <div className="absolute bottom-0 right-1/2 w-1.5 h-1.5 bg-primary rounded-full shadow-[0_0_15px_currentColor] animate-float" style={{ transform: 'translateZ(-40px)', animationDelay: '1.5s' }} />
                <div className="absolute top-1/4 left-1/4 w-1 h-1 bg-cyan-400 rounded-full shadow-[0_0_8px_currentColor] animate-float hidden sm:block" style={{ transform: 'translateZ(20px)', animationDelay: '2.5s' }} />

                {/* Core */}
                <div className="absolute top-[40%] left-[40%] w-[20%] h-[20%] bg-white shadow-[0_0_100px_white] rounded-full animate-pulse blur-[10px]" />
            </div>
        </div>
    );
};
