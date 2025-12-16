"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

export function LearningCommandInput({
    placeholders,
    onChange,
    onSubmit,
    onTopicSelect,
}: {
    placeholders: string[];
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
    onTopicSelect?: (topic: string) => void;
}) {
    const [currentPlaceholder, setCurrentPlaceholder] = useState(0);
    const [inputValue, setInputValue] = useState("");
    const inputRef = useRef<HTMLInputElement>(null);

    // Cycle through placeholders
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentPlaceholder((prev) => (prev + 1) % placeholders.length);
        }, 3000);
        return () => clearInterval(interval);
    }, [placeholders]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInputValue(e.target.value);
        onChange(e);
    };

    const handlePlaceholderClick = () => {
        const topic = placeholders[currentPlaceholder];
        setInputValue(topic);

        // If onTopicSelect is provided, trigger it immediately (essentially an auto-submit)
        if (onTopicSelect) {
            onTopicSelect(topic);
        } else {
            // Fallback to minimal update if no auto-submit handler
            if (inputRef.current) {
                inputRef.current.value = topic;
                const syntheticEvent = {
                    target: inputRef.current,
                } as React.ChangeEvent<HTMLInputElement>;
                onChange(syntheticEvent);
                inputRef.current.focus();
            }
        }
    };

    // Focus input on container click
    const handleContainerClick = () => {
        inputRef.current?.focus();
    }

    return (
        <form
            className="w-full relative max-w-2xl mx-auto bg-white/10 dark:bg-black/20 backdrop-blur-md h-16 rounded-full overflow-hidden shadow-2xl border border-white/20 transition duration-200 flex items-center"
            onSubmit={onSubmit}
            onClick={handleContainerClick}
        >
            {/* Prefix */}
            <div className="pl-6 pr-2 whitespace-nowrap text-muted-foreground font-medium select-none text-lg">
                I want to learn about
            </div>

            <div className="relative flex-1 h-full flex items-center">
                <input
                    ref={inputRef}
                    onChange={handleInputChange}
                    value={inputValue}
                    className="w-full relative z-10 bg-transparent text-foreground h-full rounded-r-full focus:outline-none focus:ring-0 text-lg font-bold placeholder:text-transparent"
                    spellCheck={false}
                />

                {/* Animated Placeholder (Visible when input is empty) */}
                <div className={cn(
                    "absolute inset-0 flex items-center z-20 pointer-events-none",
                    { "pointer-events-auto": !inputValue } // Enable clicks only when visible
                )}>
                    <AnimatePresence mode="wait">
                        {!inputValue && (
                            <motion.p
                                initial={{
                                    y: 5,
                                    opacity: 0,
                                }}
                                key={`current-placeholder-${currentPlaceholder}`}
                                animate={{
                                    y: 0,
                                    opacity: 1,
                                }}
                                exit={{
                                    y: -15,
                                    opacity: 0,
                                }}
                                transition={{
                                    duration: 0.3,
                                    ease: "linear",
                                }}
                                className="text-lg font-bold text-muted-foreground/50 text-left truncate cursor-pointer hover:text-primary transition-colors pointer-events-auto"
                                onClick={(e) => {
                                    e.stopPropagation(); // Prevent container click
                                    e.preventDefault(); // Prevent default
                                    handlePlaceholderClick();
                                }}
                            >
                                {placeholders[currentPlaceholder]}
                            </motion.p>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            <button
                disabled={!inputValue}
                type="submit"
                className="absolute right-2 top-1/2 z-50 -translate-y-1/2 h-10 w-10 rounded-full bg-primary disabled:bg-muted disabled:text-muted-foreground text-primary-foreground transition duration-200 flex items-center justify-center hover:scale-105 active:scale-95"
            >
                <motion.svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-5 w-5"
                >
                    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                    <motion.path
                        d="M5 12l14 0"
                        initial={{
                            strokeDasharray: "50%",
                            strokeDashoffset: "50%",
                        }}
                        animate={{
                            strokeDashoffset: 0,
                        }}
                    />
                    <path d="M13 18l6 -6" />
                    <path d="M13 6l6 6" />
                </motion.svg>
            </button>
        </form>
    );
}
