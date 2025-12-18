'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { ToolBackButton } from '@/components/global/ToolBackButton';

interface ToolPageLayoutProps {
    children: React.ReactNode;
    title: string;
    description?: string;
    icon?: React.ReactNode;
    maxWidth?: 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | '6xl' | '7xl' | 'full';
    className?: string;
    showBackButton?: boolean;
    headerContent?: React.ReactNode;
}

const maxWidthClasses = {
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
    '3xl': 'max-w-3xl',
    '4xl': 'max-w-4xl',
    '5xl': 'max-w-5xl',
    '6xl': 'max-w-6xl',
    '7xl': 'max-w-7xl',
    full: 'max-w-full',
};

/**
 * Standardized layout wrapper for all tool pages
 * Provides consistent responsive padding, spacing, and structure
 */
export function ToolPageLayout({
    children,
    title,
    description,
    icon,
    maxWidth = '7xl',
    className,
    showBackButton = true,
    headerContent,
}: ToolPageLayoutProps) {
    return (
        <div className={cn(
            'w-full mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 space-y-6 sm:space-y-8',
            maxWidthClasses[maxWidth],
            className
        )}>
            {/* Back Button Row */}
            {showBackButton && (
                <div className="flex items-center justify-between flex-wrap gap-4">
                    <ToolBackButton />
                    {headerContent && (
                        <div className="flex items-center gap-2 sm:gap-3">
                            {headerContent}
                        </div>
                    )}
                </div>
            )}

            {/* Title Section */}
            <div className="text-center space-y-2 sm:space-y-3">
                {icon && (
                    <div className="flex justify-center mb-3 sm:mb-4">
                        {icon}
                    </div>
                )}
                <h1 className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight">
                    {title}
                </h1>
                {description && (
                    <p className="text-sm xs:text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto px-4">
                        {description}
                    </p>
                )}
            </div>

            {/* Main Content */}
            <div className="w-full">
                {children}
            </div>
        </div>
    );
}

/**
 * Responsive grid layout for tool input/output sections
 */
export function ToolGrid({ children, columns = 12, className }: {
    children: React.ReactNode;
    columns?: 8 | 12;
    className?: string;
}) {
    return (
        <div className={cn(
            'grid grid-cols-1 gap-4 sm:gap-6',
            columns === 12 ? 'lg:grid-cols-12' : 'lg:grid-cols-8',
            className
        )}>
            {children}
        </div>
    );
}

/**
 * Sidebar panel for inputs/configuration
 */
export function ToolSidebar({ children, className, span = 4 }: {
    children: React.ReactNode;
    className?: string;
    span?: 3 | 4 | 5;
}) {
    const spanClasses = {
        3: 'lg:col-span-3',
        4: 'lg:col-span-4',
        5: 'lg:col-span-5',
    };

    return (
        <div className={cn(
            'col-span-full',
            spanClasses[span],
            className
        )}>
            {children}
        </div>
    );
}

/**
 * Main content area for outputs
 */
export function ToolMain({ children, className, span = 8 }: {
    children: React.ReactNode;
    className?: string;
    span?: 7 | 8 | 9;
}) {
    const spanClasses = {
        7: 'lg:col-span-7',
        8: 'lg:col-span-8',
        9: 'lg:col-span-9',
    };

    return (
        <div className={cn(
            'col-span-full',
            spanClasses[span],
            className
        )}>
            {children}
        </div>
    );
}
