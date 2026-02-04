"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";

export function PlaceholdersAndVanishInput({
    placeholders,
    onChange,
    onSubmit,
}: {
    placeholders: string[];
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
}) {
    const [currentPlaceholder, setCurrentPlaceholder] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentPlaceholder((prev) => (prev + 1) % placeholders.length);
        }, 3000);
        return () => clearInterval(interval);
    }, [placeholders]);

    return (
        <form
            className="w-full relative max-w-xl mx-auto bg-white dark:bg-zinc-800 h-12 rounded-full overflow-hidden shadow-[0px_2px_3px_-1px_rgba(0,0,0,0.1),0px_1px_0px_0px_rgba(25,28,33,0.02),0px_0px_0px_1px_rgba(25,28,33,0.08)] transition duration-200"
            onSubmit={onSubmit}
        >
            <input
                onChange={onChange}
                className="w-full relative z-50 border-none dark:text-white bg-transparent text-black h-full rounded-full focus:outline-none focus:ring-0 pl-4 sm:pl-10 pr-20"
            />

            <div className="absolute inset-0 flex items-center rounded-full pointer-events-none">
                <AnimatePresence mode="wait">
                    {!false && (
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
                            className="dark:text-zinc-500 text-sm sm:text-base font-normal text-neutral-500 pl-4 sm:pl-10 text-left w-[calc(100%-2rem)] truncate"
                        >
                            {placeholders[currentPlaceholder]}
                        </motion.p>
                    )}
                </AnimatePresence>
            </div>

            <button
                disabled={false}
                type="submit"
                className="absolute right-2 top-1/2 z-50 -translate-y-1/2 h-8 w-8 rounded-full bg-black dark:bg-zinc-900 disabled:bg-gray-100 transition duration-200 flex items-center justify-center"
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
                    className="text-gray-300 h-4 w-4"
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
