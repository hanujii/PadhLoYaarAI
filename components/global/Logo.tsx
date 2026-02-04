import React from 'react';
import { cn } from "@/lib/utils";

interface LogoProps {
    className?: string;
}

export const Logo: React.FC<LogoProps> = ({ className }) => {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 100 100"
            fill="none"
            className={cn("w-8 h-8", className)}
        >
            <path
                d="M50 5 L90 25 L90 75 L50 95 L10 75 L10 25 Z"
                stroke="currentColor"
                strokeWidth="8"
                strokeLinejoin="round"
                fill="none"
                className="text-primary"
            />
            <path
                d="M50 25 L75 37.5 L75 62.5 L50 75 L25 62.5 L25 37.5 Z"
                fill="currentColor"
                className="text-primary/20"
            />
            <circle cx="50" cy="50" r="10" fill="currentColor" className="text-primary" />
        </svg>
    );
};
