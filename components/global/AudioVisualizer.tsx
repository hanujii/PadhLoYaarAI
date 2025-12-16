'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface AudioVisualizerProps {
    isActive: boolean;
    color?: string;
}

export const AudioVisualizer = ({ isActive, color = "bg-primary" }: AudioVisualizerProps) => {
    return (
        <div className="flex items-center justify-center gap-1 h-12">
            {[...Array(5)].map((_, i) => (
                <motion.div
                    key={i}
                    className={`w-2 rounded-full ${color}`}
                    animate={{
                        height: isActive ? [10, 32, 10] : 8,
                        opacity: isActive ? 1 : 0.5,
                    }}
                    transition={{
                        duration: 0.5,
                        repeat: isActive ? Infinity : 0,
                        repeatType: "reverse",
                        delay: i * 0.1,
                    }}
                />
            ))}
        </div>
    );
};
