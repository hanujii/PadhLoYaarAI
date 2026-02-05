'use client';

import React, { useEffect, useRef } from 'react';
import Link from 'next/link';
import { useTheme } from 'next-themes';
import { usePathname } from 'next/navigation';
import { useStore } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { Clock, Music, Linkedin, Instagram, Play, Pause, Volume2, User, Bookmark, History, Settings, Menu, Sparkles } from 'lucide-react';
import { Logo } from '@/components/global/Logo';
import { cn } from '@/lib/utils';
import { ThemeCustomizer } from '@/components/global/ThemeCustomizer';
import { TOOLS } from '@/lib/tools-data';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuLabel,
    DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from '@/components/ui/sheet';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import { Separator } from '@/components/ui/separator';

const SAFE_MUSIC_URLS: Record<string, string> = {
    'lofi': '/sounds/lofi.mp3',
    'soothing': '/sounds/soothing.mp3',
    'meditation': '/sounds/meditation.ogg',
    'nature': '/sounds/nature.ogg',
};

export function Header() {
    const { setTheme } = useTheme();
    const pathname = usePathname();
    const {
        timeLeft, isActive, startTimer, stopTimer, resetTimer, setDuration,
        isPlaying, togglePlay, genre, setGenre
    } = useStore();

    const audioRef = useRef<HTMLAudioElement | null>(null);
    const [isOpen, setIsOpen] = React.useState(false);

    // Audio Control Effect
    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.volume = 0.4;
            if (isPlaying) {
                audioRef.current.play().catch(e => console.error("Audio play failed:", e));
            } else {
                audioRef.current.pause();
            }
        }
    }, [isPlaying, genre]);

    // Timer Tick Effect
    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (isActive && timeLeft > 0) {
            interval = setInterval(() => {
                useStore.getState().tick();
            }, 1000);
        } else if (timeLeft === 0) {
            useStore.getState().stopTimer();
        }
        return () => clearInterval(interval);
    }, [isActive, timeLeft]);

    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    const formattedTime = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

    const toggleTimer = () => {
        if (isActive) stopTimer();
        else startTimer();
    };

    // Tools list for dropdown
    const tools = TOOLS.map(t => ({ name: t.title, href: t.href }));

    const timerPresets = [10, 15, 25, 45, 60];

    const [mounted, setMounted] = React.useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    // Prevent Hydration Mismatch
    if (!mounted) {
        return (
            <header className="fixed top-4 left-0 right-0 z-50 flex justify-center px-4 pointer-events-none opacity-0">
                <div className="w-full max-w-6xl h-16" />
            </header>
        );
    }

    return (
        <header className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-full flex justify-center px-4 pointer-events-none">
            {/* Hidden Audio Element */}
            <audio ref={audioRef} src={SAFE_MUSIC_URLS[genre]} loop />

            <div className="relative w-full max-w-5xl group/header pointer-events-auto">
                {/* Spotlight Border Effect */}
                <div className="absolute -inset-[1px] rounded-full bg-gradient-to-r from-transparent via-primary/50 to-transparent opacity-0 group-hover/header:opacity-100 blur-sm transition-opacity duration-500" />

                <div className="relative rounded-full border border-white/10 bg-black/60 backdrop-blur-3xl shadow-[0_8px_32px_0_rgba(0,0,0,0.4)] transition-all duration-300">
                    <div className="flex h-14 items-center justify-between px-2 pl-4 md:pl-6 md:pr-2">

                        {/* LEFT: Mobile Menu + Logo */}
                        <div className="flex items-center gap-4">
                            {/* Mobile Menu */}
                            <div className="md:hidden">
                                <Sheet open={isOpen} onOpenChange={setIsOpen}>
                                    <SheetTrigger asChild>
                                        <Button variant="ghost" size="icon" className="hover:bg-white/10 rounded-full w-9 h-9">
                                            <Menu className="h-5 w-5" />
                                        </Button>
                                    </SheetTrigger>
                                    <SheetContent side="left" className="w-[300px] border-r border-white/10 bg-black/90 backdrop-blur-3xl">
                                        <SheetHeader className="text-left mb-6">
                                            <SheetTitle className="flex items-center gap-2">
                                                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary via-purple-500 to-blue-500 flex items-center justify-center text-white font-bold text-lg">
                                                    P
                                                </div>
                                                <span className="font-bold text-xl">ply<span className="text-primary">AI</span></span>
                                            </SheetTitle>
                                        </SheetHeader>
                                        <div className="flex flex-col gap-1">
                                            {[
                                                { name: 'Dashboard', href: '/', icon: Sparkles },
                                                { name: 'Tools', href: '/tools', icon: Menu },
                                                { name: 'Pricing', href: '/pricing', icon: Bookmark },
                                                { name: 'Help', href: '/help', icon: Settings },
                                            ].map((item) => (
                                                <Link
                                                    key={item.href}
                                                    href={item.href}
                                                    onClick={() => setIsOpen(false)}
                                                    className={cn(
                                                        "flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium transition-all",
                                                        pathname === item.href
                                                            ? "bg-primary/20 text-primary hover:bg-primary/30"
                                                            : "text-muted-foreground hover:bg-white/5 hover:text-white"
                                                    )}
                                                >
                                                    <item.icon className="w-4 h-4" />
                                                    {item.name}
                                                </Link>
                                            ))}
                                        </div>
                                    </SheetContent>
                                </Sheet>
                            </div>

                            {/* BRAND LOGO */}
                            <Link href="/" className="flex items-center gap-2 group hover:opacity-90 transition-opacity">
                                <div className="relative flex items-center justify-center w-8 h-8 rounded-xl bg-gradient-to-br from-white/10 to-transparent border border-white/10 overflow-hidden group-hover:scale-105 transition-transform duration-300">
                                    <Logo className="w-5 h-5 text-white" />
                                </div>
                                <span className="font-bold text-lg tracking-tight hidden xs:block">
                                    <span className="text-white">ply</span>
                                    <span className="bg-gradient-to-r from-primary to-purple-400 bg-clip-text text-transparent">AI</span>
                                </span>
                            </Link>

                            {/* Desktop Nav Pills */}
                            <nav className="hidden md:flex items-center p-1 bg-white/5 rounded-full border border-white/5 ml-4">
                                {[
                                    { name: 'Dashboard', href: '/' },
                                    { name: 'Pricing', href: '/pricing' },
                                    { name: 'Help', href: '/help' },
                                ].map((item) => (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        className={cn(
                                            "px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-300",
                                            pathname === item.href
                                                ? "bg-primary text-white shadow-lg shadow-primary/25"
                                                : "text-muted-foreground hover:text-white hover:bg-white/5"
                                        )}
                                    >
                                        {item.name}
                                    </Link>
                                ))}
                                <div className="w-px h-4 bg-white/10 mx-1" />

                                <DropdownMenu modal={false}>
                                    <DropdownMenuTrigger asChild>
                                        <button className="px-3 py-1.5 rounded-full text-sm font-medium text-muted-foreground hover:text-white hover:bg-white/5 transition-all flex items-center gap-1">
                                            Tools <Sparkles className="w-3 h-3 ml-1 opacity-50" />
                                        </button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="start" className="w-56 p-2 bg-black/90 backdrop-blur-xl border-white/10">
                                        {tools.slice(0, 6).map((tool) => (
                                            <DropdownMenuItem key={tool.href} asChild className="rounded-lg cursor-pointer">
                                                <Link href={tool.href}>{tool.name}</Link>
                                            </DropdownMenuItem>
                                        ))}
                                        <DropdownMenuSeparator className="bg-white/10" />
                                        <DropdownMenuItem asChild className="rounded-md justify-center font-medium text-primary cursor-pointer">
                                            <Link href="#tools">View All Tools</Link>
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </nav>
                        </div>

                        {/* RIGHT: Actions */}
                        <div className="flex items-center gap-2">

                            {/* Timer & Music Group */}
                            <div className="flex items-center bg-white/5 rounded-full border border-white/5 p-1">
                                {/* Timer */}
                                <DropdownMenu modal={false}>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" size="sm" className="h-8 rounded-full px-3 text-xs font-mono hover:bg-white/10 hover:text-primary transition-colors">
                                            {formattedTime}
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end" className="bg-black/90 backdrop-blur-xl border-white/10">
                                        <div className="p-2 grid grid-cols-3 gap-1 w-48">
                                            {timerPresets.map(min => (
                                                <Button key={min} variant="outline" size="sm" onClick={() => setDuration(min)} className="h-8 text-xs border-white/10 hover:bg-primary/20 hover:text-primary">
                                                    {min}m
                                                </Button>
                                            ))}
                                        </div>
                                    </DropdownMenuContent>
                                </DropdownMenu>

                                <div className="w-px h-3 bg-white/10 mx-1" />

                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className={cn("h-8 w-8 rounded-full hover:bg-white/10 transition-all", isActive && "text-primary bg-primary/10")}
                                    onClick={toggleTimer}
                                >
                                    {isActive ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3 ml-0.5" />}
                                </Button>

                                <div className="w-px h-3 bg-white/10 mx-1" />

                                {/* Music */}
                                <Popover modal={false}>
                                    <PopoverTrigger asChild>
                                        <Button variant="ghost" size="icon" className={cn("h-8 w-8 rounded-full hover:bg-white/10 transition-all", isPlaying && "text-primary bg-primary/10 animate-pulse")}>
                                            <Music className="w-3.5 h-3.5" />
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-64 p-3 bg-black/90 backdrop-blur-xl border-white/10 mr-4" align="end">
                                        <div className="flex items-center justify-between mb-3">
                                            <span className="text-xs font-medium text-muted-foreground uppercase tracking-widest">Soundscapes</span>
                                            {isPlaying && <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />}
                                        </div>
                                        <div className="grid grid-cols-2 gap-2">
                                            {Object.keys(SAFE_MUSIC_URLS).map((g) => (
                                                <Button
                                                    key={g}
                                                    variant={genre === g ? "default" : "outline"}
                                                    size="sm"
                                                    className={cn("justify-start capitalize text-xs h-8", genre === g && "bg-primary text-white border-primary")}
                                                    onClick={() => {
                                                        setGenre(g);
                                                        if (!isPlaying) togglePlay();
                                                    }}
                                                >
                                                    {g}
                                                </Button>
                                            ))}
                                        </div>
                                    </PopoverContent>
                                </Popover>
                            </div>

                            <ThemeCustomizer />
                            {/* User Menu */}
                            <DropdownMenu modal={false}>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="icon" className="h-10 w-10 rounded-full border border-white/10 hover:bg-white/5 hover:border-primary/50 transition-all ml-1 group">
                                        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-primary/80 to-purple-600 flex items-center justify-center text-white shadow-lg shadow-primary/20 group-hover:scale-105 transition-transform">
                                            <User className="w-4 h-4" />
                                        </div>
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-56 p-2 bg-black/90 backdrop-blur-xl border-white/10 mt-2">
                                    <div className="px-2 py-1.5 pb-3">
                                        <p className="text-sm font-medium">My Account</p>
                                        <p className="text-xs text-muted-foreground">Manage settings & preferences</p>
                                    </div>
                                    <DropdownMenuItem asChild className="rounded-lg cursor-pointer">
                                        <Link href="/account"><User className="mr-2 h-4 w-4" /> Profile</Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem asChild className="rounded-lg cursor-pointer">
                                        <Link href="/history"><History className="mr-2 h-4 w-4" /> History</Link>
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>

                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
}
