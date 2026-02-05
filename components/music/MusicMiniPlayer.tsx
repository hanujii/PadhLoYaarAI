'use client';

import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '@/lib/store';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import {
    Play,
    Pause,
    Volume2,
    VolumeX,
    X,
    ChevronUp,
    ChevronDown,
    Music2,
    Headphones,
    Leaf,
    Moon
} from 'lucide-react';

const MUSIC_DATA: Record<string, { url: string; title: string; artist: string; icon: React.ElementType; gradient: string }> = {
    'lofi': {
        url: 'https://cdn.pixabay.com/audio/2023/09/04/audio_c89e926532.mp3',
        title: 'Lofi Beats',
        artist: 'Chill Study',
        icon: Headphones,
        gradient: 'from-purple-500 to-pink-500'
    },
    'soothing': {
        url: 'https://cdn.pixabay.com/audio/2022/10/25/audio_cfb63ad2bf.mp3',
        title: 'Soothing Piano',
        artist: 'Calm Melodies',
        icon: Music2,
        gradient: 'from-blue-500 to-cyan-400'
    },
    'meditation': {
        url: 'https://cdn.pixabay.com/audio/2023/04/24/audio_86ef3e88c2.mp3',
        title: 'Deep Meditation',
        artist: 'Zen Garden',
        icon: Moon,
        gradient: 'from-indigo-500 to-purple-600'
    },
    'nature': {
        url: 'https://cdn.pixabay.com/audio/2022/08/23/audio_4fc54e1a55.mp3',
        title: 'Nature Sounds',
        artist: 'Forest Ambience',
        icon: Leaf,
        gradient: 'from-emerald-500 to-green-400'
    },
};

