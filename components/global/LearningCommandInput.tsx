"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { AtSign, Paperclip, X } from "lucide-react";
import { Button } from "@/components/ui/button";

export function LearningCommandInput({
    placeholders,
    onChange,
    onSubmit,
    onTopicSelect,
    onAtClick,
    selectedTool,
    onClearTool
}: {
    placeholders: string[];
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
    onTopicSelect?: (topic: string) => void;
    onAtClick?: () => void;
    selectedTool?: string | null;
    onClearTool?: () => void;
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

        if (onTopicSelect) {
            onTopicSelect(topic);
        } else {
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

    const handleContainerClick = () => {
        inputRef.current?.focus();
    }

    return (
        <form
            className="w-full relative max-w-2xl mx-auto bg-background/80 dark:bg-black/40 backdrop-blur-xl h-14 sm:h-16 rounded-full overflow-hidden shadow-2xl border border-white/20 dark:border-white/10 transition-all duration-300 focus-within:ring-2 focus-within:ring-primary/50 flex items-center pr-2"
            onSubmit={onSubmit}
            onClick={handleContainerClick}
        >
            {/* Buttons Left */}
            <div className="flex items-center gap-1 pl-2 sm:pl-3">
                <Button
                    type="button"
                    size="icon"
                    variant="ghost"
                    className="h-8 w-8 sm:h-9 sm:w-9 rounded-full text-muted-foreground hover:text-primary hover:bg-primary/10"
                    onClick={(e) => { e.stopPropagation(); onAtClick?.(); }}
                >
                    <AtSign className="h-4 w-4 sm:h-5 sm:w-5" />
                </Button>
                <Button
                    type="button"
                    size="icon"
                    variant="ghost"
                    className="h-8 w-8 sm:h-9 sm:w-9 rounded-full text-muted-foreground hover:text-primary hover:bg-primary/10"
                    onClick={(e) => { e.stopPropagation(); /* TODO: Attach */ }}
                >
                    <Paperclip className="h-4 w-4 sm:h-5 sm:w-5" />
                </Button>
            </div>

            {/* Separator */}
            <div className="w-px h-6 bg-border mx-2" />

            {/* Prefix / Selected Tool */}
            {selectedTool ? (
                <div className="flex items-center gap-1 bg-primary/10 text-primary px-2 py-1 rounded-full text-xs sm:text-sm font-medium whitespace-nowrap mr-2">
                    @{selectedTool}
                    <button type="button" onClick={(e) => { e.stopPropagation(); onClearTool?.(); }} className="hover:text-red-500">
                        <X className="h-3 w-3" />
                    </button>
                </div>
            ) : (
                <div className="hidden sm:block whitespace-nowrap text-muted-foreground font-medium select-none text-base sm:text-lg mr-2">
                    I want to learn about
                </div>
            )}

            <div className="relative flex-1 h-full flex items-center min-w-0">
                <input
                    ref={inputRef}
                    onChange={handleInputChange}
                    value={inputValue}
                    className="w-full relative z-10 bg-transparent text-foreground h-full rounded-none focus:outline-none focus:ring-0 text-base sm:text-lg font-medium placeholder:text-transparent"
                    spellCheck={false}
                    autoComplete="off"
                />

                {/* Animated Placeholder */}
                <div className={cn(
                    "absolute inset-0 flex items-center z-20 pointer-events-none overflow-hidden",
                    { "pointer-events-auto": !inputValue }
                )}>
                    <AnimatePresence mode="wait">
                        {!inputValue && (
                            <motion.p
                                initial={{ y: 5, opacity: 0 }}
                                key={`current-placeholder-${currentPlaceholder}`}
                                animate={{ y: 0, opacity: 1 }}
                                exit={{ y: -15, opacity: 0 }}
                                transition={{ duration: 0.3, ease: "linear" }}
                                className="text-base sm:text-lg font-medium text-muted-foreground/50 text-left truncate cursor-pointer hover:text-primary transition-colors pointer-events-auto w-full"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    e.preventDefault();
                                    handlePlaceholderClick();
                                }}
                            >
                                {placeholders[currentPlaceholder]}
                            </motion.p>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            {/* Submit Button */}
            <button
                disabled={!inputValue}
                type="submit"
                className="ml-2 h-9 w-9 sm:h-10 sm:w-10 rounded-full bg-primary disabled:bg-muted disabled:text-muted-foreground text-primary-foreground transition duration-200 flex items-center justify-center hover:scale-105 active:scale-95 shrink-0"
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
                    className="h-4 w-4 sm:h-5 sm:w-5"
                >
                    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                    <motion.path
                        d="M5 12l14 0"
                        initial={{ strokeDasharray: "50%", strokeDashoffset: "50%" }}
                        animate={{ strokeDashoffset: 0 }}
                    />
                    <path d="M13 18l6 -6" />
                    <path d="M13 6l6 6" />
                </motion.svg>
            </button>
        </form>
    );
}
