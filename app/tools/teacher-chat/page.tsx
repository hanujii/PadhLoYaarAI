'use client';

import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { chatTeacher } from './actions';
import { Mic, MicOff, Volume2, StopCircle, Send } from 'lucide-react';
import { DownloadPDFButton } from '@/components/global/DownloadPDFButton';
import { useSpeechRecognition } from '@/hooks/use-speech-recognition';
import { useTextToSpeech } from '@/hooks/use-text-to-speech';
import { AudioVisualizer } from '@/components/global/AudioVisualizer';
import { cn } from '@/lib/utils';

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
        <div className="max-w-2xl mx-auto space-y-8">
            <div className="text-center space-y-2">
                <h1 className="text-3xl font-bold">Teacher Chat</h1>
                <p className="text-muted-foreground">Practice answering questions with an AI teacher.</p>
            </div>

            <div className="flex flex-col items-center gap-8 py-8">
                {/* Audio Visualizer Area */}
                <div className="h-16 flex items-center justify-center w-full">
                    {(isListening || isSpeaking) ? (
                        <AudioVisualizer isActive={true} color={isListening ? 'bg-red-500' : 'bg-primary'} />
                    ) : (
                        <p className="text-sm text-muted-foreground animate-pulse">
                            Tap the microphone to speak...
                        </p>
                    )}
                </div>

                <div className="flex justify-center gap-6 items-center">
                    <Button
                        size="lg"
                        className={cn("rounded-full w-20 h-20 transition-all duration-300 shadow-xl",
                            isListening ? 'bg-red-500 hover:bg-red-600 scale-110 ring-4 ring-red-500/30' : 'bg-primary hover:bg-primary/90'
                        )}
                        onClick={toggleListening}
                    >
                        {isListening ? <MicOff className="w-8 h-8" /> : <Mic className="w-8 h-8" />}
                    </Button>

                    {isSpeaking && (
                        <Button size="icon" variant="outline" className="rounded-full w-12 h-12" onClick={stopSpeaking}>
                            <StopCircle className="w-5 h-5 text-destructive" />
                        </Button>
                    )}
                </div>

                {speechError && <p className="text-red-500 text-sm">{speechError}</p>}

                <form onSubmit={handleTextSubmit} className="flex gap-2 w-full max-w-md">
                    <Input
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value)}
                        placeholder="Or type your message..."
                        disabled={isListening}
                    />
                    <Button type="submit" disabled={!inputText.trim() || isListening}>
                        <Send className="w-4 h-4" />
                    </Button>
                </form>
            </div>

            <Card className="min-h-[400px]">
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                        <Volume2 className="w-5 h-5" /> Conversation
                    </CardTitle>
                    {messages.length > 0 && <DownloadPDFButton targetRef={chatRef} filename="teacher-conversation.pdf" />}
                </CardHeader>
                <CardContent className="space-y-4 max-h-[500px] overflow-y-auto">
                    <div ref={chatRef} className="space-y-4">
                        {messages.length === 0 && (
                            <p className="text-center text-muted-foreground italic">
                                Conversation will appear here.
                            </p>
                        )}
                        {messages.map((m, i) => (
                            <div key={i} className={`flex ${m.role === 'student' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-[80%] p-3 rounded-lg ${m.role === 'student' ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                                    <p className="text-xs font-semibold mb-1 opacity-70 uppercase">{m.role}</p>
                                    <p>{m.content}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