export function MusicMiniPlayer() {
    const { isPlaying, togglePlay, volume, setVolume, genre, setGenre } = useStore();
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const [isExpanded, setIsExpanded] = useState(false);
    const [isMinimized, setIsMinimized] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [isMuted, setIsMuted] = useState(false);

    const currentTrack = MUSIC_DATA[genre] || MUSIC_DATA['lofi'];
    const Icon = currentTrack.icon;

    // Audio control
    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.volume = isMuted ? 0 : volume;
            if (isPlaying) {
                audioRef.current.play().catch(console.error);
            } else {
                audioRef.current.pause();
            }
        }
    }, [isPlaying, volume, isMuted]);

    // Change track when genre changes
    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.src = currentTrack.url;
            audioRef.current.load();
            if (isPlaying) {
                audioRef.current.play().catch(console.error);
            }
        }
    }, [genre]);

    // Update time
    const handleTimeUpdate = () => {
        if (audioRef.current) {
            setCurrentTime(audioRef.current.currentTime);
            setDuration(audioRef.current.duration || 0);
        }
    };

    const handleSeek = (value: number[]) => {
        if (audioRef.current && duration) {
            audioRef.current.currentTime = (value[0] / 100) * duration;
        }
    };

    const formatTime = (secs: number) => {
        const m = Math.floor(secs / 60);
        const s = Math.floor(secs % 60);
        return `${m}:${s.toString().padStart(2, '0')}`;
    };

    // Only show when music is playing
    if (!isPlaying) return null;

    // Minimized state - just a floating button
    if (isMinimized) {
        return (
            <>
                <audio
                    ref={audioRef}
                    src={currentTrack.url}
                    loop
                    onTimeUpdate={handleTimeUpdate}
                    onLoadedMetadata={handleTimeUpdate}
                />
                <motion.button
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className={cn(
                        "fixed bottom-4 left-4 z-50 w-12 h-12 rounded-full bg-gradient-to-br shadow-lg flex items-center justify-center cursor-pointer",
                        currentTrack.gradient
                    )}
                    onClick={() => setIsMinimized(false)}
                >
                    <Icon className="w-5 h-5 text-white" />
                    {/* Animated ring */}
                    <div className="absolute inset-0 rounded-full border-2 border-white/50 animate-ping" />
                </motion.button>
            </>
        );
    }

    return (
        <>
            <audio
                ref={audioRef}
                src={currentTrack.url}
                loop
                onTimeUpdate={handleTimeUpdate}
                onLoadedMetadata={handleTimeUpdate}
            />

            <AnimatePresence>
                <motion.div
                    initial={{ y: 100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 100, opacity: 0 }}
                    className="fixed bottom-4 left-4 z-50"
                >
                    <motion.div
                        layout
                        className={cn(
                            "bg-card/95 backdrop-blur-xl border border-border rounded-2xl shadow-2xl overflow-hidden",
                            isExpanded ? "w-80" : "w-72"
                        )}
                    >
                        {/* Main Player Bar */}
                        <div className="p-3 flex items-center gap-3">
                            {/* Album Art / Icon */}
                            <motion.div
                                layout
                                className={cn(
                                    "relative flex items-center justify-center rounded-xl bg-gradient-to-br cursor-pointer",
                                    currentTrack.gradient,
                                    isExpanded ? "w-14 h-14" : "w-12 h-12"
                                )}
                                onClick={() => setIsMinimized(true)}
                            >
                                <Icon className="w-6 h-6 text-white" />
                                {/* Animated Equalizer Bars */}
                                {isPlaying && (
                                    <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 flex gap-0.5">
                                        {[1, 2, 3, 4].map((i) => (
                                            <motion.div
                                                key={i}
                                                className="w-1 bg-white/80 rounded-full"
                                                animate={{
                                                    height: [4, 12, 6, 10, 4],
                                                }}
                                                transition={{
                                                    duration: 0.8,
                                                    repeat: Infinity,
                                                    delay: i * 0.1,
                                                    ease: "easeInOut"
                                                }}
                                            />
                                        ))}
                                    </div>
                                )}
                            </motion.div>

                            {/* Track Info */}
                            <div className="flex-1 min-w-0">
                                <p className="font-semibold text-sm text-foreground truncate">
                                    {currentTrack.title}
                                </p>
                                <p className="text-xs text-muted-foreground truncate">
                                    {currentTrack.artist}
                                </p>
                            </div>

                            {/* Controls */}
                            <div className="flex items-center gap-1">
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-9 w-9 rounded-full hover:bg-secondary"
                                    onClick={togglePlay}
                                >
                                    {isPlaying ? (
                                        <Pause className="w-4 h-4" />
                                    ) : (
                                        <Play className="w-4 h-4 ml-0.5" />
                                    )}
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8 rounded-full hover:bg-secondary"
                                    onClick={() => setIsExpanded(!isExpanded)}
                                >
                                    {isExpanded ? (
                                        <ChevronDown className="w-4 h-4" />
                                    ) : (
                                        <ChevronUp className="w-4 h-4" />
                                    )}
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8 rounded-full hover:bg-secondary text-muted-foreground"
                                    onClick={togglePlay}
                                >
                                    <X className="w-4 h-4" />
                                </Button>
                            </div>
                        </div>

                        {/* Expanded Content */}
                        <AnimatePresence>
                            {isExpanded && (
                                <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: 'auto', opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    className="px-3 pb-3 space-y-3"
                                >
                                    {/* Progress Bar */}
                                    <div className="space-y-1">
                                        <Slider
                                            value={[duration ? (currentTime / duration) * 100 : 0]}
                                            onValueChange={handleSeek}
                                            max={100}
                                            step={0.1}
                                            className="cursor-pointer"
                                        />
                                        <div className="flex justify-between text-[10px] text-muted-foreground">
                                            <span>{formatTime(currentTime)}</span>
                                            <span>{formatTime(duration)}</span>
                                        </div>
                                    </div>

                                    {/* Volume Control */}
                                    <div className="flex items-center gap-2">
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-7 w-7 rounded-full hover:bg-secondary"
                                            onClick={() => setIsMuted(!isMuted)}
                                        >
                                            {isMuted ? (
                                                <VolumeX className="w-3.5 h-3.5" />
                                            ) : (
                                                <Volume2 className="w-3.5 h-3.5" />
                                            )}
                                        </Button>
                                        <Slider
                                            value={[isMuted ? 0 : volume * 100]}
                                            onValueChange={(v) => {
                                                setVolume(v[0] / 100);
                                                if (isMuted) setIsMuted(false);
                                            }}
                                            max={100}
                                            step={1}
                                            className="flex-1"
                                        />
                                    </div>

                                    {/* Genre Selector */}
                                    <div className="grid grid-cols-4 gap-1.5">
                                        {Object.entries(MUSIC_DATA).map(([key, data]) => {
                                            const GenreIcon = data.icon;
                                            return (
                                                <Button
                                                    key={key}
                                                    variant={genre === key ? "default" : "outline"}
                                                    size="sm"
                                                    className={cn(
                                                        "h-8 text-[10px] capitalize flex flex-col gap-0.5 p-1",
                                                        genre === key && "bg-primary text-primary-foreground"
                                                    )}
                                                    onClick={() => setGenre(key)}
                                                >
                                                    <GenreIcon className="w-3 h-3" />
                                                    {key}
                                                </Button>
                                            );
                                        })}
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.div>
                </motion.div>
            </AnimatePresence>
        </>
    );
}
