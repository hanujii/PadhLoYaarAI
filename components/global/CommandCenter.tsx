"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { LearningCommandInput } from "@/components/global/LearningCommandInput";
import { Check, Command, Sparkles, Search } from 'lucide-react';
import { TOPICS } from '@/lib/topics';
import { cn } from '@/lib/utils';
import { TOOLS } from '@/lib/tools-data';
import {
    CommandDialog,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command";

export function CommandCenter({ onChatStart }: { onChatStart: (topic: string) => void }) {
    const router = useRouter();
    const [inputVal, setInputVal] = useState("");
    const [placeholders, setPlaceholders] = useState(TOPICS.slice(0, 30));
    const [isCommandOpen, setIsCommandOpen] = useState(false);
    const [selectedTool, setSelectedTool] = useState<string | null>(null);

    useEffect(() => {
        setPlaceholders([...TOPICS].sort(() => 0.5 - Math.random()).slice(0, 30));
    }, []);

    // Detect keypress for Command+K
    useEffect(() => {
        const down = (e: KeyboardEvent) => {
            if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                setIsCommandOpen((open) => !open);
            }
        };
        document.addEventListener("keydown", down);
        return () => document.removeEventListener("keydown", down);
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        setInputVal(val);
        if (val.endsWith('@')) {
            setIsCommandOpen(true);
        }
    };

    const processInput = (input: string) => {
        if (!input) return;
        const encoded = encodeURIComponent(input);

        if (selectedTool) {
            const tool = TOOLS.find(t => t.value === selectedTool);
            if (tool) {
                const param = tool.queryParam || 'q';
                router.push(`${tool.href}?${param}=${encoded}`);
            }
        } else {
            if (onChatStart) {
                onChatStart(input);
            } else {
                router.push(`/tools/tutor?topic=${encoded}`);
            }
        }
    };

    const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const query = inputVal.trim();
        if (query) {
            processInput(query);
            setInputVal('');
        }
    };

    const handleTopicSelect = (topic: string) => {
        setInputVal(topic);
        processInput(topic);
    };

    return (
        <div className="w-full relative z-20 flex flex-col items-center gap-4 group/cmd">

            {/* Enhanced Glow Effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-primary/30 via-purple-500/30 to-blue-500/30 blur-[60px] opacity-40 transition-all duration-700 group-hover/cmd:opacity-70 group-hover/cmd:blur-[80px] -z-10 rounded-full" />

            <div className="relative w-full transition-all duration-300 group-hover/cmd:scale-[1.01] hover:shadow-[0_0_40px_rgba(139,92,246,0.3)] rounded-full">
                <LearningCommandInput
                    placeholders={placeholders}
                    onChange={handleChange}
                    onSubmit={onSubmit}
                    onTopicSelect={handleTopicSelect}
                    onAtClick={() => setIsCommandOpen(true)}
                    selectedTool={selectedTool}
                    onClearTool={() => setSelectedTool(null)}
                />
            </div>

            <CommandDialog open={isCommandOpen} onOpenChange={setIsCommandOpen}>
                <CommandInput placeholder="Search tools..." />
                <CommandList className="bg-card/95 backdrop-blur-xl border border-border">
                    <CommandEmpty>No tool found.</CommandEmpty>
                    <CommandGroup heading="Available Tools">
                        {TOOLS.map((tool) => (
                            <CommandItem
                                key={tool.value}
                                className="aria-selected:bg-primary/20 aria-selected:text-primary"
                                onSelect={() => {
                                    setSelectedTool(tool.value);
                                    setIsCommandOpen(false);
                                    if (inputVal.endsWith('@')) {
                                        setInputVal(inputVal.slice(0, -1));
                                    }
                                }}
                            >
                                <div className={cn("mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary/50", selectedTool === tool.value ? "opacity-100 bg-primary text-primary-foreground" : "opacity-0")}>
                                    <Check className="h-3 w-3" />
                                </div>
                                <tool.icon className="mr-2 h-4 w-4" />
                                <span>{tool.title}</span>
                            </CommandItem>
                        ))}
                    </CommandGroup>
                </CommandList>
            </CommandDialog>
        </div>
    );
}
