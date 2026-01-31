'use client';

import React, { useRef, useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { motion, useMotionTemplate, useMotionValue } from 'framer-motion';

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
    children: React.ReactNode;
    enableTilt?: boolean;
    className?: string;
    responsivePadding?: boolean;
    glowOnHover?: boolean;
    spotlight?: boolean;
    variant?: 'default' | 'elevated' | 'subtle';
}

export const GlassCard = ({
    children,
    enableTilt = false,
    className,
    responsivePadding = false,
    glowOnHover = true,
    spotlight = true,
    variant = 'default',
    ...props
}: GlassCardProps) => {
    const cardRef = useRef<HTMLDivElement>(null);
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    const handleMouseMove = ({ currentTarget, clientX, clientY }: React.MouseEvent) => {
        const { left, top } = currentTarget.getBoundingClientRect();
        mouseX.set(clientX - left);
        mouseY.set(clientY - top);
    };

    const variantStyles = {
        default: "bg-white/5 dark:bg-black/40 border-white/10 dark:border-white/5",
        elevated: "bg-white/10 dark:bg-black/60 border-white/20 dark:border-white/10 shadow-2xl",
        subtle: "bg-white/[0.02] dark:bg-white/[0.02] border-transparent",
    };

    return (
        <motion.div
            ref={cardRef}
            onMouseMove={handleMouseMove}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            whileHover={enableTilt ? { y: -5, scale: 1.01 } : {}}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className={cn(
                "group relative overflow-hidden rounded-xl backdrop-blur-xl border transition-all duration-500",
                variantStyles[variant],
                responsivePadding && "p-6 sm:p-8",
                className
            )}
            {...props as any}
        >
            {/* SPOTLIGHT EFFECT */}
            {spotlight && (
                <motion.div
                    className="pointer-events-none absolute -inset-px rounded-xl opacity-0 transition duration-300 group-hover:opacity-100"
                    style={{
                        background: useMotionTemplate`
                            radial-gradient(
                                650px circle at ${mouseX}px ${mouseY}px,
                                rgba(139, 92, 246, 0.15),
                                transparent 80%
                            )
                        `,
                    }}
                />
            )}

            {/* BORDER GLOW on Hover */}
            <div className="absolute inset-0 rounded-xl ring-1 ring-white/10 group-hover:ring-primary/50 transition-all duration-500 z-20 pointer-events-none" />

            {/* NOISE TEXTURE */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none z-0 mix-blend-overlay"
                style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='1'/%3E%3C/svg%3E")` }}
            />

            <div className="relative z-10 h-full">
                {children}
            </div>
        </motion.div>
    );
};

export const GlassCardSimple = ({
    children,
    className,
    ...props
}: React.HTMLAttributes<HTMLDivElement> & { children: React.ReactNode }) => {
    return (
        <div
            className={cn(
                "relative overflow-hidden rounded-lg transition-all duration-300",
                "bg-white/5 dark:bg-white/5 backdrop-blur-sm",
                "border border-white/10",
                "hover:bg-white/10 hover:border-primary/30",
                className
            )}
            {...props}
        >
            {children}
        </div>
    );
};
