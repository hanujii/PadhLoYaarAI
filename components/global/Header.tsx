'use client';

import React, { useEffect, useRef } from 'react';
import Link from 'next/link';
import { useTheme } from 'next-themes';
import { usePathname } from 'next/navigation';
import { useStore } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { Clock, Music, Linkedin, Instagram, Play, Pause, Volume2, User, Bookmark, History } from 'lucide-react';
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
        timeLeft, isActive, duration, startTimer, stopTimer, resetTimer, setDuration,
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
        { name: 'Question Solver', href: '/tools/question-solver' },
        { name: 'PDF Explainer', href: '/tools/pdf-explainer' },
        { name: 'Exam Generator', href: '/tools/exam-generator' },
        { name: 'Teacher Chat', href: '/tools/teacher-chat' },
        { name: 'Diagram Explainer', href: '/tools/diagram-explainer' },
        { name: 'Cheat Sheet', href: '/tools/cheat-sheet' },
        { name: 'Flashcard Genius', href: '/tools/flashcards' },
        { name: 'YouTube Note-Taker', href: '/tools/youtube-notes' },
        { name: 'Roadmap Architect', href: '/tools/roadmap' },
        { name: 'The Reverse Exam', href: '/tools/reverse-exam' },
        { name: 'Syllabus Sentinel', href: '/tools/syllabus' },
        { name: 'Meme-ory Mode', href: '/tools/meme' },
        { name: 'The Analogy Engine', href: '/tools/analogy' },
    ];

    const timerPresets = [10, 15, 25, 45, 60];

    return (
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
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
                                    <div className="mt-4 flex items-center gap-2">
                                        <Link href="https://www.linkedin.com/in/ayush-gupta-creative?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app" target="_blank" rel="noreferrer">
                                            <Button variant="ghost" size="icon">
                                                <Linkedin className="w-5 h-5" />
                                            </Button>
                                        </Link>
                                        <Link href="https://www.instagram.com/hanu3040?igsh=enB0amxuMjdwZm0x" target="_blank" rel="noreferrer">
                                            <Button variant="ghost" size="icon">
                                                <Instagram className="w-5 h-5" />
                                            </Button>
                                        </Link>
                                    </div>
                                </div>
                            </SheetContent>
                        </Sheet>
                    </div>

                    <Link href="/" className="flex items-center space-x-2 font-bold text-xl">
                        <span>plyAI</span>
                    </Link>
                    <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
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
                    <div className="flex items-center gap-1 bg-secondary/50 px-2 py-1 rounded-full border border-border">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm" className="h-6 w-auto px-1 sm:px-2 font-mono font-medium hover:bg-secondary text-xs sm:text-sm">
                                    <Clock className="w-3 h-3 sm:w-4 sm:h-4 text-primary mr-1 sm:mr-2" />
                                    {formattedTime}
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

                        <div className="w-px h-4 bg-border mx-1" />

                        <Button variant="ghost" size="icon" className="h-6 w-6" onClick={toggleTimer}>
                            {isActive ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
                        </Button>
                        <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => resetTimer()}>
                            <span className="text-xs">↺</span>
                        </Button>
                    </div>

                    {/* Music Popover */}
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button variant="ghost" size="icon" className={cn("relative", isPlaying && "text-primary")}>
                                <Music className="w-5 h-5" />
                                {isPlaying && <span className="absolute top-1 right-1 w-2 h-2 bg-primary rounded-full animate-pulse" />}
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

                    {/* Profile Menu */}
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="rounded-full">
                                <User className="w-5 h-5" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-56">
                            <DropdownMenuLabel>My Account</DropdownMenuLabel>
                            <DropdownMenuSeparator />

                            <DropdownMenuItem asChild>
                                <Link href="/history" className="cursor-pointer">
                                    <Bookmark className="mr-2 h-4 w-4" />
                                    <span>Saved Messages</span>
                                </Link>
                            </DropdownMenuItem>

                            <DropdownMenuItem asChild>
                                <Link href="/history" className="cursor-pointer">
                                    <History className="mr-2 h-4 w-4" />
                                    <span>History</span>
                                </Link>
                            </DropdownMenuItem>

                            <DropdownMenuSeparator />
                            <DropdownMenuLabel>Themes</DropdownMenuLabel>
                            <div className="grid grid-cols-2 gap-2 p-2">
                                <DropdownMenuItem onClick={() => setTheme("light")}>
                                    <span className="w-4 h-4 rounded-full bg-white border mr-2"></span> Light
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => setTheme("dark")}>
                                    <span className="w-4 h-4 rounded-full bg-slate-900 border mr-2"></span> Dark
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => setTheme("pitch-black")}>
                                    <span className="w-4 h-4 rounded-full bg-black border mr-2"></span> Pitch Black
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => setTheme("theme-red")}>
                                    <span className="w-4 h-4 rounded-full bg-red-600 border mr-2"></span> Red
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => setTheme("theme-cyan")}>
                                    <span className="w-4 h-4 rounded-full bg-cyan-500 border mr-2"></span> Cyan
                                </DropdownMenuItem>
                            </div>
                            <DropdownMenuLabel className="mt-2">Inspired By</DropdownMenuLabel>
                            <div className="flex flex-col gap-1 p-2">
                                <DropdownMenuItem onClick={() => setTheme("theme-stranger-things")} className="cursor-pointer">
                                    <span className="text-red-600 font-bold mr-2">S</span> Stranger Things
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => setTheme("theme-money-heist")} className="cursor-pointer">
                                    <span className="text-red-700 font-bold mr-2">M</span> Money Heist
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => setTheme("theme-dark-series")} className="cursor-pointer">
                                    <span className="text-yellow-500 font-bold mr-2">D</span> Dark Series
                                </DropdownMenuItem>
                            </div>

                            <DropdownMenuSeparator />
                            <DropdownMenuLabel>Connect</DropdownMenuLabel>

                            <DropdownMenuItem asChild>
                                <Link href="https://www.linkedin.com/in/ayush-gupta-creative?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app" target="_blank" rel="noreferrer" className="cursor-pointer">
                                    <Linkedin className="mr-2 h-4 w-4" />
                                    <span>LinkedIn</span>
                                </Link>
                            </DropdownMenuItem>

                            <DropdownMenuItem asChild>
                                <Link href="https://www.instagram.com/hanu3040?igsh=enB0amxuMjdwZm0x" target="_blank" rel="noreferrer" className="cursor-pointer">
                                    <Instagram className="mr-2 h-4 w-4" />
                                    <span>Instagram</span>
                                </Link>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>
        </header>
    );
}
