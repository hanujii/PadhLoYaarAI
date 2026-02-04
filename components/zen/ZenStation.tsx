'use client';

import React, { useState, useEffect } from 'react';
import { useStore } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { X, Play, Pause, RotateCcw, Check, Plus, Trash2, Maximize, Minimize } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ToolBackButton } from '@/components/global/ToolBackButton';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { GlassCard } from '@/components/ui/glass-card';

const BACKGROUNDS = [
    { id: 'rain', name: 'Rainy Day', className: 'bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900', overlay: 'bg-[url("https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?q=80&w=2574&auto=format&fit=crop")] bg-cover bg-center opacity-40' },
    { id: 'forest', name: 'Deep Forest', className: 'bg-green-950', overlay: 'bg-[url("https://images.unsplash.com/photo-1448375240586-dfd8f3f0d8ac?q=80&w=2670&auto=format&fit=crop")] bg-cover bg-center opacity-40' },
    { id: 'space', name: 'Deep Space', className: 'bg-black', overlay: 'bg-[url("https://images.unsplash.com/photo-1534796636912-3b95b3ab5980?q=80&w=2672&auto=format&fit=crop")] bg-cover bg-center opacity-60' },
    { id: 'cafe', name: 'Cozy Cafe', className: 'bg-amber-950', overlay: 'bg-[url("https://images.unsplash.com/photo-1509042239860-f550ce710b93?q=80&w=2574&auto=format&fit=crop")] bg-cover bg-center opacity-40' },
];

import { createPortal } from 'react-dom';

