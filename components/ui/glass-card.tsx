'use client';

import React, { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { useIsTouchDevice } from '@/hooks/use-responsive';

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
    children: React.ReactNode;
    enableTilt?: boolean;
    className?: string;
    responsivePadding?: boolean;
}

export const GlassCard = ({
    children,
    enableTilt = false,
    className,
    responsivePadding = false,
    ...props
}: GlassCardProps) => {
    const isTouchDevice = useIsTouchDevice();

    // Hover animation - disabled on touch devices to prevent sticky hover states
    const hoverAnimation = !isTouchDevice ? {
        scale: 1.02,
        translateY: -5
    } : {};

    return (
        <motion.div
            whileHover={hoverAnimation}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className={cn(
                "glass-card h-full relative overflow-hidden transition-all duration-500",
                "bg-white/5 dark:bg-black/20 backdrop-blur-xl",
                "border border-white/10 dark:border-white/5",
                "shadow-[0_8px_32px_0_rgba(31,38,135,0.07)]",
                "hover:shadow-[0_8px_32px_0_rgba(139,92,246,0.15)] hover:border-primary/50",
                "group",
                responsivePadding && "p-4 sm:p-6 md:p-8",
                className
            )}
            {...props as any}
        >
            {/* Sheen Effect - only on non-touch devices */}
            {!isTouchDevice && (
                <div className="absolute inset-0 -translate-x-[100%] group-hover:animate-[sheen_1s_ease-in-out] bg-gradient-to-r from-transparent via-white/10 to-transparent z-20 pointer-events-none" />
            )}

            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="relative z-10 h-full">
                {children}
            </div>
        </motion.div>
    );
};
