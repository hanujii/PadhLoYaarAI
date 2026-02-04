'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { generatePodcastScript, PodcastResponse, PodcastScriptItem } from '@/app/tools/podcast/actions';
import { Play, Pause, Square, Mic, Volume2, User, Sparkles, Download } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { useHistoryStore } from '@/lib/history-store';

const PERSONAS = [
    { id: 'standard', name: 'Professor & Student', icon: '🎓' },
    { id: 'tech', name: 'Tech Bros (Silicon Valley)', icon: '💻' },
    { id: 'casual', name: 'Casual Friends Gossiping', icon: '☕' },
    { id: 'debate', name: 'Intense Debate', icon: '⚔️' },
    { id: 'eli5', name: 'Toddler & Scientist', icon: '👶' },
];

export const PodcastStudio = () => {
    const [topic, setTopic] = useState('');
    const [persona, setPersona] = useState('standard');
    const [loading, setLoading] = useState(false);
    const [scriptData, setScriptData] = useState<PodcastResponse | null>(null);

    // Audio State
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentLineIndex, setCurrentLineIndex] = useState(-1);
    const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
    const synth = useRef<SpeechSynthesis | null>(null);
    const [hostVoice, setHostVoice] = useState<SpeechSynthesisVoice | null>(null);
    const [guestVoice, setGuestVoice] = useState<SpeechSynthesisVoice | null>(null);

    // Initialize TTS
    useEffect(() => {
        if (typeof window !== 'undefined') {
            synth.current = window.speechSynthesis;
            const loadVoices = () => {
                const vs = synth.current?.getVoices() || [];
                setVoices(vs);
                // Try to set distinct default voices
                if (vs.length > 0) {
                    setHostVoice(vs.find(v => v.name.includes('Google US English')) || vs[0]);
                    setGuestVoice(vs.find(v => v.name.includes('Google UK English Male')) || vs.find(v => v.name.includes('Male')) || vs[1] || vs[0]);
                }
            };
            loadVoices();
            if (synth.current?.onvoiceschanged !== undefined) {
                synth.current.onvoiceschanged = loadVoices;
            }
        }
    }, []);

    const handleGenerate = async () => {
        if (!topic.trim()) return;
        setLoading(true);
        setScriptData(null);
        setCurrentLineIndex(-1);
        stopAudio();

        const res = await generatePodcastScript(topic, PERSONAS.find(p => p.id === persona)?.name || 'Standard');
        if (res.success && res.data) {
            setScriptData(res.data);

            // Save to History
            const scriptText = res.data.script.map(s => `${s.speaker}: ${s.text}`).join('\n\n');
            useHistoryStore.getState().addToHistory({
                tool: 'podcast',
                query: topic,
                result: `Title: ${res.data.title}\n\n${scriptText}`,
            });
        } else {
            toast.error(res.error || "Failed to generate podcast.");
        }
        setLoading(false);
    };

    const playPodcast = () => {
        if (!scriptData || !synth.current) return;

        if (isPlaying) {
            // Pause logic if needed, but for simplicity we'll just stop or resume
            synth.current.cancel();
            setIsPlaying(false);
            return;
        }

        setIsPlaying(true);
        let startIndex = currentLineIndex + 1;
        if (startIndex >= scriptData.script.length) startIndex = 0;

        speakLine(startIndex);
    };

    const speakLine = (index: number) => {
        if (!scriptData || index >= scriptData.script.length || !synth.current) {
            setIsPlaying(false);
            setCurrentLineIndex(-1); // Done
            return;
        }

        setCurrentLineIndex(index);
        const line = scriptData.script[index];
        const utterance = new SpeechSynthesisUtterance(line.text);

        // Voice Selection
        utterance.voice = line.speaker === 'Host' ? hostVoice : guestVoice;
        // Adjust Pitch/Rate slightly for variety if needed
        utterance.pitch = line.speaker === 'Host' ? 1 : 0.9;
        utterance.rate = 1.1;

        utterance.onend = () => {
            speakLine(index + 1);
        };

        synth.current.speak(utterance);
    };

    const stopAudio = () => {
        if (synth.current) {
            synth.current.cancel();
        }
        setIsPlaying(false);
    };

    return (
        <div className="max-w-4xl mx-auto p-4 space-y-8 pb-32">
            {/* Header */}
            <div className="text-center space-y-4">
                <h1 className="text-4xl md:text-5xl font-black tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500">
                    AI Podcast Generator
                </h1>
                <p className="text-muted-foreground text-lg">
                    Turn any topic into an engaging audio conversation.
                </p>
            </div>

            {/* Controls */}
            <Card className="glass-card border-primary/20">
                <CardContent className="p-6 space-y-6">
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="flex-1">
                            <Input
                                placeholder="Enter a topic (e.g., Quantum Physics, French Revolution)..."
                                value={topic}
                                onChange={(e) => setTopic(e.target.value)}
                                className="h-12 text-lg bg-black/20"
                            />
                        </div>
                        <Select value={persona} onValueChange={setPersona}>
                            <SelectTrigger className="w-[200px] h-12 bg-black/20">
                                <SelectValue placeholder="Select Persona" />
                            </SelectTrigger>
                            <SelectContent>
                                {PERSONAS.map(p => (
                                    <SelectItem key={p.id} value={p.id}>
                                        <span className="mr-2">{p.icon}</span> {p.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <Button
                            onClick={handleGenerate}
                            disabled={loading || !topic}
                            className="h-12 px-8 bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 text-white font-bold shadow-lg shadow-purple-500/25"
                        >
                            {loading ? <Sparkles className="w-5 h-5 animate-spin" /> : "Generate"}
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* Result Area */}
            <AnimatePresence mode="wait">
                {scriptData && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="space-y-6"
                    >
                        {/* Audio Controller */}
                        <div className="sticky top-24 z-30 bg-black/60 backdrop-blur-xl border border-white/10 p-4 rounded-xl flex items-center justify-between shadow-2xl">
                            <div className="flex items-center gap-4">
                                <Button
                                    size="icon"
                                    onClick={playPodcast}
                                    className={cn("w-12 h-12 rounded-full transition-all", isPlaying ? "bg-red-500 hover:bg-red-600" : "bg-green-500 hover:bg-green-600")}
                                >
                                    {isPlaying ? <Pause className="w-6 h-6 fill-current" /> : <Play className="w-6 h-6 fill-current ml-1" />}
                                </Button>
                                <Button size="icon" variant="ghost" onClick={stopAudio}>
                                    <Square className="w-5 h-5 fill-current" />
                                </Button>

                                <div className="hidden md:block">
                                    <h3 className="font-bold text-white line-clamp-1">{scriptData.title}</h3>
                                    <p className="text-xs text-muted-foreground flex items-center gap-2">
                                        <Volume2 className="w-3 h-3" /> Now Playing: {currentLineIndex >= 0 ? scriptData.script[currentLineIndex].speaker : 'Ready'}
                                    </p>
                                </div>
                            </div>

                            {/* Visualizer Placeholder */}
                            <div className="flex gap-1 items-center h-8">
                                {[...Array(5)].map((_, i) => (
                                    <motion.div
                                        key={i}
                                        animate={{ height: isPlaying ? [10, 24, 10] : 4 }}
                                        transition={{ repeat: Infinity, duration: 0.5 + i * 0.1, delay: i * 0.05 }}
                                        className="w-1 bg-primary rounded-full"
                                    />
                                ))}
                            </div>
                        </div>

                        {/* Script Details */}
                        <div className="space-y-4">
                            {scriptData.script.map((item: PodcastScriptItem, index: number) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{
                                        opacity: currentLineIndex === index ? 1 : 0.6,
                                        scale: currentLineIndex === index ? 1.02 : 1,
                                        x: 0
                                    }}
                                    className={cn(
                                        "p-4 rounded-xl border transition-all duration-300",
                                        currentLineIndex === index
                                            ? "bg-primary/10 border-primary shadow-lg shadow-primary/10"
                                            : "bg-white/5 border-transparent hover:bg-white/10"
                                    )}
                                >
                                    <div className="flex items-start gap-4">
                                        <div className={cn(
                                            "w-10 h-10 rounded-full flex items-center justify-center text-lg font-bold shrink-0",
                                            item.speaker === 'Host' ? "bg-indigo-500/20 text-indigo-400" : "bg-pink-500/20 text-pink-400"
                                        )}>
                                            {item.speaker === 'Host' ? 'H' : 'G'}
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-muted-foreground mb-1">{item.speaker}</p>
                                            <p className="text-lg leading-relaxed">{item.text}</p>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};
