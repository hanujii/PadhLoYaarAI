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
import { AnimatePresence, motion } from 'framer-motion';

export function FixedThemeToggle() {
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = React.useState(false);
    const [isOpen, setIsOpen] = React.useState(false);

    React.useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    const themes = [
        { name: 'Cosmic (Default)', value: 'dark', color: 'bg-zinc-950' },
        { name: 'Sunset', value: 'sunset', color: 'bg-orange-950' },
        { name: 'Ocean', value: 'ocean', color: 'bg-blue-950' },
        { name: 'Matrix', value: 'matrix', color: 'bg-green-950' },
        { name: 'Luxury', value: 'luxury', color: 'bg-yellow-950' },
    ];

    return (
        <div className="fixed top-8 right-6 z-[60] hidden md:block">
            <DropdownMenu open={isOpen} onOpenChange={setIsOpen} modal={false}>
                <DropdownMenuTrigger asChild>
                    <Button
                        variant="ghost"
                        size="icon"
                        className={cn(
                            "h-10 w-10 rounded-full shadow-lg transition-all duration-300 hover:scale-105",
                            isOpen ? "rotate-90 bg-primary text-white" : "bg-black/60 hover:bg-white/10 text-muted-foreground backdrop-blur-md border border-white/10"
                        )}
                        onClick={(e) => e.preventDefault()}
                    >
                        {isOpen ? <X className="w-5 h-5" /> : <Palette className="w-5 h-5" />}
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 p-2 bg-black/90 backdrop-blur-xl border-white/10 mt-2">
                    <DropdownMenuLabel className="text-xs text-muted-foreground uppercase tracking-widest px-2">Select Theme</DropdownMenuLabel>
                    <DropdownMenuSeparator className="bg-white/10" />
                    <div className="grid gap-1">
                        {themes.map((t) => (
                            <DropdownMenuItem
                                key={t.value}
                                onClick={() => setTheme(t.value)}
                                className={cn(
                                    "flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer transition-colors",
                                    theme === t.value ? "bg-white/10 text-white" : "text-muted-foreground hover:text-white hover:bg-white/5"
                                )}
                            >
                                <div className={cn("w-4 h-4 rounded-full border border-white/10", t.color)} />
                                <span className="flex-1 text-sm font-medium">{t.name}</span>
                            </DropdownMenuItem>
                        ))}
                    </div>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    );
}
