'use client';

import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { chatTeacher } from './actions';
import { Mic, MicOff, Volume2, StopCircle, Send } from 'lucide-react';
import { DownloadPDFButton } from '@/components/global/DownloadPDFButton';

export default function TeacherChatPage() {
    const [messages, setMessages] = useState<{ role: string; content: string }[]>([]);
    const [isListening, setIsListening] = useState(false);
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [inputText, setInputText] = useState('');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [recognition, setRecognition] = useState<any>(null);
    const chatRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
            if (SpeechRecognition) {
                const recognitionInstance = new SpeechRecognition();
                recognitionInstance.continuous = false;
                recognitionInstance.interimResults = false;
                recognitionInstance.lang = 'en-US';

                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                recognitionInstance.onresult = (event: any) => {
                    const transcript = event.results[0][0].transcript;
                    handleUserMessage(transcript);
                };

                recognitionInstance.onend = () => {
                    setIsListening(false);
                };

                setRecognition(recognitionInstance);
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const toggleListening = () => {
        if (!recognition) return alert('Speech recognition not supported in this browser.');

        if (isListening) {
            recognition.stop();
        } else {
            recognition.start();
            setIsListening(true);
        }
    };

    const handleTextSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!inputText.trim()) return;
        handleUserMessage(inputText);
        setInputText('');
    };

    const handleUserMessage = async (text: string) => {
        const newHistory = [...messages, { role: 'student', content: text }];
        setMessages(newHistory);

        const result = await chatTeacher(text, messages);
        if (result.success && result.data) {
            const assistantMsg = { role: 'teacher', content: result.data };
            setMessages([...newHistory, assistantMsg]);
            speak(result.data);
        }
    };

    const speak = (text: string) => {
        if ('speechSynthesis' in window) {
            window.speechSynthesis.cancel();
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.onstart = () => setIsSpeaking(true);
            utterance.onend = () => setIsSpeaking(false);
            window.speechSynthesis.speak(utterance);
        }
    };

    const stopSpeaking = () => {
        window.speechSynthesis.cancel();
        setIsSpeaking(false);
    };

    return (
        <div className="max-w-2xl mx-auto space-y-8">
            <div className="text-center space-y-2">
                <h1 className="text-3xl font-bold">Teacher Chat</h1>
                <p className="text-muted-foreground">Practice answering questions with an AI teacher.</p>
            </div>

            <div className="flex flex-col items-center gap-6">
                <div className="flex justify-center gap-4">
                    <Button
                        size="lg"
                        className={`rounded-full w-16 h-16 ${isListening ? 'bg-red-500 hover:bg-red-600 animate-pulse' : ''}`}
                        onClick={toggleListening}
                    >
                        {isListening ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
                    </Button>

                    {isSpeaking && (
                        <Button size="lg" variant="outline" className="rounded-full w-16 h-16" onClick={stopSpeaking}>
                            <StopCircle className="w-6 h-6" />
                        </Button>
                    )}
                </div>

                <form onSubmit={handleTextSubmit} className="flex gap-2 w-full max-w-md">
                    <Input
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value)}
                        placeholder="Or type your answer here..."
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
                                Tap the microphone or type below to start.
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
