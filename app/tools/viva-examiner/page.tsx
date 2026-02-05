'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Mic, Square, Volume2, MicOff, Play, Save } from 'lucide-react';
import { conductViva } from './actions';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
import { useHistoryStore } from '@/lib/history-store';

type Message = {
    role: 'user' | 'assistant';
    content: string;
};

export default function VivaExaminerPage() {
    const [topic, setTopic] = useState('');
    const [isStarted, setIsStarted] = useState(false);
    const [messages, setMessages] = useState<Message[]>([]);
    const [isRecording, setIsRecording] = useState(false);
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [transcript, setTranscript] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);

    // Refs for speech API
    const recognitionRef = useRef<any>(null);
    const synthRef = useRef<SpeechSynthesis | null>(null);
    const { saveItem } = useHistoryStore();

    useEffect(() => {
        // Initialize Speech APIs only on client
        if (typeof window !== 'undefined') {
            synthRef.current = window.speechSynthesis;

            // Setup Speech Recognition
            const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
            if (SpeechRecognition) {
                recognitionRef.current = new SpeechRecognition();
                recognitionRef.current.continuous = true;
                recognitionRef.current.interimResults = true;
                recognitionRef.current.lang = 'en-US';

                recognitionRef.current.onresult = (event: any) => {
                    let currentTranscript = '';
                    for (let i = event.resultIndex; i < event.results.length; i++) {
                        currentTranscript += event.results[i][0].transcript;
                    }
                    setTranscript(currentTranscript);
                };

                recognitionRef.current.onerror = (event: any) => {
                    console.error("Speech recognition error", event.error);
                    stopRecording();
                    toast.error("Microphone error: " + event.error);
                };
            }
        }

        return () => {
            if (recognitionRef.current) {
                recognitionRef.current.stop();
            }
            if (synthRef.current) {
                synthRef.current.cancel();
            }
        };
    }, []);

    const speak = (text: string) => {
        if (!synthRef.current) return;

        // Cancel any ongoing speech
        synthRef.current.cancel();

        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 1.0;
        utterance.pitch = 1.0;

        // Try to find a good English voice
        const voices = synthRef.current.getVoices();
        const preferredVoice = voices.find(v => v.name.includes('Male') || v.name.includes('Google US English'));
        if (preferredVoice) utterance.voice = preferredVoice;

        utterance.onstart = () => setIsSpeaking(true);
        utterance.onend = () => setIsSpeaking(false);

        synthRef.current.speak(utterance);
    };

    const startRecording = () => {
        if (!recognitionRef.current) {
            toast.error("Speech recognition not supported in this browser.");
            return;
        }
        setTranscript('');
        recognitionRef.current.start();
        setIsRecording(true);
    };

    const stopRecording = () => {
        if (recognitionRef.current) {
            recognitionRef.current.stop();
        }
        setIsRecording(false);
        // If we have a transcript, submit it
        if (transcript.trim().length > 1) {
            handleSubmitAnswer(transcript);
        }
    };

    const handleStartSession = async () => {
        if (!topic.trim()) {
            toast.error("Please enter a topic first.");
            return;
        }

        setIsStarted(true);
        setIsProcessing(true);

        // Initial greeting / first question
        const history: any[] = []; // Empty history for first prompt
        const response = await conductViva(topic, history);

        setIsProcessing(false);

        if (response.success && response.response) {
            const newMessage: Message = { role: 'assistant', content: response.response };
            setMessages([newMessage]);
            speak(response.response);
        } else {
            toast.error("Examiner failed to start.");
            setIsStarted(false);
        }
    };

    const handleSubmitAnswer = async (userAnswer: string) => {
        if (!userAnswer.trim()) return;

        // Add user message immediately
        const updatedMessages: Message[] = [
            ...messages,
            { role: 'user', content: userAnswer }
        ];
        setMessages(updatedMessages);
        setTranscript('');
        setIsProcessing(true);

        // Get Examiner response
        const response = await conductViva(topic, updatedMessages);

        setIsProcessing(false);

        if (response.success && response.response) {
            const assistantMsg: Message = { role: 'assistant', content: response.response };
            setMessages([...updatedMessages, assistantMsg]);
            speak(response.response);
        } else {
            toast.error("Examiner disconnected.");
        }
    };

    const handleEndSession = () => {
        // Save the session to history
        const blob = messages.map(m => `${m.role.toUpperCase()}: ${m.content}`).join('\n\n');
        saveItem({
            type: 'result', // or standard note
            title: `Viva Exam: ${topic}`,
            content: blob
        });
        toast.success("Session saved to History!");
        setIsStarted(false);
        setMessages([]);
        setTopic('');
    };

    return (
        <div className="container max-w-2xl mx-auto py-12 space-y-8">
            <div className="text-center space-y-2">
                <h1 className="text-4xl font-extrabold tracking-tight bg-gradient-to-r from-red-600 to-orange-500 bg-clip-text text-transparent">
                    AI Viva Examiner
                </h1>
                <p className="text-muted-foreground">
                    Prepare for your oral exams. Speak your answers. Be confident.
                </p>
            </div>

            <Card className="glass-card overflow-hidden border-t-4 border-t-red-500">
                <CardHeader>
                    <CardTitle className="text-center flex items-center justify-center gap-2">
                        {isStarted ? (
                            <>
                                <span className="relative flex h-3 w-3">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                                </span>
                                Exam in Progress
                            </>
                        ) : "Setup Interview"}
                    </CardTitle>
                </CardHeader>

                <CardContent className="space-y-6">
                    {!isStarted ? (
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label>What topic are you studying?</Label>
                                <Input
                                    placeholder="e.g. Photosynthesis, World War II, React Hooks..."
                                    value={topic}
                                    onChange={(e) => setTopic(e.target.value)}
                                    className="text-lg"
                                />
                            </div>
                            <Button
                                onClick={handleStartSession}
                                className="w-full h-12 text-lg bg-red-600 hover:bg-red-700 text-white"
                                disabled={isProcessing}
                            >
                                {isProcessing ? "Preparing Room..." : "Start Viva"}
                            </Button>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center space-y-8">
                            {/* AI Avatar / Orb */}
                            <motion.div
                                animate={{
                                    scale: isSpeaking ? [1, 1.1, 1] : 1,
                                    boxShadow: isSpeaking
                                        ? "0 0 30px 10px rgba(239, 68, 68, 0.4)"
                                        : "0 0 0px 0px rgba(239, 68, 68, 0)"
                                }}
                                transition={{ repeat: Infinity, duration: 2 }}
                                className="w-40 h-40 rounded-full bg-gradient-to-b from-red-500 to-orange-600 flex items-center justify-center shadow-2xl relative"
                            >
                                <div className="absolute inset-2 rounded-full border-4 border-white/20"></div>
                                <Mic className="w-16 h-16 text-white" />
                            </motion.div>

                            <div className="w-full min-h-[100px] text-center space-y-2">
                                {isProcessing ? (
                                    <p className="text-muted-foreground animate-pulse">Examiner is thinking...</p>
                                ) : (
                                    <p className="text-lg font-medium leading-relaxed">
                                        {messages[messages.length - 1]?.role === 'assistant'
                                            ? messages[messages.length - 1]?.content
                                            : "..."}
                                    </p>
                                )}
                            </div>

                            <div className="w-full space-y-4">
                                {/* Transcript Preview */}
                                {transcript && (
                                    <div className="bg-muted p-3 rounded-lg text-sm text-center italic">
                                        "{transcript}"
                                    </div>
                                )}

                                {/* Controls */}
                                <div className="flex items-center justify-center gap-4">
                                    {isRecording ? (
                                        <Button
                                            onClick={stopRecording}
                                            variant="destructive"
                                            size="lg"
                                            className="h-16 w-16 rounded-full animate-pulse"
                                        >
                                            <Square className="w-6 h-6 fill-current" />
                                        </Button>
                                    ) : (
                                        <Button
                                            onClick={startRecording}
                                            variant="outline"
                                            size="lg"
                                            className="h-16 w-16 rounded-full border-2 border-red-500 hover:bg-red-50 dark:hover:bg-red-950/20"
                                            disabled={isProcessing || isSpeaking}
                                        >
                                            <Mic className="w-8 h-8 text-red-500" />
                                        </Button>
                                    )}
                                </div>
                                <p className="text-xs text-center text-muted-foreground">
                                    {isRecording ? "Listening... Click stop to submit." : "Tap microphone to answer."}
                                </p>
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>

            {isStarted && (
                <div className="flex justify-center">
                    <Button variant="ghost" className="text-muted-foreground" onClick={handleEndSession}>
                        <Save className="w-4 h-4 mr-2" />
                        End & Save Session
                    </Button>
                </div>
            )}
        </div>
    );
}
