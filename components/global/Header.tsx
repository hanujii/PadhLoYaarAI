'use client';

import React, { useEffect, useRef } from 'react';
import Link from 'next/link';
import { useTheme } from 'next-themes';
import { usePathname } from 'next/navigation';
import { useStore } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { Clock, Music, Linkedin, Instagram, Play, Pause, Volume2, User, Bookmark, History } from 'lucide-react';
import { Logo } from '@/components/global/Logo';
import { cn } from '@/lib/utils';
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
import { Menu } from 'lucide-react';
import { Separator } from '@/components/ui/separator';


// Local audio files in public/sounds/
const MUSIC_URLS: Record<string, string> = {
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
    const tools = [
        { name: 'My Library', href: '/history' },
        { name: 'Tutor Tool', href: '/tools/tutor' },
        { name: 'Code Transformer', href: '/tools/code-transformer' },
        { name: 'Roast My Code', href: '/tools/roast-my-code' },
        { name: 'Exam Simulator', href: '/tools/exam-simulator' },
        { name: 'Teacher Chat', href: '/tools/teacher-chat' },
        // ... other tools if needed
    ];

    const timerPresets = [10, 15, 25, 45, 60];

    return (
        <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60">
            {/* Hidden Audio Element */}
            <audio ref={audioRef} src={MUSIC_URLS[genre]} loop />

            <div className="container flex h-16 items-center justify-between px-4">
                <div className="flex items-center gap-6">
                    {/* Mobile Menu */}
                    <div className="md:hidden">
                        <Sheet open={isOpen} onOpenChange={setIsOpen}>
                            <SheetTrigger asChild>
                                <Button variant="ghost" size="icon" className="mr-2">
                                    <Menu className="h-5 w-5" />
                                </Button>
                            </SheetTrigger>
                            <SheetContent side="left" className="w-[80vw] sm:w-[350px]">
                                <SheetHeader>
                                    <SheetTitle>Menu</SheetTitle>
                                </SheetHeader>
                                <div className="flex flex-col gap-4 py-4">
                                    <Link href="/" className="text-lg font-medium" onClick={() => setIsOpen(false)}>
                                        Dashboard
                                    </Link>
                                    <div className="space-y-3">
                                        <h4 className="text-sm font-medium text-muted-foreground">Tools</h4>
                                        {tools.map((tool) => (
                                            <Link
                                                key={tool.href}
                                                href={tool.href}
                                                className="block text-base hover:text-primary transition-colors"
                                                onClick={() => setIsOpen(false)}
                                            >
                                                {tool.name}
                                            </Link>
                                        ))}
                                    </div>
                                    <Separator className="my-2" />
                                    <Separator className="my-2" />
                                    <Link href="/history">
                                        <Button variant="outline" className="w-full justify-start">
                                            <History className="mr-2 h-4 w-4" />
                                            History
                                        </Button>
                                    </Link>
                                </div>
                            </SheetContent>
                        </Sheet>
                    </div>



                    {/* BRAND LOGO */}
                    <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
                        <Logo className="w-8 h-8 text-foreground" />
                        <span className="text-xl font-bold tracking-tight text-foreground">
                            plyAI
                        </span>
                    </Link>

                    <nav className="hidden md:flex items-center gap-6 text-sm font-medium ml-4">
                        <Link href="/" className={cn("transition-colors hover:text-foreground/80", pathname === '/' ? "text-foreground" : "text-foreground/60")}>
                            Dashboard
                        </Link>

                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="h-8 w-auto px-2 font-normal text-foreground/60 hover:text-foreground">
                                    Tools
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="start">
                                {tools.map((tool) => (
                                    <DropdownMenuItem key={tool.href} asChild>
                                        <Link href={tool.href}>{tool.name}</Link>
                                    </DropdownMenuItem>
                                ))}
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </nav>

                </div>

                <div className="flex items-center gap-2 sm:gap-4">
                    {/* Timer Display with Popover */}
                    <div className="flex items-center gap-1 bg-secondary/30 backdrop-blur-sm px-1.5 sm:px-2 py-1 rounded-full border border-border/50 group hover:border-border transition-colors">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm" className="h-6 w-auto px-1 sm:px-2 font-mono font-medium hover:bg-secondary/50 text-xs sm:text-sm">
                                    <Clock className="w-3 h-3 sm:w-4 sm:h-4 text-primary mr-1 sm:mr-2 group-hover:text-purple-500 transition-colors" />
                                    <span className="hidden sm:inline">{formattedTime}</span>
                                    <span className="sm:hidden">{minutes}:{seconds.toString().padStart(2, '0')}</span>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Set Duration</DropdownMenuLabel>
                                {timerPresets.map(min => (
                                    <DropdownMenuItem key={min} onClick={() => setDuration(min)}>
                                        {min} Minutes
                                    </DropdownMenuItem>
                                ))}
                            </DropdownMenuContent>
                        </DropdownMenu>

                        <div className="w-px h-4 bg-border/50 mx-1" />

                        <Button variant="ghost" size="icon" className="h-6 w-6 hover:text-primary transition-colors" onClick={toggleTimer}>
                            {isActive ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
                        </Button>
                        <Button variant="ghost" size="icon" className="h-6 w-6 hover:text-primary transition-colors" onClick={() => resetTimer()}>
                            <span className="text-xs">↺</span>
                        </Button>
                    </div>

                    {/* Music Popover */}
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button variant="ghost" size="icon" className={cn("relative transition-transform hover:scale-105", isPlaying && "text-primary")}>
                                <Music className="w-5 h-5" />
                                {isPlaying && <span className="absolute top-1 right-1 w-2 h-2 bg-primary rounded-full animate-pulse shadow-[0_0_8px_rgba(var(--primary))] " />}
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-56" align="end">
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <h4 className="font-medium leading-none flex items-center gap-2">
                                        <Volume2 className="w-4 h-4" /> Soundscapes
                                    </h4>
                                    <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => togglePlay()}>
                                        {isPlaying ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
                                    </Button>
                                </div>
                                <div className="grid grid-cols-1 gap-2">
                                    {Object.keys(MUSIC_URLS).map((g) => (
                                        <Button
                                            key={g}
                                            variant={genre === g ? "default" : "outline"}
                                            size="sm"
                                            className="justify-start capitalize"
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
                            <Button variant="ghost" size="icon" className="rounded-full overflow-hidden border border-border/50 hover:bg-transparent hover:border-primary/50 transition-all duration-300 hover:ring-2 hover:ring-primary/20 hover:ring-offset-1 hover:ring-offset-background group">
                                <div className="h-full w-full bg-gradient-to-br from-primary/10 to-transparent flex items-center justify-center group-hover:from-primary/20">
                                    <User className="h-4 w-4 text-foreground/80 group-hover:text-primary transition-colors" />
                                </div>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-64 p-2">
                            {/* ... existing menu content ... */}
                            <DropdownMenuLabel className="font-normal">
                                <div className="flex flex-col space-y-1">
                                    <p className="text-sm font-medium leading-none">My Stuff</p>
                                    <p className="text-xs leading-none text-muted-foreground">Manage your learning journey</p>
                                </div>
                            </DropdownMenuLabel>
                            <DropdownMenuSeparator />

                            <DropdownMenuItem asChild className="cursor-pointer">
                                <Link href="/history" className="flex items-center gap-2">
                                    <History className="h-4 w-4 text-blue-500" />
                                    <div className="flex flex-col">
                                        <span>History</span>
                                        <span className="text-[10px] text-muted-foreground">View past generations</span>
                                    </div>
                                </Link>
                            </DropdownMenuItem>

                            <DropdownMenuItem asChild className="cursor-pointer">
                                <Link href="/history" className="flex items-center gap-2">
                                    <Bookmark className="h-4 w-4 text-purple-500" />
                                    <div className="flex flex-col">
                                        <span>Saved Items</span>
                                        <span className="text-[10px] text-muted-foreground">Your bookmarked content</span>
                                    </div>
                                </Link>
                            </DropdownMenuItem>

                            <DropdownMenuSeparator />
                            <DropdownMenuLabel className="text-xs font-normal text-muted-foreground uppercase tracking-wider">Socials</DropdownMenuLabel>

                            <DropdownMenuItem asChild className="cursor-pointer">
                                <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                                    <Linkedin className="h-4 w-4 text-[#0077b5]" />
                                    <span>LinkedIn</span>
                                </a>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild className="cursor-pointer">
                                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                                    <Instagram className="h-4 w-4 text-[#E1306C]" />
                                    <span>Instagram</span>
                                </a>
                            </DropdownMenuItem>

                            <DropdownMenuSeparator />
                            <DropdownMenuLabel className="text-xs font-normal text-muted-foreground uppercase tracking-wider">Appearance</DropdownMenuLabel>

                            <div className="grid grid-cols-4 gap-1 p-1">
                                {THEME_PRESETS.map((t) => (
                                    <Button
                                        key={t.id}
                                        size="icon"
                                        variant="outline"
                                        className={cn(
                                            "h-8 w-8 rounded-full border-2 border-transparent hover:border-white/50 transition-all",
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
