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

const BACKGROUNDS = [
    { id: 'rain', name: 'Rainy Day', className: 'bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900', overlay: 'bg-[url("https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?q=80&w=2574&auto=format&fit=crop")] bg-cover bg-center opacity-40' },
    { id: 'forest', name: 'Deep Forest', className: 'bg-green-950', overlay: 'bg-[url("https://images.unsplash.com/photo-1448375240586-dfd8f3f0d8ac?q=80&w=2670&auto=format&fit=crop")] bg-cover bg-center opacity-40' },
    { id: 'space', name: 'Deep Space', className: 'bg-black', overlay: 'bg-[url("https://images.unsplash.com/photo-1534796636912-3b95b3ab5980?q=80&w=2672&auto=format&fit=crop")] bg-cover bg-center opacity-60' },
    { id: 'cafe', name: 'Cozy Cafe', className: 'bg-amber-950', overlay: 'bg-[url("https://images.unsplash.com/photo-1509042239860-f550ce710b93?q=80&w=2574&auto=format&fit=crop")] bg-cover bg-center opacity-40' },
];

export const ZenStation = () => {
    const {
        timeLeft, isActive, startTimer, stopTimer, resetTimer, setDuration
    } = useStore();

    const [activeBg, setActiveBg] = useState(BACKGROUNDS[2]); // Default Space
    const [tasks, setTasks] = useState<{ id: string, text: string, completed: boolean }[]>([]);
    const [newTask, setNewTask] = useState('');
    const [isFullScreen, setIsFullScreen] = useState(false);

    // Timer Formatter
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    const formattedTime = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

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

    // Listen for fullscreen change events (e.g. user presses Esc)
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

    return (
        <div className={cn("fixed inset-0 z-50 flex flex-col transition-all duration-1000", activeBg.className)}>
            {/* Background Image Overlay */}
            <div className={cn("absolute inset-0 transition-opacity duration-1000", activeBg.overlay)} />

            {/* UI Layer */}
            <div className="relative z-10 w-full h-full flex flex-col p-6 text-white/90">

                {/* Header Controls */}
                <div className="flex justify-between items-start">
                    <div className="space-y-1">
                        <Link href="/" onClick={() => document.exitFullscreen().catch(() => { })}>
                            <Button variant="ghost" className="text-white/70 hover:text-white hover:bg-white/10 group">
                                <X className="w-5 h-5 mr-2 group-hover:rotate-90 transition-transform" />
                                Exit Zen Mode
                            </Button>
                        </Link>
                    </div>

                    <div className="flex items-center gap-2 bg-black/30 backdrop-blur-md rounded-full p-1 border border-white/10">
                        {BACKGROUNDS.map(bg => (
                            <button
                                key={bg.id}
                                onClick={() => setActiveBg(bg)}
                                className={cn(
                                    "px-3 py-1 rounded-full text-xs font-medium transition-all",
                                    activeBg.id === bg.id ? "bg-white/20 text-white shadow-sm" : "text-white/50 hover:text-white hover:bg-white/10"
                                )}
                            >
                                {bg.name}
                            </button>
                        ))}
                    </div>

                    <Button variant="ghost" size="icon" onClick={toggleFullScreen} className="text-white/70 hover:text-white hover:bg-white/10">
                        {isFullScreen ? <Minimize className="w-5 h-5" /> : <Maximize className="w-5 h-5" />}
                    </Button>
                </div>

                {/* Main Focus Area */}
                <div className="flex-1 flex flex-col items-center justify-center gap-12">

                    {/* Timer */}
                    <div className="text-center space-y-8">
                        <div className="relative group cursor-default">
                            <div className="text-[12rem] font-black tracking-tighter leading-none font-mono drop-shadow-2xl select-none">
                                {formattedTime}
                            </div>
                        </div>

                        <div className="flex items-center justify-center gap-6">
                            <Button
                                size="lg"
                                className="h-16 w-16 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/10 transition-all hover:scale-110"
                                onClick={isActive ? stopTimer : startTimer}
                            >
                                {isActive ? <Pause className="w-8 h-8 fill-current" /> : <Play className="w-8 h-8 fill-current ml-1" />}
                            </Button>

                            <Button
                                size="icon"
                                variant="ghost"
                                className="h-12 w-12 rounded-full text-white/50 hover:text-white hover:bg-white/10 transition-all"
                                onClick={() => resetTimer()}
                            >
                                <RotateCcw className="w-6 h-6" />
                            </Button>
                        </div>

                        <div className="flex gap-2 justify-center opacity-0 hover:opacity-100 transition-opacity duration-300">
                            {[25, 45, 60].map(min => (
                                <Button key={min} variant="ghost" size="sm" onClick={() => setDuration(min)} className="text-white/50 hover:text-white">
                                    {min}m
                                </Button>
                            ))}
                        </div>
                    </div>

                </div>

                {/* Bottom Task List */}
                <div className="w-full max-w-md mx-auto mb-12">
                    <div className="bg-black/20 backdrop-blur-lg rounded-xl border border-white/10 overflow-hidden">
                        <div className="p-4 space-y-3">
                            {/* Tasks */}
                            <div className="space-y-2 max-h-[150px] overflow-y-auto custom-scrollbar">
                                <AnimatePresence initial={false}>
                                    {tasks.map(task => (
                                        <motion.div
                                            key={task.id}
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: 'auto' }}
                                            exit={{ opacity: 0, height: 0 }}
                                            className="flex items-center group"
                                        >
                                            <button
                                                onClick={() => toggleTask(task.id)}
                                                className={cn(
                                                    "w-5 h-5 rounded-full border flex items-center justify-center mr-3 transition-colors",
                                                    task.completed ? "bg-green-500/50 border-green-500/50 text-white" : "border-white/30 hover:border-white/60"
                                                )}
                                            >
                                                {task.completed && <Check className="w-3 h-3" />}
                                            </button>
                                            <span className={cn("flex-1 text-sm transition-all", task.completed ? "text-white/30 line-through" : "text-white/90")}>
                                                {task.text}
                                            </span>
                                            <button onClick={() => deleteTask(task.id)} className="opacity-0 group-hover:opacity-100 text-white/30 hover:text-red-400 transition-opacity">
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </motion.div>
                                    ))}
                                </AnimatePresence>
                                {tasks.length === 0 && (
                                    <div className="text-center text-white/30 text-xs py-2 italic">No active tasks. Set a goal!</div>
                                )}
                            </div>

                            {/* Input */}
                            <form onSubmit={addTask} className="flex gap-2 pt-2 border-t border-white/10">
                                <Input
                                    value={newTask}
                                    onChange={(e) => setNewTask(e.target.value)}
                                    placeholder="What's your focus?"
                                    className="bg-transparent border-none text-white placeholder:text-white/30 focus-visible:ring-0 h-8 text-sm px-0"
                                />
                                <Button type="submit" size="sm" variant="ghost" className="h-8 w-8 p-0 text-white/50 hover:text-white hover:bg-white/10">
                                    <Plus className="w-4 h-4" />
                                </Button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
