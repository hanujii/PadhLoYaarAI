'use client';

import { useState, useEffect, useCallback } from 'react';

export function useTextToSpeech() {
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
    const [selectedVoice, setSelectedVoice] = useState<SpeechSynthesisVoice | null>(null);

    useEffect(() => {
        if (typeof window !== 'undefined' && window.speechSynthesis) {
            const loadVoices = () => {
                const availableVoices = window.speechSynthesis.getVoices();
                setVoices(availableVoices);
                // Prefer a decent English voice (Google US English or similar)
                const preferredVoice = availableVoices.find(v => v.name.includes('Google US English')) ||
                    availableVoices.find(v => v.lang === 'en-US') ||
                    availableVoices[0];
                setSelectedVoice(preferredVoice || null);
            };

            loadVoices();
            if (window.speechSynthesis.onvoiceschanged !== undefined) {
                window.speechSynthesis.onvoiceschanged = loadVoices;
            }
        }
    }, []);

    const speak = useCallback((text: string) => {
        if (typeof window !== 'undefined' && window.speechSynthesis) {
            // Cancel any ongoing speech
            window.speechSynthesis.cancel();

            const utterance = new SpeechSynthesisUtterance(text);
            if (selectedVoice) {
                utterance.voice = selectedVoice;
            }
            utterance.rate = 1.0;
            utterance.pitch = 1.0;

            utterance.onstart = () => setIsSpeaking(true);
            utterance.onend = () => setIsSpeaking(false);
            utterance.onerror = () => setIsSpeaking(false);

            window.speechSynthesis.speak(utterance);
        }
    }, [selectedVoice]);

    const stop = useCallback(() => {
        if (typeof window !== 'undefined' && window.speechSynthesis) {
            window.speechSynthesis.cancel();
            setIsSpeaking(false);
        }
    }, []);

    return { speak, stop, isSpeaking, voices, setSelectedVoice };
}
