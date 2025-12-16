'use client';

import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { GlassCard } from '@/components/ui/glass-card';
import { chatTeacher } from './actions';
import { Mic, MicOff, Volume2, StopCircle, Send, MessageSquare } from 'lucide-react';
import { motion } from 'framer-motion';
import { DownloadPDFButton } from '@/components/global/DownloadPDFButton';
import { useSpeechRecognition } from '@/hooks/use-speech-recognition';
import { useTextToSpeech } from '@/hooks/use-text-to-speech';
import { AudioVisualizer } from '@/components/global/AudioVisualizer';
import { cn } from '@/lib/utils';
import { ToolBackButton } from '@/components/global/ToolBackButton';

export default function TeacherChatPage() {
    const [messages, setMessages] = useState<{ role: string; content: string }[]>([]);
    const [inputText, setInputText] = useState('');

    // New Hooks
    const { isListening, transcript, startListening, stopListening, resetTranscript, error: speechError } = useSpeechRecognition();
    const { speak, stop: stopSpeaking, isSpeaking } = useTextToSpeech();

    const chatRef = useRef<HTMLDivElement>(null);

    // Auto-fill input with transcript
    useEffect(() => {
        if (transcript) {
            setInputText(transcript);
        }
    }, [transcript]);

    // Auto-submit when listening stops and we have text
    useEffect(() => {
        if (!isListening && transcript) {
            handleUserMessage(transcript);
            resetTranscript();
        }
    }, [isListening, transcript]);

    const handleTextSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!inputText.trim()) return;
        handleUserMessage(inputText);
        setInputText('');
    };

    const handleUserMessage = async (text: string) => {
        const newHistory = [...messages, { role: 'student', content: text }];
        setMessages(newHistory);
        setInputText(''); // Clear input if it was manual

        const result = await chatTeacher(text, messages);
        if (result.success && result.data) {
            const assistantMsg = { role: 'teacher', content: result.data };
            setMessages([...newHistory, assistantMsg]);
            speak(result.data);
        }
    };

    const toggleListening = () => {
        if (isListening) {
            stopListening();
        } else {
            startListening();
        }
    };

    return (
        <div className="max-w-2xl mx-auto space-y-8 px-4 md:px-0">
            <ToolBackButton />
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="text-center space-y-2"
            >
                <h1 className="text-4xl font-extrabold tracking-tight text-primary drop-shadow-lg">Teacher Chat</h1>
                <p className="text-lg text-muted-foreground">Practice answering questions with an AI teacher.</p>
            </motion.div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="flex flex-col items-center gap-8 py-8"
            >
                {/* Audio Visualizer Area */}
                <div className="h-24 flex items-center justify-center w-full relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/10 to-transparent blur-xl rounded-full" />
                    {(isListening || isSpeaking) ? (
                        <AudioVisualizer isActive={true} color={isListening ? 'bg-red-500' : 'bg-primary'} />
                    ) : (
                        <p className="text-sm text-muted-foreground animate-pulse p-4 rounded-full border border-white/5 bg-white/5 backdrop-blur-sm">
                            Tap the microphone to speak...
                        </p>
                    )}
                </div>

                <div className="flex justify-center gap-6 items-center relative z-10">
                    <div className="relative">
                        {isListening && <div className="absolute inset-0 bg-red-500 blur-xl opacity-50 rounded-full animate-pulse" />}
                        <Button
                            size="lg"
                            className={cn("rounded-full w-24 h-24 transition-all duration-300 shadow-2xl z-10 relative flex items-center justify-center border-4 border-background/20 backdrop-blur-md",
                                isListening ? 'bg-red-500 hover:bg-red-600 scale-110 ring-4 ring-red-500/30' : 'bg-primary/80 hover:bg-primary hover:scale-105'
                            )}
                            onClick={toggleListening}
                        >
                            {isListening ? <MicOff className="w-10 h-10" /> : <Mic className="w-10 h-10" />}
                        </Button>
                    </div>

                    {isSpeaking && (
                        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}>
                            <Button size="icon" variant="outline" className="rounded-full w-12 h-12 border-red-500/50 hover:bg-red-500/10" onClick={stopSpeaking}>
                                <StopCircle className="w-5 h-5 text-destructive" />
                            </Button>
                        </motion.div>
                    )}
                </div>

                {speechError && <p className="text-red-500 text-sm font-medium bg-red-500/10 px-4 py-2 rounded-full border border-red-500/20">{speechError}</p>}

                <form onSubmit={handleTextSubmit} className="flex gap-2 w-full max-w-md">
                    <Input
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value)}
                        placeholder="Or type your message..."
                        disabled={isListening}
                        className="bg-background/50 border-white/10 backdrop-blur-sm focus:ring-primary/50"
                    />
                    <Button type="submit" disabled={!inputText.trim() || isListening} className="shadow-lg">
                        <Send className="w-4 h-4" />
                    </Button>
                </form>
            </motion.div>

            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
            >
                <GlassCard className="min-h-[400px] border-primary/10" enableTilt={false}>
                    <CardHeader className="flex flex-row items-center justify-between border-b border-white/5 pb-4">
                        <CardTitle className="flex items-center gap-2 text-xl">
                            <Volume2 className="w-5 h-5 text-primary" /> Conversation
                        </CardTitle>
                        {messages.length > 0 && <DownloadPDFButton targetRef={chatRef} filename="teacher-conversation.pdf" />}
                    </CardHeader>
                    <CardContent className="space-y-4 max-h-[500px] overflow-y-auto p-6 custom-scrollbar">
                        <div ref={chatRef} className="space-y-6">
                            {messages.length === 0 && (
                                <div className="text-center text-muted-foreground italic flex flex-col items-center justify-center h-40 opacity-50">
                                    <MessageSquare className="w-12 h-12 mb-2" />
                                    <p>Conversation will appear here.</p>
                                </div>
                            )}
                            {messages.map((m, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    className={`flex ${m.role === 'student' ? 'justify-end' : 'justify-start'}`}
                                >
                                    <div className={cn(
                                        "max-w-[85%] p-4 rounded-2xl shadow-sm backdrop-blur-md border",
                                        m.role === 'student'
                                            ? 'bg-primary/90 text-primary-foreground rounded-tr-none border-primary/20'
                                            : 'bg-muted/80 text-foreground rounded-tl-none border-white/10'
                                    )}>
                                        <p className="text-xs font-bold mb-1 opacity-70 uppercase tracking-wider">{m.role}</p>
                                        <p className="leading-relaxed">{m.content}</p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </CardContent>
                </GlassCard>
            </motion.div>
        </div>
    );
}
