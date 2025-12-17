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
            whileHover={{ scale: 1.01 }}
            className={cn("glass-card h-full transition-colors duration-300 border border-white/10 hover:border-primary/40 p-6 md:p-8", className)}
            {...props as any}
        >
            {children}
        </motion.div>
    );
};
