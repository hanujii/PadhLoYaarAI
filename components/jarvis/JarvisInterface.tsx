'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Mic, MicOff, Volume2, Loader2, Play } from 'lucide-react';
import { getJarvisResponse } from '@/app/tools/jarvis/actions';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { useHistoryStore } from '@/lib/history-store';

export const JarvisInterface = () => {
    const [isListening, setIsListening] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [transcript, setTranscript] = useState('');
    const [response, setResponse] = useState('');

    const recognition = useRef<SpeechRecognition | null>(null);
    const synth = useRef<SpeechSynthesis | null>(null);
    const jarvisVoice = useRef<SpeechSynthesisVoice | null>(null);

    // Initialize Speech Engines
    useEffect(() => {
        if (typeof window !== 'undefined') {
            // STT
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            if (SpeechRecognition) {
                recognition.current = new SpeechRecognition();
                recognition.current.continuous = false; // Turn off for single command mode
                recognition.current.interimResults = false;
                recognition.current.lang = 'en-US';

                recognition.current.onstart = () => setIsListening(true);
                recognition.current.onend = () => setIsListening(false);
                recognition.current.onresult = (event: SpeechRecognitionEvent) => {
                    const text = event.results[0][0].transcript;
                    setTranscript(text);
                    handleQuery(text);
                };
                recognition.current.onerror = (event: SpeechRecognitionErrorEvent) => {
                    const errorMessage = event.error || 'Unknown error';
                    if (process.env.NODE_ENV === 'development') {
                        console.error("Speech Error:", errorMessage);
                    }
                    setIsListening(false);
                    toast.error(`Microphone error: ${errorMessage}. Please try again.`);
                };
            } else {
                toast.error("Voice recognition not supported in this browser.");
            }

            // TTS
            synth.current = window.speechSynthesis;
            const loadVoices = () => {
                const voices = synth.current?.getVoices() || [];
                // Look for a British Male voice (classic Jarvis) or closest
                jarvisVoice.current = voices.find(v => v.name.includes('UK English Male'))
                    || voices.find(v => v.name.includes('Google UK English Male'))
                    || voices.find(v => v.name.includes('Male'))
                    || voices[0];
            };
            loadVoices();
            if (synth.current?.onvoiceschanged !== undefined) {
                synth.current.onvoiceschanged = loadVoices;
            }
        }
    }, []);

    const toggleListening = () => {
        if (isListening) {
            recognition.current?.stop();
        } else {
            // Stop speaking if active
            if (isSpeaking) {
                synth.current?.cancel();
                setIsSpeaking(false);
            }
            try {
                recognition.current?.start();
            } catch (e) {
                console.error("Start Error:", e);
                // Sometimes it needs a hard reset if user spammed
                recognition.current?.stop();
                setTimeout(() => recognition.current?.start(), 200);
            }
        }
    };

    const handleQuery = async (text: string) => {
        setIsProcessing(true);
        const res = await getJarvisResponse(text);
        setIsProcessing(false);

        if (res.success && res.text) {
            setResponse(res.text);
            speak(res.text);

            // Save to History
            useHistoryStore.getState().addToHistory({
                tool: 'jarvis',
                query: text,
                result: res.text,
            });
        } else {
            speak("I apologize, but I encountered an error processing your request.");
        }
    };

    const speak = (text: string) => {
        if (!synth.current) return;

        synth.current.cancel(); // Stop anything playing
        setIsSpeaking(true);

        const utterance = new SpeechSynthesisUtterance(text);
        if (jarvisVoice.current) utterance.voice = jarvisVoice.current;
        utterance.pitch = 0.9; // Slightly deeper
        utterance.rate = 1.0;

        utterance.onend = () => setIsSpeaking(false);
        utterance.onerror = () => setIsSpeaking(false);

        synth.current.speak(utterance);
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-[80vh] w-full relative">

            {/* Ambient Glow */}
            <div className="absolute inset-0 bg-blue-500/5 blur-[100px] rounded-full pointer-events-none" />

            {/* Main Visualizer Circle */}
            <div className="relative z-10">
                <motion.div
                    animate={{
                        scale: isListening ? [1, 1.1, 1] : isSpeaking ? [1, 1.2, 1] : 1,
                        rotate: isProcessing ? 360 : 0
                    }}
                    transition={{
                        scale: { repeat: Infinity, duration: isListening ? 1.5 : 0.5 },
                        rotate: { repeat: Infinity, duration: 2, ease: "linear" }
                    }}
                    className={cn(
                        "w-64 h-64 rounded-full border-4 flex items-center justify-center relative shadow-[0_0_50px_rgba(0,0,0,0.5)] transition-colors duration-500",
                        isListening ? "border-red-500 shadow-red-500/20" :
                            isProcessing ? "border-amber-400 shadow-amber-400/20" :
                                isSpeaking ? "border-cyan-400 shadow-cyan-400/40" :
                                    "border-blue-500/30"
                    )}
                >
                    {/* Core Arc Rings */}
                    <div className="absolute inset-2 border-2 border-dashed border-white/20 rounded-full animate-[spin_10s_linear_infinite]" />
                    <div className="absolute inset-8 border border-white/10 rounded-full animate-[spin_15s_linear_infinite_reverse]" />

                    {/* Center Icon */}
                    <div className="relative z-20">
                        {isProcessing ? <Loader2 className="w-16 h-16 text-amber-400 animate-spin" /> :
                            isSpeaking ? <Volume2 className="w-16 h-16 text-cyan-400" /> :
                                <Mic className={cn("w-16 h-16 transition-colors", isListening ? "text-red-500" : "text-blue-500/50")} />
                        }
                    </div>

                    {/* Speaking Waveforms (Simulated) */}
                    {isSpeaking && (
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                            {[1, 2, 3].map(i => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0.5, scale: 1 }}
                                    animate={{ opacity: 0, scale: 2 }}
                                    transition={{ repeat: Infinity, duration: 1, delay: i * 0.3 }}
                                    className="absolute inset-0 border border-cyan-400/50 rounded-full"
                                />
                            ))}
                        </div>
                    )}
                </motion.div>
            </div>

            {/* Status Text */}
            <div className="mt-12 text-center space-y-4 max-w-lg px-4">
                <h2 className="text-2xl font-light tracking-widest uppercase text-blue-200/80">
                    {isListening ? "Listening..." : isProcessing ? "Processing..." : isSpeaking ? "Speaking..." : "Standby"}
                </h2>

                {transcript && (
                    <p className="text-lg text-white/60 italic">"{transcript}"</p>
                )}

                {response && !isListening && !isProcessing && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white/5 border border-white/10 p-4 rounded-xl backdrop-blur-md"
                    >
                        <p className="text-cyan-100">{response}</p>
                    </motion.div>
                )}
            </div>

            {/* Interaction Button */}
            <div className="mt-8">
                <Button
                    size="lg"
                    className={cn(
                        "rounded-full h-16 w-16 shadow-xl transition-all hover:scale-105",
                        isListening ? "bg-red-500 hover:bg-red-600" : "bg-blue-600 hover:bg-blue-500"
                    )}
                    onClick={toggleListening}
                >
                    {isListening ? <MicOff className="w-6 h-6 fill-current" /> : <Mic className="w-6 h-6 fill-current" />}
                </Button>
            </div>

        </div>
    );
};
