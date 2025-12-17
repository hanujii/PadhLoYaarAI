'use client';

import { useState, useEffect, useCallback } from 'react';

// Define types for the Web Speech API to satisfy TypeScript
interface SpeechRecognitionEvent {
    resultIndex: number;
    results: {
        length: number;
        [key: number]: {
            isFinal: boolean;
            [key: number]: {
                transcript: string;
            };
        };
    };
}

interface SpeechRecognitionErrorEvent {
    error: string;
}

interface IWindow extends Window {
    webkitSpeechRecognition: any;
    SpeechRecognition: any;
}

export function useSpeechRecognition() {
    const [isListening, setIsListening] = useState(false);
    const [transcript, setTranscript] = useState('');
    const [interimTranscript, setInterimTranscript] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [recognition, setRecognition] = useState<any>(null);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const { webkitSpeechRecognition, SpeechRecognition } = window as unknown as IWindow;
            const SpeechRecognitionConstructor = SpeechRecognition || webkitSpeechRecognition;

            if (SpeechRecognitionConstructor) {
                const recognitionInstance = new SpeechRecognitionConstructor();
                recognitionInstance.continuous = true; // Changed to true for longer dictation
                recognitionInstance.interimResults = true;
                recognitionInstance.lang = 'en-US';

                recognitionInstance.onstart = () => {
                    setIsListening(true);
                    setError(null);
                };

                recognitionInstance.onend = () => {
                    setIsListening(false);
                };

                recognitionInstance.onresult = (event: SpeechRecognitionEvent) => {
                    let finalArgs = '';
                    let interimArgs = '';

                    for (let i = event.resultIndex; i < event.results.length; ++i) {
                        if (event.results[i].isFinal) {
                            finalArgs += event.results[i][0].transcript;
                        } else {
                            interimArgs += event.results[i][0].transcript;
                        }
                    }

                    if (finalArgs) {
                        setTranscript(prev => prev + ' ' + finalArgs);
                    }
                    setInterimTranscript(interimArgs);
                };

                recognitionInstance.onerror = (event: SpeechRecognitionErrorEvent) => {
                    console.error("Speech Error:", event.error);
                    if (event.error === 'not-allowed') {
                        setError('Microphone access denied.');
                    } else if (event.error === 'no-speech') {
                        // Ignore no-speech errors usually, just means silence
                    } else {
                        setError(event.error);
                    }
                    // Don't auto-stop on some errors to allow retry, but strictly `listening` state usually updates on `onend`
                };

                setRecognition(recognitionInstance);
            } else {
                setError('Speech recognition is not supported in this browser.');
            }
        }
    }, []);

    const startListening = useCallback(() => {
        if (recognition && !isListening) {
            try {
                recognition.start();
            } catch (e) {
                console.error("Start error:", e);
            }
        }
    }, [recognition, isListening]);

    const stopListening = useCallback(() => {
        if (recognition && isListening) {
            recognition.stop();
        }
    }, [recognition, isListening]);

    const resetTranscript = useCallback(() => {
        setTranscript('');
        setInterimTranscript('');
        setError(null);
    }, []);

    return { isListening, transcript: transcript + (interimTranscript ? ' ' + interimTranscript : ''), startListening, stopListening, resetTranscript, error };
}
