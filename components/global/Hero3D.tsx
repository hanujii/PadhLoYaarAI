'use client';

import React from 'react';
import { motion } from 'framer-motion';

export const Hero3D = () => {
    return (
        <div className="w-full h-full flex items-center justify-center relative z-0 perspective-[1000px] overflow-hidden">
            {/* Abstract Geometric Shape */}
            <div
                className="relative w-[60vw] h-[60vw] max-w-[300px] max-h-[300px] md:max-w-[400px] md:max-h-[400px] animate-[spin_20s_linear_infinite] will-change-transform"
                style={{ transformStyle: 'preserve-3d' }}
            >
                {/* Central Glow */}
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                    className="absolute inset-0 bg-gradient-to-tr from-primary/60 to-purple-500/60 rounded-full blur-3xl opacity-40 mix-blend-screen"
                />

                {/* Main Orbital Rings - Visible on all devices */}
                <div className="absolute inset-0 border-2 border-primary/20 rounded-full will-change-transform" style={{ transform: 'rotateX(60deg) rotateY(15deg)' }} />
                <div className="absolute inset-0 border-2 border-purple-500/20 rounded-full will-change-transform" style={{ transform: 'rotateX(-60deg) rotateY(15deg)' }} />

                {/* Secondary Rings - Hidden on very small screens for performance, simpler on mobile */}
                <div className="absolute inset-0 border border-primary/10 rounded-full will-change-transform hidden sm:block" style={{ transform: 'rotateY(60deg) rotateX(15deg)' }} />

                {/* Complexity Rings - Desktop Only */}
                <div className="absolute inset-0 border border-purple-500/10 rounded-full scale-125 hidden md:block will-change-transform" style={{ transform: 'rotateX(45deg) rotateY(-45deg)' }} />

                {/* Floating Particles - Reduced count and complexity */}
                <div className="absolute top-0 left-1/2 w-1.5 h-1.5 bg-primary/80 rounded-full shadow-[0_0_5px_currentColor] animate-pulse will-change-transform" style={{ transform: 'translateZ(60px)' }} />
                <div className="absolute bottom-0 right-1/2 w-2 h-2 bg-purple-400/80 rounded-full shadow-[0_0_8px_currentColor] animate-bounce will-change-transform" style={{ transform: 'translateZ(-40px)' }} />

                {/* Core */}
                <div className="absolute top-[25%] left-[25%] w-1/2 h-1/2 bg-gradient-to-br from-primary/80 to-purple-600/80 rounded-full shadow-[0_0_30px_rgba(var(--primary),0.4)] animate-pulse will-change-opacity" />
            </div>
        </div>
    );
};
