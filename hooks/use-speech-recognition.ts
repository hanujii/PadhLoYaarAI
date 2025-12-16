'use client';

import { useState, useEffect, useCallback } from 'react';

// Define the interface for the Web Speech API
interface IWindow extends Window {
    webkitSpeechRecognition: any;
    SpeechRecognition: any;
}

export function useSpeechRecognition() {
    const [isListening, setIsListening] = useState(false);
    const [transcript, setTranscript] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [recognition, setRecognition] = useState<any>(null);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const { webkitSpeechRecognition, SpeechRecognition } = window as unknown as IWindow;
            const SpeechRecognitionConstructor = SpeechRecognition || webkitSpeechRecognition;

            if (SpeechRecognitionConstructor) {
                const recognitionInstance = new SpeechRecognitionConstructor();
                recognitionInstance.continuous = false; // Stop after one sentence/pause
                recognitionInstance.interimResults = true;
                recognitionInstance.lang = 'en-US';

                recognitionInstance.onstart = () => {
                    setIsListening(true);
                    setError(null);
                };

                recognitionInstance.onend = () => {
                    setIsListening(false);
                };

                recognitionInstance.onresult = (event: any) => {
                    let finalTranscript = '';
                    for (let i = event.resultIndex; i < event.results.length; ++i) {
                        if (event.results[i].isFinal) {
                            finalTranscript += event.results[i][0].transcript;
                        } else {
                            // Interim results if needed
                        }
                    }
                    if (finalTranscript) {
                        setTranscript(finalTranscript);
                    }
                };

                recognitionInstance.onerror = (event: any) => {
                    setError(event.error);
                    setIsListening(false);
                };

                setRecognition(recognitionInstance);
            } else {
                setError('Speech recognition not supported in this browser.');
            }
        }
    }, []);

    const startListening = useCallback(() => {
        if (recognition) {
            try {
                recognition.start();
            } catch (e) {
                // Usually means already started
            }
        }
    }, [recognition]);

    const stopListening = useCallback(() => {
        if (recognition) {
            recognition.stop();
        }
    }, [recognition]);

    const resetTranscript = useCallback(() => {
        setTranscript('');
    }, []);

    return { isListening, transcript, startListening, stopListening, resetTranscript, error };
}
