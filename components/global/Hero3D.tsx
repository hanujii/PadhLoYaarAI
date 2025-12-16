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

                {/* Core */}
                <div className="absolute top-[25%] left-[25%] w-1/2 h-1/2 bg-gradient-to-br from-primary to-purple-600 rounded-full shadow-[0_0_50px_rgba(var(--primary),0.5)] animate-pulse" />
            </div>
        </div>
    );
};
