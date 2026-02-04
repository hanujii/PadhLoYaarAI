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
        <header className="fixed top-4 left-0 right-0 z-50 flex justify-center px-3 xs:px-4 pointer-events-none">
            {/* Hidden Audio Element */}
            <audio ref={audioRef} src={SAFE_MUSIC_URLS[genre]} loop />

            <div className="w-full max-w-6xl rounded-2xl border border-white/10 bg-black/40 backdrop-blur-2xl shadow-[0_8px_32px_0_rgba(0,0,0,0.4),0_0_0_1px_rgba(255,255,255,0.05)_inset] pointer-events-auto transition-all duration-500 hover:border-white/20 hover:bg-black/50 hover:shadow-[0_8px_40px_0_rgba(139,92,246,0.15)]">
                <div className="flex h-14 xs:h-16 items-center justify-between px-3 xs:px-4 sm:px-5 md:px-6">

                    {/* LEFT: Mobile Menu + Logo */}
                    <div className="flex items-center gap-2 xs:gap-3 sm:gap-4 md:gap-6">
                        {/* Mobile Menu */}
                        <div className="md:hidden">
                            <Sheet open={isOpen} onOpenChange={setIsOpen}>
                                <SheetTrigger asChild>
                                    <Button variant="ghost" size="icon" className="mr-0 hover:bg-white/10 h-10 w-10 touch-target rounded-xl">
                                        <Menu className="h-5 w-5" />
                                    </Button>
                                </SheetTrigger>
                                <SheetContent side="left" className="w-[85vw] sm:w-[350px] max-h-screen overflow-y-auto bg-background/95 backdrop-blur-xl">
                                    <SheetHeader>
                                        <SheetTitle className="flex items-center gap-2">
                                            <Logo className="w-6 h-6" />
                                            <span>Menu</span>
                                        </SheetTitle>
                                    </SheetHeader>
                                    <div className="flex flex-col gap-3 py-4">
                                        <Link href="/" className="text-lg font-medium py-2 hover:text-primary transition-colors" onClick={() => setIsOpen(false)}>
                                            Dashboard
                                        </Link>
                                        <Separator className="my-1" />
                                        <div className="space-y-2 max-h-[50vh] overflow-y-auto pr-2">
                                            <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 flex items-center gap-2">
                                                <Sparkles className="w-3 h-3" />
                                                Tools
                                            </h4>
                                            {tools.map((tool) => (
                                                <Link
                                                    key={tool.href}
                                                    href={tool.href}
                                                    className="block text-sm py-2 hover:text-primary transition-colors touch-target"
                                                    onClick={() => setIsOpen(false)}
                                                >
                                                    {tool.name}
                                                </Link>
                                            ))}
                                        </div>
                                        <Separator className="my-2" />
                                        <Link href="/history" className="flex items-center gap-3 text-base font-medium py-2 touch-target hover:text-primary transition-colors" onClick={() => setIsOpen(false)}>
                                            <History className="h-5 w-5" />
                                            History
                                        </Link>
                                        <Link href="/history" className="flex items-center gap-3 text-base font-medium py-2 touch-target hover:text-primary transition-colors" onClick={() => setIsOpen(false)}>
                                            <Bookmark className="h-5 w-5" />
                                            Saved Items
                                        </Link>
                                    </div>
                                </SheetContent>
                            </Sheet>
                        </div>

                        {/* BRAND LOGO */}
                        <Link href="/" className="flex items-center gap-1.5 xs:gap-2 hover:opacity-80 transition-opacity group">
                            <div className="relative">
                                <Logo className="w-7 h-7 xs:w-8 xs:h-8 text-primary shrink-0 transition-transform duration-300 group-hover:scale-110" />
                                <div className="absolute inset-0 bg-primary/30 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                            </div>
                            <span className="text-base xs:text-lg sm:text-xl font-bold tracking-tight">
                                <span className="text-foreground">PadhLoYaar</span>
                                <span className="text-primary">AI</span>
                            </span>
                        </Link>

                        {/* Desktop Nav */}
                        <nav className="hidden md:flex items-center gap-4 lg:gap-6 text-sm font-medium ml-2 lg:ml-4">
                            <Link
                                href="/"
                                className={cn(
                                    "transition-all duration-300 hover:text-foreground/80 relative py-1",
                                    pathname === '/' ? "text-foreground" : "text-foreground/60"
                                )}
                            >
                                Dashboard
                                {pathname === '/' && (
                                    <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-primary rounded-full" />
                                )}
                            </Link>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" className="h-8 w-auto px-2 font-normal text-foreground/60 hover:text-foreground hover:bg-white/5 rounded-lg">
                                        Tools
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="start" className="w-52 max-h-[320px] overflow-y-auto bg-background/95 backdrop-blur-xl border-white/10">
                                    <div className="flex flex-col p-1">
                                        {tools.map((tool) => (
                                            <DropdownMenuItem key={tool.href} asChild className="text-sm px-3 py-2 cursor-pointer rounded-lg hover:bg-primary/10">
                                                <Link href={tool.href}>{tool.name}</Link>
                                            </DropdownMenuItem>
                                        ))}
                                    </div>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </nav>
                    </div>

                    {/* RIGHT: Timer, Music, Profile */}
                    <div className="flex items-center gap-2 xs:gap-3">
                        {/* Timer Display with Popover */}
                        <div className="flex items-center gap-0.5 bg-white/5 backdrop-blur-sm px-2 xs:px-2.5 py-1 rounded-xl border border-white/10 group hover:border-primary/30 hover:bg-white/10 transition-all duration-300">
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="sm" className="h-8 xs:h-9 w-auto px-2 xs:px-2.5 font-mono font-medium hover:bg-white/10 text-xs sm:text-sm rounded-lg" title={formattedTime}>
                                        <Clock className="w-4 h-4 text-primary group-hover:text-purple-400 transition-colors" />
                                        <span className="hidden xs:inline ml-2">{formattedTime}</span>
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-44 bg-background/95 backdrop-blur-xl border-white/10">
                                    <DropdownMenuLabel className="text-sm">Set Duration</DropdownMenuLabel>
                                    {timerPresets.map(min => (
                                        <DropdownMenuItem key={min} onClick={() => setDuration(min)} className="cursor-pointer rounded-lg hover:bg-primary/10">
                                            {min} Minutes
                                        </DropdownMenuItem>
                                    ))}
                                </DropdownMenuContent>
                            </DropdownMenu>

                            <div className="w-px h-4 bg-white/10 mx-0.5" />

                            <Button variant="ghost" size="icon" className="h-8 w-8 xs:h-9 xs:w-9 hover:text-primary hover:bg-white/10 transition-all duration-300 touch-target rounded-lg" onClick={toggleTimer} title={isActive ? "Pause Timer" : "Start Timer"}>
                                {isActive ? <Pause className="w-3.5 h-3.5 xs:w-4 xs:h-4" /> : <Play className="w-3.5 h-3.5 xs:w-4 xs:h-4" />}
                            </Button>
                            <Button variant="ghost" size="icon" className="h-8 w-8 xs:h-9 xs:w-9 hover:text-primary hover:bg-white/10 transition-all duration-300 touch-target rounded-lg" onClick={() => resetTimer()} title="Reset Timer">
                                <span className="text-sm">↺</span>
                            </Button>
                        </div>

                        {/* Music Popover */}
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button variant="ghost" size="icon" className={cn("relative transition-all duration-300 hover:scale-105 h-9 w-9 xs:h-10 xs:w-10 touch-target rounded-xl hover:bg-white/10", isPlaying && "text-primary")} title="Soundscapes">
                                    <Music className="w-4 h-4 xs:w-5 xs:h-5" />
                                    {isPlaying && (
                                        <>
                                            <span className="absolute top-2 right-2 w-1.5 h-1.5 bg-primary rounded-full animate-pulse" />
                                            <span className="absolute top-2 right-2 w-1.5 h-1.5 bg-primary rounded-full animate-ping" />
                                        </>
                                    )}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-60 bg-background/95 backdrop-blur-xl border-white/10" align="end">
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between">
                                        <h4 className="text-sm font-semibold leading-none flex items-center gap-2">
                                            <Volume2 className="w-4 h-4 text-primary" /> Soundscapes
                                        </h4>
                                        <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg hover:bg-primary/10" onClick={() => togglePlay()} title={isPlaying ? "Pause" : "Play"}>
                                            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                                        </Button>
                                    </div>
                                    <div className="grid grid-cols-1 gap-2">
                                        {Object.keys(SAFE_MUSIC_URLS).map((g) => (
                                            <Button
                                                key={g}
                                                variant={genre === g ? "default" : "outline"}
                                                size="sm"
                                                className={cn(
                                                    "justify-start capitalize h-9 touch-target rounded-lg transition-all duration-300",
                                                    genre === g && "shadow-[0_0_15px_rgba(139,92,246,0.3)]"
                                                )}
                                                onClick={() => setGenre(g)}
                                            >
                                                {g}
                                            </Button>
                                        ))}
                                    </div>
                                </div>
                            </PopoverContent>
                        </Popover>

                        {/* Profile & Unified Menu */}
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="rounded-full overflow-hidden border border-white/10 hover:bg-transparent hover:border-primary/50 transition-all duration-300 hover:ring-2 hover:ring-primary/20 hover:ring-offset-1 hover:ring-offset-background group w-9 h-9 xs:w-10 xs:h-10 touch-target" title="Account">
                                    <div className="h-full w-full bg-gradient-to-br from-primary/20 via-purple-500/10 to-transparent flex items-center justify-center group-hover:from-primary/30">
                                        <User className="h-4 w-4 xs:h-5 xs:w-5 text-foreground/80 group-hover:text-primary transition-colors" />
                                    </div>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-64 p-2 bg-background/95 backdrop-blur-xl border-white/10">
                                <DropdownMenuLabel className="font-normal">
                                    <div className="flex flex-col space-y-1">
                                        <p className="text-sm font-medium leading-none">Account</p>
                                        <p className="text-xs leading-none text-muted-foreground">Manage your profile</p>
                                    </div>
                                </DropdownMenuLabel>
                                <DropdownMenuSeparator className="bg-white/10" />

                                <DropdownMenuItem asChild className="cursor-pointer rounded-lg hover:bg-primary/10">
                                    <Link href="/login" className="flex items-center gap-2">
                                        <User className="h-4 w-4 text-primary" />
                                        <span>Sign In / Profile</span>
                                    </Link>
                                </DropdownMenuItem>

                                <DropdownMenuItem asChild className="cursor-pointer rounded-lg hover:bg-primary/10">
                                    <Link href="/settings" className="flex items-center gap-2">
                                        <Settings className="h-4 w-4 text-primary" />
                                        <span>Settings</span>
                                    </Link>
                                </DropdownMenuItem>

                                <DropdownMenuSeparator className="bg-white/10" />
                                <DropdownMenuLabel className="font-normal">
                                    <div className="flex flex-col space-y-1">
                                        <p className="text-sm font-medium leading-none">My Stuff</p>
                                        <p className="text-xs leading-none text-muted-foreground">Manage your learning journey</p>
                                    </div>
                                </DropdownMenuLabel>
                                <DropdownMenuSeparator className="bg-white/10" />

                                <DropdownMenuItem asChild className="cursor-pointer rounded-lg hover:bg-primary/10">
                                    <Link href="/history" className="flex items-center gap-2">
                                        <History className="h-4 w-4 text-blue-500" />
                                        <div className="flex flex-col">
                                            <span>History</span>
                                            <span className="text-[10px] text-muted-foreground">View past generations</span>
                                        </div>
                                    </Link>
                                </DropdownMenuItem>

                                <DropdownMenuItem asChild className="cursor-pointer rounded-lg hover:bg-primary/10">
                                    <Link href="/history" className="flex items-center gap-2">
                                        <Bookmark className="h-4 w-4 text-purple-500" />
                                        <div className="flex flex-col">
                                            <span>Saved Items</span>
                                            <span className="text-[10px] text-muted-foreground">Your bookmarked content</span>
                                        </div>
                                    </Link>
                                </DropdownMenuItem>

                                <DropdownMenuSeparator className="bg-white/10" />
                                <DropdownMenuLabel className="text-xs font-normal text-muted-foreground uppercase tracking-wider">Socials</DropdownMenuLabel>

                                <DropdownMenuItem asChild className="cursor-pointer rounded-lg hover:bg-primary/10">
                                    <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                                        <Linkedin className="h-4 w-4 text-[#0077b5]" />
                                        <span>LinkedIn</span>
                                    </a>
                                </DropdownMenuItem>
                                <DropdownMenuItem asChild className="cursor-pointer rounded-lg hover:bg-primary/10">
                                    <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                                        <Instagram className="h-4 w-4 text-[#E1306C]" />
                                        <span>Instagram</span>
                                    </a>
                                </DropdownMenuItem>

                                <DropdownMenuSeparator className="bg-white/10" />
                                <DropdownMenuLabel className="text-xs font-normal text-muted-foreground uppercase tracking-wider">Appearance</DropdownMenuLabel>

                                <div className="grid grid-cols-4 gap-2 p-2">
                                    {THEME_PRESETS.map((t) => (
                                        <Button
                                            key={t.id}
                                            size="icon"
                                            variant="outline"
                                            className={cn(
                                                "h-9 w-9 xs:h-10 xs:w-10 rounded-full border-2 border-transparent hover:border-white/50 transition-all touch-target hover:scale-110",
                                                t.className
                                            )}
                                            onClick={() => setTheme(t.id)}
                                            title={t.label}
                                        />
                                    ))}
                                </div>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>
            </div>
        </header>
    );
}

// --- Constants ---

const THEME_PRESETS = [
    { id: 'light', label: 'Light Mode', className: 'bg-white hover:border-black/20' },
    { id: 'dark', label: 'Dark Mode', className: 'bg-slate-900' },
    { id: 'pitch-black', label: 'Pitch Black', className: 'bg-black' },
    { id: 'theme-red', label: 'Red Theme', className: 'bg-red-600' },
    { id: 'theme-stranger-things', label: 'Stranger Things', className: 'bg-red-900' },
    { id: 'theme-money-heist', label: 'Money Heist', className: 'bg-emerald-900' },
    { id: 'theme-dark-series', label: 'Dark Series', className: 'bg-slate-800' },
    { id: 'theme-cyan', label: 'Cyan Theme', className: 'bg-cyan-600' },
];
