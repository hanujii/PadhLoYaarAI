'use client';

import React from 'react';
import { useTheme } from 'next-themes';
import { Button } from '@/components/ui/button';
import { Palette, X } from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuLabel,
    DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import { useStore } from '@/lib/store';
import { AnimatePresence, motion } from 'framer-motion';

export function FixedThemeToggle() {
    const { theme, setTheme } = useTheme();
    const { isNotesOpen } = useStore();
    const [mounted, setMounted] = React.useState(false);

    React.useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    // Hide when notes are open to avoid overlap
    if (isNotesOpen) return null;

    const toggleTheme = () => {
        setTheme(theme === 'dark' ? 'light' : 'dark');
    };

    return (
        <div className="fixed top-8 right-6 z-[60] hidden md:block">
            <Button
                variant="ghost"
                size="icon"
                className={cn(
                    "h-10 w-10 rounded-full shadow-lg transition-all duration-300 hover:scale-105",
                    "bg-card/80 hover:bg-secondary text-muted-foreground backdrop-blur-md border border-border"
                )}
                onClick={toggleTheme}
            >
                {theme === 'dark' ? (
                    <div className="w-5 h-5 rounded-full bg-zinc-400" title="Switch to Blue Mode (Light)" />
                ) : (
                    <div className="w-5 h-5 rounded-full bg-blue-900" title="Switch to Gray Mode (Dark)" />
                )}
                <span className="sr-only">Toggle theme</span>
            </Button>
        </div>
    );
}
