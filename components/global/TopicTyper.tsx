'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';

interface TopicTyperProps {
    topics: string[];
    typingSpeed?: number;
    deletingSpeed?: number;
    pauseDuration?: number;
    className?: string;
}

export function TopicTyper({
    topics,
    typingSpeed = 100,
    deletingSpeed = 50,
    pauseDuration = 2000,
    className
}: TopicTyperProps) {
    const [displayText, setDisplayText] = useState('');
    const [topicIndex, setTopicIndex] = useState(0);
    const [isDeleting, setIsDeleting] = useState(false);
    const router = useRouter();

    // Shuffle topics locally on mount to avoid same sequence
    const [shuffledTopics, setShuffledTopics] = useState<string[]>([]);

    useEffect(() => {
        // Simple Fisher-Yates shuffle or just random sort for this purpose
        const shuffled = [...topics].sort(() => Math.random() - 0.5);
        setShuffledTopics(shuffled);
    }, [topics]);

    useEffect(() => {
        if (shuffledTopics.length === 0) return;

        let timer: NodeJS.Timeout;

        const currentTopic = shuffledTopics[topicIndex] || "";

        if (isDeleting) {
            timer = setTimeout(() => {
                setDisplayText(prev => prev.slice(0, -1));
                if (displayText.length === 0) {
                    setIsDeleting(false);
                    setTopicIndex((prev) => (prev + 1) % shuffledTopics.length);
                }
            }, deletingSpeed);
        } else {
            timer = setTimeout(() => {
                setDisplayText(currentTopic.slice(0, displayText.length + 1));
                if (displayText.length === currentTopic.length) {
                    // Pause before deleting
                    setTimeout(() => setIsDeleting(true), pauseDuration);
                }
            }, typingSpeed);
        }

        return () => clearTimeout(timer);
    }, [displayText, isDeleting, topicIndex, shuffledTopics, typingSpeed, deletingSpeed, pauseDuration]);

    const handleClick = () => {
        const targetTopic = shuffledTopics[topicIndex];
        router.push(`/tools/tutor?topic=${encodeURIComponent(targetTopic)}`);
    };

    return (
        <div
            className={`inline-block cursor-pointer hover:text-primary transition-colors ${className}`}
            onClick={handleClick}
            title="Click to learn about this topic!"
        >
            <span>{displayText}</span>
            <span className="inline-block w-[3px] h-[1em] ml-1 bg-primary animate-pulse align-middle" />
        </div>
    );
}
