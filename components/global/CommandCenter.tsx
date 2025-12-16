"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { LearningCommandInput } from "@/components/global/LearningCommandInput";
import { Sparkles } from 'lucide-react';
import { TOPICS } from '@/lib/topics';

export function CommandCenter() {
    const router = useRouter();
    const [inputVal, setInputVal] = useState("");
    const [placeholders, setPlaceholders] = useState(TOPICS.slice(0, 30));

    // Shuffle placeholders only on client side to avoid hydration mismatch
    useEffect(() => {
        setPlaceholders([...TOPICS].sort(() => 0.5 - Math.random()).slice(0, 30));
    }, []);

    const processInput = (input: string) => {
        if (!input) return;

        const lowerInput = input.toLowerCase();
        const encoded = encodeURIComponent(input);

        // Logic check: If input doesn't start with "I want to learn about", we just process the topic.
        // The router logic stays mostly the same, but we might prioritize Tutor since the prefix implies learning.

        if (lowerInput.includes('roast') || lowerInput.includes('code') && (lowerInput.includes('bad') || lowerInput.includes('review'))) {
            // Strip "roast" or similar keywords if possible, or just pass purely
            router.push(`/tools/roast-my-code?q=${encoded}`);
        } else if (lowerInput.includes('quiz') || lowerInput.includes('exam') || lowerInput.includes('test')) {
            router.push(`/tools/exam-simulator?topic=${encoded}`);
        } else if (lowerInput.includes('transform') || lowerInput.includes('convert') || lowerInput.includes('translate')) {
            router.push(`/tools/code-transformer?q=${encoded}`);
        } else {
            // Default to Tutor
            router.push(`/tools/tutor?topic=${encoded}`);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInputVal(e.target.value);
    };

    const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        processInput(inputVal.trim());
    };

    const handleTopicSelect = (topic: string) => {
        setInputVal(topic);
        processInput(topic);
    };

    return (
        <div className="w-full relative z-20 flex flex-col items-center gap-4">
            <LearningCommandInput
                placeholders={placeholders}
                onChange={handleChange}
                onSubmit={onSubmit}
                onTopicSelect={handleTopicSelect}
            />
        </div>
    );
}
