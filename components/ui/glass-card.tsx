'use client';

import React, { useRef, forwardRef } from 'react';
import { cn } from '@/lib/utils';
import { motion, useMotionTemplate, useMotionValue, HTMLMotionProps } from 'framer-motion';

interface GlassCardProps extends Omit<HTMLMotionProps<"div">, 'children'> {
    children: React.ReactNode;
    enableTilt?: boolean;
    className?: string;
    spotlight?: boolean;
    variant?: 'default' | 'elevated' | 'subtle';
}

export const GlassCard = forwardRef<HTMLDivElement, GlassCardProps>(({
    children,
    enableTilt = false,
    className,
    spotlight = true,
    variant = 'default',
    ...props
}, ref) => {
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        const { left, top } = e.currentTarget.getBoundingClientRect();
        mouseX.set(e.clientX - left);
        mouseY.set(e.clientY - top);
    };

    const handleMouseLeave = () => {
        mouseX.set(0);
        mouseY.set(0);
    };

    const variantStyles = {
        default: "bg-white/[0.03] dark:bg-white/[0.02] border-white/[0.08]",
        elevated: "bg-white/[0.05] dark:bg-white/[0.04] border-white/[0.12] shadow-2xl",
        subtle: "bg-transparent border-white/[0.05]",
    };

    return (
        <motion.div
            ref={ref}
            onMouseMove={spotlight ? handleMouseMove : undefined}
            onMouseLeave={spotlight ? handleMouseLeave : undefined}
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            whileHover={enableTilt ? { y: -4, scale: 1.01 } : undefined}
            transition={{
                duration: 0.4,
                ease: [0.22, 1, 0.36, 1]
            }}
            className={cn(
                "group relative overflow-hidden rounded-2xl",
                "backdrop-blur-xl border",
                "transition-colors duration-300",
                variantStyles[variant],
                className
            )}
            {...props}
        >
            {/* Spotlight Effect - CSS-based for better performance */}
            {spotlight && (
                <motion.div
                    className="pointer-events-none absolute -inset-px rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    style={{
                        background: useMotionTemplate`
                            radial-gradient(
                                500px circle at ${mouseX}px ${mouseY}px,
                                hsla(258, 90%, 66%, 0.12),
                                transparent 60%
                            )
                        `,
                    }}
                />
            )}

            {/* Border Glow on Hover */}
            <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-white/[0.08] group-hover:ring-primary/30 transition-all duration-300 pointer-events-none" />

            {/* Content */}
            <div className="relative z-10 h-full">
                {children}
            </div>
        </motion.div>
    );
});

GlassCard.displayName = 'GlassCard';

// Simple variant without animations for better performance
export const GlassCardSimple = forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement> & { children: React.ReactNode }
>(({ children, className, ...props }, ref) => {
    return (
        <div
            ref={ref}
            className={cn(
                "relative overflow-hidden rounded-xl",
                "bg-white/[0.03] backdrop-blur-lg",
                "border border-white/[0.08]",
                "hover:bg-white/[0.05] hover:border-primary/20",
                "transition-all duration-300",
                className
            )}
            {...props}
        >
            {children}
        </div>
    );
});

GlassCardSimple.displayName = 'GlassCardSimple';

// Card variants for different use cases
export const FeatureCard = forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement> & {
        children: React.ReactNode;
        icon?: React.ReactNode;
        title?: string;
    }
>(({ children, className, icon, title, ...props }, ref) => {
    return (
        <div
            ref={ref}
            className={cn(
                "group relative p-6 rounded-2xl",
                "bg-gradient-to-br from-white/[0.05] to-transparent",
                "border border-white/[0.08]",
                "hover:border-primary/30 hover:from-white/[0.08]",
                "transition-all duration-300",
                className
            )}
            {...props}
        >
            {icon && (
                <div className="inline-flex p-3 rounded-xl bg-primary/10 text-primary mb-4 group-hover:bg-primary/20 transition-colors">
                    {icon}
                </div>
            )}
            {title && (
                <h3 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors">
                    {title}
                </h3>
            )}
            {children}
        </div>
    );
});

FeatureCard.displayName = 'FeatureCard';