export const ZenStation = () => {
    const {
        timeLeft, isActive, startTimer, stopTimer, resetTimer, setDuration
    } = useStore();

    const [activeBg, setActiveBg] = useState(BACKGROUNDS[2]); // Default Space
    const [tasks, setTasks] = useState<{ id: string, text: string, completed: boolean }[]>([]);
    const [newTask, setNewTask] = useState('');
    const [isFullScreen, setIsFullScreen] = useState(false);
    const [mounted, setMounted] = useState(false);

    // Timer Formatter
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    const formattedTime = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

    useEffect(() => {
        setMounted(true);
    }, []);

    const toggleFullScreen = () => {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen().catch(err => {
                console.error(`Error attempting to enable full-screen mode: ${err.message} (${err.name})`);
            });
            setIsFullScreen(true);
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen();
                setIsFullScreen(false);
            }
        }
    };

    // Listen for fullscreen change events
    useEffect(() => {
        const handleFullscreenChange = () => {
            setIsFullScreen(!!document.fullscreenElement);
        };
        document.addEventListener('fullscreenchange', handleFullscreenChange);
        return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
    }, []);

    const addTask = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newTask.trim()) return;
        setTasks([...tasks, { id: Date.now().toString(), text: newTask, completed: false }]);
        setNewTask('');
    };

    const toggleTask = (id: string) => {
        setTasks(tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
    };

    const deleteTask = (id: string) => {
        setTasks(tasks.filter(t => t.id !== id));
    };

    if (!mounted) return null;

    return createPortal(
        <div className="fixed inset-0 z-[9999] flex flex-col overflow-y-auto bg-black">
            {/* Animated Background Switcher */}
            <AnimatePresence mode="popLayout">
                <motion.div
                    key={activeBg.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 1.5 }}
                    className={cn("absolute inset-0 fixed", activeBg.className)}
                >
                    <div className={cn("absolute inset-0", activeBg.overlay)} />
                </motion.div>
            </AnimatePresence>

            {/* UI Layer */}
            <div className="relative z-10 w-full min-h-full flex flex-col p-4 md:p-8 text-white/90">

                {/* Header Controls */}
                <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                    <Link href="/" onClick={() => document.exitFullscreen().catch(() => { })}>
                        <Button variant="ghost" className="text-white/70 hover:text-white hover:bg-white/10 group rounded-full border border-transparent hover:border-white/10">
                            <X className="w-5 h-5 mr-2 group-hover:rotate-90 transition-transform" />
                            Exit Zen Mode
                        </Button>
                    </Link>

                    <GlassCard className="flex items-center gap-1 p-1.5 rounded-full !bg-black/20 !backdrop-blur-xl border-white/10" enableTilt={false}>
                        {BACKGROUNDS.map(bg => (
                            <button
                                key={bg.id}
                                onClick={() => setActiveBg(bg)}
                                className={cn(
                                    "px-4 py-1.5 rounded-full text-xs font-semibold transition-all duration-300",
                                    activeBg.id === bg.id
                                        ? "bg-white text-black shadow-lg scale-105"
                                        : "text-white/60 hover:text-white hover:bg-white/10"
                                )}
                            >
                                {bg.name}
                            </button>
                        ))}
                    </GlassCard>

                    <Button variant="ghost" size="icon" onClick={toggleFullScreen} className="hidden md:flex text-white/70 hover:text-white hover:bg-white/10 rounded-full">
                        {isFullScreen ? <Minimize className="w-5 h-5" /> : <Maximize className="w-5 h-5" />}
                    </Button>
                </div>

                {/* Main Focus Area */}
                <div className="flex-1 flex flex-col items-center justify-center gap-8 md:gap-16 min-h-0">

                    {/* Timer */}
                    <div className="text-center space-y-8 md:space-y-12 shrink-0">
                        <div className="relative group cursor-default">
                            <div className="text-7xl sm:text-8xl md:text-9xl lg:text-[12rem] font-black tracking-tighter leading-none font-mono drop-shadow-[0_0_50px_rgba(255,255,255,0.2)] select-none transition-all duration-300">
                                {formattedTime}
                            </div>
                        </div>

                        <div className="flex items-center justify-center gap-4 md:gap-8">
                            <Button
                                size="lg"
                                className="h-20 w-20 md:h-24 md:w-24 rounded-full bg-white text-black hover:bg-white/90 hover:scale-110 transition-all duration-300 shadow-[0_0_40px_rgba(255,255,255,0.3)] border-4 border-transparent hover:border-white/50"
                                onClick={isActive ? stopTimer : startTimer}
                            >
                                {isActive ? <Pause className="w-8 h-8 md:w-10 md:h-10 fill-current" /> : <Play className="w-8 h-8 md:w-10 md:h-10 fill-current ml-1" />}
                            </Button>

                            <Button
                                size="icon"
                                variant="outline"
                                className="h-14 w-14 rounded-full border-white/20 bg-black/20 text-white hover:bg-white/10 hover:border-white/50 backdrop-blur-md transition-all"
                                onClick={() => resetTimer()}
                            >
                                <RotateCcw className="w-6 h-6" />
                            </Button>
                        </div>

                        {/* Duration Presets */}
                        <div className="flex gap-3 justify-center">
                            {[25, 45, 60].map(min => (
                                <button
                                    key={min}
                                    onClick={() => setDuration(min)}
                                    className="px-4 py-1 rounded-full border border-white/10 bg-black/20 backdrop-blur-md text-sm text-white/60 hover:text-white hover:bg-white/10 hover:border-white/30 transition-all"
                                >
                                    {min}m
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Bottom Task List */}
                <div className="w-full max-w-lg mx-auto mb-4 md:mb-12 shrink-0">
                    <GlassCard className="rounded-2xl border-white/10 !bg-black/30 w-full" enableTilt={false}>
                        <div className="p-4 md:p-6 space-y-4">
                            {/* Tasks */}
                            <div className="space-y-2 max-h-[150px] overflow-y-auto custom-scrollbar pr-2">
                                <AnimatePresence initial={false} mode="popLayout">
                                    {tasks.map(task => (
                                        <motion.div
                                            key={task.id}
                                            initial={{ opacity: 0, scale: 0.95 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            exit={{ opacity: 0, scale: 0.95 }}
                                            className="flex items-center group bg-white/5 p-2 rounded-lg border border-transparent hover:border-white/10 transition-colors"
                                        >
                                            <button
                                                onClick={() => toggleTask(task.id)}
                                                className={cn(
                                                    "w-5 h-5 rounded-full border flex items-center justify-center mr-3 transition-all duration-300",
                                                    task.completed ? "bg-green-500 border-green-500 text-white scale-110" : "border-white/30 hover:border-white/60"
                                                )}
                                            >
                                                {task.completed && <Check className="w-3 h-3" />}
                                            </button>
                                            <span className={cn("flex-1 text-sm transition-all", task.completed ? "text-white/30 line-through" : "text-white/90 font-medium")}>
                                                {task.text}
                                            </span>
                                            <button onClick={() => deleteTask(task.id)} className="opacity-0 group-hover:opacity-100 text-white/30 hover:text-red-400 p-1 transition-all">
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </motion.div>
                                    ))}
                                </AnimatePresence>
                                {tasks.length === 0 && (
                                    <div className="text-center text-white/30 text-sm py-4 italic">Specify your intent. What will you conquer?</div>
                                )}
                            </div>

                            {/* Input */}
                            <form onSubmit={addTask} className="flex gap-2 pt-2 border-t border-white/10">
                                <Input
                                    value={newTask}
                                    onChange={(e) => setNewTask(e.target.value)}
                                    placeholder="Add a new task..."
                                    className="bg-transparent border-none text-white placeholder:text-white/30 focus-visible:ring-0 h-10 px-0 text-base"
                                />
                                <Button type="submit" size="sm" className="h-10 w-10 p-0 rounded-full bg-white/10 hover:bg-white text-white hover:text-black transition-all">
                                    <Plus className="w-5 h-5" />
                                </Button>
                            </form>
                        </div>
                    </GlassCard>
                </div>
            </div>
        </div>,
        document.body
    );
};
