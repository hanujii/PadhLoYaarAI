'use client';

import React, { useEffect, useRef } from 'react';
import Link from 'next/link';
import { useTheme } from 'next-themes';
import { usePathname } from 'next/navigation';
import { useStore } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { Clock, Music, Linkedin, Instagram, Play, Pause, Volume2, User, Bookmark, History, Settings, Menu, Sparkles, Home, HelpCircle, CreditCard, LogIn, LogOut } from 'lucide-react';
import { Logo } from '@/components/global/Logo';
import { ProfilePopup } from '@/components/global/ProfilePopup';
import { cn } from '@/lib/utils';
import { useAuth } from '@/components/auth/AuthContext';
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
    'lofi': 'https://cdn.pixabay.com/audio/2023/09/04/audio_c89e926532.mp3',
    'soothing': 'https://cdn.pixabay.com/audio/2022/10/25/audio_cfb63ad2bf.mp3',
    'meditation': 'https://cdn.pixabay.com/audio/2023/04/24/audio_86ef3e88c2.mp3',
    'nature': 'https://cdn.pixabay.com/audio/2022/08/23/audio_4fc54e1a55.mp3',
};

export function Header() {
    const { setTheme } = useTheme();
    const pathname = usePathname();
    const { user } = useAuth();
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

                <div className="relative rounded-full border border-border bg-card/95 backdrop-blur-3xl shadow-[0_8px_32px_0_rgba(0,0,0,0.2)] dark:shadow-[0_8px_32px_0_rgba(0,0,0,0.4)] transition-all duration-300">
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
                                    <SheetContent side="left" className="w-[300px] border-r border-border bg-card/95 backdrop-blur-3xl flex flex-col">
                                        <SheetHeader className="text-left mb-6">
                                            <SheetTitle className="flex items-center gap-2">
                                                <div className="relative flex items-center justify-center w-8 h-8 rounded-xl bg-gradient-to-br from-primary/20 to-transparent border border-border overflow-hidden">
                                                    <Logo className="w-5 h-5 text-primary" />
                                                </div>
                                                <span className="font-bold text-xl">ply<span className="text-primary">AI</span></span>
                                            </SheetTitle>
                                        </SheetHeader>

                                        {/* Navigation Section */}
                                        <div className="flex-1 space-y-6">
                                            <div>
                                                <p className="text-xs font-medium text-muted-foreground px-3 mb-2">Navigation</p>
                                                <div className="flex flex-col gap-1">
                                                    {[
                                                        { name: 'Dashboard', href: '/', icon: Home },
                                                        { name: 'Tools', href: '/tools', icon: Sparkles },
                                                        { name: 'Pricing', href: '/pricing', icon: CreditCard },
                                                        { name: 'Help', href: '/help', icon: HelpCircle },
                                                    ].map((item) => (
                                                        <Link
                                                            key={item.href}
                                                            href={item.href}
                                                            onClick={() => setIsOpen(false)}
                                                            className={cn(
                                                                "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all",
                                                                pathname === item.href
                                                                    ? "bg-primary/10 text-primary"
                                                                    : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                                                            )}
                                                        >
                                                            <item.icon className="w-4 h-4" />
                                                            {item.name}
                                                        </Link>
                                                    ))}
                                                </div>
                                            </div>

                                            {/* My Stuff Section */}
                                            <div>
                                                <p className="text-xs font-medium text-muted-foreground px-3 mb-2">My Stuff</p>
                                                <div className="flex flex-col gap-1">
                                                    {[
                                                        { name: 'History', href: '/history', icon: History },
                                                        { name: 'Saved', href: '/history?tab=saved', icon: Bookmark },
                                                        { name: 'Settings', href: '/settings', icon: Settings },
                                                    ].map((item) => (
                                                        <Link
                                                            key={item.href}
                                                            href={item.href}
                                                            onClick={() => setIsOpen(false)}
                                                            className={cn(
                                                                "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all",
                                                                pathname === item.href
                                                                    ? "bg-primary/10 text-primary"
                                                                    : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                                                            )}
                                                        >
                                                            <item.icon className="w-4 h-4" />
                                                            {item.name}
                                                        </Link>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Bottom Section - User Profile or Login */}
                                        <div className="border-t border-border pt-4 mt-4">
                                            {user ? (
                                                <div className="space-y-4">
                                                    <div className="flex items-center gap-3 px-2">
                                                        <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-primary to-purple-600 flex items-center justify-center text-white text-sm font-bold shadow-lg">
                                                            {user.user_metadata?.avatar_url ? (
                                                                <img src={user.user_metadata?.avatar_url} alt="Avatar" className="w-full h-full rounded-full object-cover" />
                                                            ) : (
                                                                (user.user_metadata?.full_name || user.email || 'U').charAt(0).toUpperCase()
                                                            )}
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <p className="text-sm font-medium truncate text-foreground">
                                                                {user.user_metadata?.full_name || 'User'}
                                                            </p>
                                                            <p className="text-xs text-muted-foreground truncate">
                                                                {user.email}
                                                            </p>
                                                        </div>
                                                    </div>

                                                    <Button
                                                        variant="ghost"
                                                        className="w-full justify-start text-red-500 hover:text-red-400 hover:bg-red-500/10"
                                                        onClick={async () => {
                                                            const { createClient } = require('@/lib/supabase/client');
                                                            const supabase = createClient();
                                                            await supabase.auth.signOut();
                                                            window.location.reload();
                                                        }}
                                                    >
                                                        <LogOut className="w-4 h-4 mr-2" />
                                                        Sign Out
                                                    </Button>
                                                </div>
                                            ) : (
                                                <Link
                                                    href="/login"
                                                    onClick={() => setIsOpen(false)}
                                                    className="flex items-center justify-center gap-2 w-full px-4 py-3 rounded-xl bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors"
                                                >
                                                    <LogIn className="w-4 h-4" />
                                                    Sign In
                                                </Link>
                                            )}
                                        </div>
                                    </SheetContent>
                                </Sheet>
                            </div>

                            {/* BRAND LOGO */}
                            <Link href="/" className="flex items-center gap-2 group hover:opacity-90 transition-opacity">
                                <div className="relative flex items-center justify-center w-8 h-8 rounded-xl bg-gradient-to-br from-white/10 to-transparent border border-white/10 overflow-hidden group-hover:scale-105 transition-transform duration-300">
                                    <Logo className="w-5 h-5 text-primary" />
                                </div>
                                <span className="font-bold text-lg tracking-tight hidden xs:block">
                                    <span className="text-foreground">ply</span>
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
                                                : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                                        )}
                                    >
                                        {item.name}
                                    </Link>
                                ))}
                                <div className="w-px h-4 bg-white/10 mx-1" />

                                <DropdownMenu modal={false}>
                                    <DropdownMenuTrigger asChild>
                                        <button className="px-3 py-1.5 rounded-full text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-secondary transition-all flex items-center gap-1">
                                            Tools <Sparkles className="w-3 h-3 ml-1 opacity-50" />
                                        </button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="start" className="w-56 p-2 bg-card/95 backdrop-blur-xl border-border">
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
                            <div className="flex items-center bg-secondary/50 rounded-full border border-border p-1">
                                {/* Timer */}
                                <DropdownMenu modal={false}>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" size="sm" className="h-8 rounded-full px-3 text-xs font-mono hover:bg-secondary hover:text-primary transition-colors">
                                            {formattedTime}
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end" className="bg-card/95 backdrop-blur-xl border-border">
                                        <div className="p-2 grid grid-cols-3 gap-1 w-48">
                                            {timerPresets.map(min => (
                                                <Button key={min} variant="outline" size="sm" onClick={() => setDuration(min)} className="h-8 text-xs border-border hover:bg-primary/20 hover:text-primary">
                                                    {min}m
                                                </Button>
                                            ))}
                                        </div>
                                    </DropdownMenuContent>
                                </DropdownMenu>

                                <div className="w-px h-3 bg-border mx-1" />

                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className={cn("h-8 w-8 rounded-full hover:bg-secondary transition-all", isActive && "text-primary bg-primary/10")}
                                    onClick={toggleTimer}
                                >
                                    {isActive ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3 ml-0.5" />}
                                </Button>

                                <div className="w-px h-3 bg-border mx-1" />

                                {/* Music */}
                                <Popover modal={false}>
                                    <PopoverTrigger asChild>
                                        <Button variant="ghost" size="icon" className={cn("h-8 w-8 rounded-full hover:bg-secondary transition-all", isPlaying && "text-primary bg-primary/10 animate-pulse")}>
                                            <Music className="w-3.5 h-3.5" />
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-64 p-3 bg-card/95 backdrop-blur-xl border-border mr-4" align="end">
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

                            {/* Removed ThemeCustomizer as per user request */}

                            {/* Profile Popup - handles auth state */}
                            <ProfilePopup />

                        </div>
                    </div>
                </div>
            </div>
        </header >
    );
}
