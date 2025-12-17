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
                    className="absolute inset-0 bg-gradient-to-tr from-primary/40 via-purple-500/30 to-blue-500/40 rounded-full blur-[60px] opacity-60 mix-blend-screen animate-pulse-glow"
                />

                {/* Main Orbital Rings - Visible on all devices */}
                <div className="absolute inset-0 border-2 border-primary/30 rounded-full will-change-transform shadow-[0_0_15px_rgba(139,92,246,0.3)]" style={{ transform: 'rotateX(60deg) rotateY(15deg)' }} />
                <div className="absolute inset-0 border-2 border-purple-500/30 rounded-full will-change-transform shadow-[0_0_15px_rgba(168,85,247,0.3)]" style={{ transform: 'rotateX(-60deg) rotateY(15deg)' }} />

                {/* Secondary Rings - Hidden on very small screens for performance, simpler on mobile */}
                <div className="absolute inset-0 border border-primary/20 rounded-full will-change-transform hidden sm:block" style={{ transform: 'rotateY(60deg) rotateX(15deg)' }} />

                {/* Complexity Rings - Desktop Only */}
                <div className="absolute inset-0 border border-purple-500/10 rounded-full scale-125 hidden md:block will-change-transform" style={{ transform: 'rotateX(45deg) rotateY(-45deg)' }} />

                {/* Floating Particles - Reduced count and complexity */}
                <div className="absolute top-0 left-1/2 w-2 h-2 bg-primary rounded-full shadow-[0_0_10px_currentColor] animate-float" style={{ transform: 'translateZ(60px)', animationDelay: '0s' }} />
                <div className="absolute bottom-0 right-1/2 w-2.5 h-2.5 bg-purple-400 rounded-full shadow-[0_0_15px_currentColor] animate-float" style={{ transform: 'translateZ(-40px)', animationDelay: '1s' }} />
                <div className="absolute top-1/4 left-1/4 w-1.5 h-1.5 bg-blue-400 rounded-full shadow-[0_0_8px_currentColor] animate-float hidden sm:block" style={{ transform: 'translateZ(20px)', animationDelay: '2s' }} />

                {/* Core */}
                <div className="absolute top-[30%] left-[30%] w-[40%] h-[40%] bg-gradient-to-br from-primary via-purple-600 to-blue-600 rounded-full shadow-[0_0_50px_rgba(var(--primary),0.6)] animate-pulse will-change-opacity blur-md" />
            </div>
        </div>
    );
};
