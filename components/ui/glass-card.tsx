'use client';

import React, { useRef, useState } from 'react';
import { cn } from '@/lib/utils';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
    children: React.ReactNode;
    enableTilt?: boolean;
    className?: string;
}

export const GlassCard = ({ children, enableTilt = false, className, ...props }: GlassCardProps) => {
    return (
        <motion.div
            whileHover={{ scale: 1.02, translateY: -5 }}
            className={cn(
                "glass-card h-full relative overflow-hidden transition-all duration-500",
                "bg-white/5 dark:bg-black/20 backdrop-blur-xl",
                "border border-white/10 dark:border-white/5",
                "shadow-[0_8px_32px_0_rgba(31,38,135,0.07)]",
                "hover:shadow-[0_8px_32px_0_rgba(139,92,246,0.15)] hover:border-primary/50",
                "group",
                className
            )}
            {...props as any}
        >
            {/* Sheen Effect */}
            <div className="absolute inset-0 -translate-x-[100%] group-hover:animate-[sheen_1s_ease-in-out] bg-gradient-to-r from-transparent via-white/10 to-transparent z-20 pointer-events-none" />

            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="relative z-10 h-full">
                {children}
            </div>
        </motion.div>
    );
};
