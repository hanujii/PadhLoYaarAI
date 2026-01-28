'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { useIsTouchDevice } from '@/hooks/use-responsive';

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
    children: React.ReactNode;
    enableTilt?: boolean;
    className?: string;
    responsivePadding?: boolean;
    glowOnHover?: boolean;
    variant?: 'default' | 'elevated' | 'subtle';
}

export const GlassCard = ({
    children,
    enableTilt = false,
    className,
    responsivePadding = false,
    glowOnHover = true,
    variant = 'default',
    ...props
}: GlassCardProps) => {
    const isTouchDevice = useIsTouchDevice();

    // Hover animation - disabled on touch devices to prevent sticky hover states
    const hoverAnimation = !isTouchDevice ? {
        scale: enableTilt ? 1.02 : 1.01,
        translateY: enableTilt ? -5 : -2
    } : {};

    const variantStyles = {
        default: "bg-white/5 dark:bg-black/20",
        elevated: "bg-white/10 dark:bg-black/30 shadow-2xl",
        subtle: "bg-white/[0.02] dark:bg-black/10",
    };

    return (
        <motion.div
            whileHover={hoverAnimation}
            transition={{ duration: 0.25, ease: [0.25, 0.46, 0.45, 0.94] }}
            className={cn(
                "glass-card h-full relative overflow-hidden rounded-xl transition-all duration-500",
                variantStyles[variant],
                "backdrop-blur-xl",
                "border border-white/10 dark:border-white/5",
                "shadow-[0_8px_32px_0_rgba(31,38,135,0.07)]",
                glowOnHover && "hover:shadow-[0_8px_32px_0_rgba(139,92,246,0.2)] hover:border-primary/40",
                "group",
                responsivePadding && "p-4 sm:p-6 md:p-8",
                className
            )}
            {...props as any}
        >
            {/* Animated Border Gradient */}
            <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                <div className="absolute inset-[1px] rounded-xl bg-gradient-to-br from-primary/20 via-transparent to-purple-500/20" />
            </div>

            {/* Sheen Effect - only on non-touch devices */}
            {!isTouchDevice && (
                <div className="absolute inset-0 -translate-x-[100%] group-hover:animate-[sheen_1s_ease-in-out] bg-gradient-to-r from-transparent via-white/10 to-transparent z-20 pointer-events-none" />
            )}

            {/* Subtle gradient overlay on hover */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            
            {/* Noise Texture for Frosted Realism */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none z-0"
                style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='1'/%3E%3C/svg%3E")` }}
            />

            {/* Content */}
            <div className="relative z-10 h-full">
                {children}
            </div>

            {/* Moving Border Glow */}
            <div className="absolute inset-0 rounded-xl ring-1 ring-white/10 group-hover:ring-primary/40 transition-all duration-500 pointer-events-none" />
            
            {/* Corner accent glow */}
            <div className="absolute -top-20 -right-20 w-40 h-40 bg-primary/10 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
        </motion.div>
    );
};

// Simpler card variant for compact layouts
export const GlassCardSimple = ({
    children,
    className,
    ...props
}: React.HTMLAttributes<HTMLDivElement> & { children: React.ReactNode }) => {
    return (
        <div
            className={cn(
                "relative overflow-hidden rounded-lg transition-all duration-300",
                "bg-white/5 dark:bg-black/10 backdrop-blur-md",
                "border border-white/10 dark:border-white/5",
                "hover:bg-white/10 dark:hover:bg-black/20",
                "hover:border-primary/30",
                className
            )}
            {...props}
        >
            {children}
        </div>
    );
};
