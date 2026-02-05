'use client';

import { useEffect, useState } from 'react';
import { Palette, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';

const themes = [
    { name: 'Cosmic', value: 'cosmic', color: 'bg-indigo-500' },
    { name: 'Sunset', value: 'sunset', color: 'bg-rose-500' },
    { name: 'Ocean', value: 'ocean', color: 'bg-cyan-500' },
    { name: 'Matrix', value: 'matrix', color: 'bg-green-500' },
    { name: 'Luxury', value: 'luxury', color: 'bg-yellow-500' },
];

export function ThemeCustomizer() {
    const [currentTheme, setCurrentTheme] = useState('cosmic');

    useEffect(() => {
        // Load saved theme
        const saved = localStorage.getItem('theme-palette');
        if (saved) {
            setCurrentTheme(saved);
            document.documentElement.setAttribute('data-theme', saved);
        }
    }, []);

    const setTheme = (theme: string) => {
        setCurrentTheme(theme);
        localStorage.setItem('theme-palette', theme);
        document.documentElement.setAttribute('data-theme', theme);
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full">
                    <Palette className="h-4 w-4 text-muted-foreground" />
                    <span className="sr-only">Toggle theme</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-40">
                <DropdownMenuLabel>Theme Palette</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {themes.map((theme) => (
                    <DropdownMenuItem
                        key={theme.value}
                        onClick={() => setTheme(theme.value)}
                        className="flex items-center justify-between cursor-pointer"
                    >
                        <div className="flex items-center gap-2">
                            <div className={cn("h-3 w-3 rounded-full", theme.color)} />
                            <span>{theme.name}</span>
                        </div>
                        {currentTheme === theme.value && <Check className="h-4 w-4" />}
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
