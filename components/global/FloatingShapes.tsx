"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export function FloatingShapes() {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    const shapes = [
        // Top Left - Cyan Ring
        {
            className: "border-cyan-500/20",
            style: { top: '10%', left: '5%', width: '100px', height: '100px', border: '2px solid', borderRadius: '50%' },
            animate: {
                rotateX: [0, 180, 360],
                rotateY: [0, 180, 360],
                y: [0, 20, 0]
            },
            transition: { duration: 20, repeat: Infinity, ease: "linear" as const }
        },
        // Middle Right - Purple Cube-ish
        {
            className: "bg-purple-500/10 backdrop-blur-sm",
            style: { top: '40%', right: '5%', width: '150px', height: '150px', borderRadius: '20px' },
            animate: {
                rotate: [0, 360],
                scale: [1, 1.1, 1],
            },
            transition: { duration: 25, repeat: Infinity, ease: "linear" as const }
        },
        // Bottom Left - Blue Triangle/Diamond
        {
            className: "bg-blue-500/10",
            style: { bottom: '15%', left: '10%', width: '120px', height: '120px', transform: 'rotate(45deg)' },
            animate: {
                rotate: [45, 225],
                y: [0, -30, 0],
            },
            transition: { duration: 18, repeat: Infinity, type: "tween" as const, ease: "easeInOut" as const }
        },
        // Top Right - Yellow Ring
        {
            className: "border-yellow-500/10",
            style: { top: '15%', right: '15%', width: '80px', height: '80px', border: '4px solid', borderRadius: '50%' },
            animate: {
                scale: [1, 1.2, 1],
                opacity: [0.3, 0.6, 0.3],
            },
            transition: { duration: 8, repeat: Infinity, ease: "easeInOut" as const }
        }
    ];

    return (
        <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
            {shapes.map((shape, i) => (
                <motion.div
                    key={i}
                    className={`absolute ${shape.className}`}
                    style={shape.style}
                    animate={shape.animate}
                    transition={shape.transition}
                />
            ))}

            {/* Gradient Orbs for glow */}
            <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[100px] -translate-x-1/2 -translate-y-1/2 mix-blend-screen" />
            <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-purple-500/20 rounded-full blur-[100px] translate-x-1/2 translate-y-1/2 mix-blend-screen" />
        </div>
    );
}
