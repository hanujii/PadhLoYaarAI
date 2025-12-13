'use client';

import { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface TypewriterProps {
    content: string;
    speed?: number;
    onComplete?: () => void;
    className?: string;
}

export function Typewriter({ content, speed = 10, onComplete, className }: TypewriterProps) {
    const [displayedContent, setDisplayedContent] = useState('');
    const [isComplete, setIsComplete] = useState(false);

    useEffect(() => {
        setDisplayedContent('');
        setIsComplete(false);
        let index = 0;

        // If content is very short or empty, just show it
        if (!content) {
            setDisplayedContent('');
            return;
        }

        const intervalId = setInterval(() => {
            index++;
            if (index > content.length) {
                clearInterval(intervalId);
                setIsComplete(true);
                if (onComplete) onComplete();
                return;
            }
            // Optimization: Type faster for longer content to avoid waiting too long
            const jump = content.length > 500 ? 5 : 1;
            index = Math.min(index + jump - 1, content.length);

            setDisplayedContent(content.slice(0, index));
        }, speed);

        return () => clearInterval(intervalId);
    }, [content, speed, onComplete]);

    return (
        <div className={className}>
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {displayedContent}
            </ReactMarkdown>
            {!isComplete && (
                <span className="inline-block w-2 h-4 ml-1 bg-primary/50 animate-pulse align-middle" />
            )}
        </div>
    );
}
