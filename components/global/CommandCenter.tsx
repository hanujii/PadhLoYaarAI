"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { LearningCommandInput } from "@/components/global/LearningCommandInput";
import { Sparkles, Command, Check } from 'lucide-react';
import { useGamificationStore } from '@/lib/gamification-store';
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
    const { addXp } = useGamificationStore();
    const router = useRouter();
    const [inputVal, setInputVal] = useState("");
    const [placeholders, setPlaceholders] = useState(TOPICS.slice(0, 30));
    const [isCommandOpen, setIsCommandOpen] = useState(false);
    const [selectedTool, setSelectedTool] = useState<string | null>(null);

    useEffect(() => {
        setPlaceholders([...TOPICS].sort(() => 0.5 - Math.random()).slice(0, 30));
    }, []);

    // Detect @ typing
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
            // Redirect to specific tool
            const tool = TOOLS.find(t => t.value === selectedTool);
            if (tool) {
                const param = tool.queryParam || 'q';
                router.push(`${tool.href}?${param}=${encoded}`);
            }
        } else {
            // INLINE CHAT (Default)
            if (onChatStart) {
                onChatStart(input);
            } else {
                // Fallback if no handler provided (legacy behavior)
                router.push(`/tools/tutor?topic=${encoded}`);
            }
        }
    };

    const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const query = inputVal.trim();
        if (query) {
            addXp(10); // Reward for starting a study session
            processInput(query);
            setInputVal(''); // Clear input after submission
        }
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
                onAtClick={() => setIsCommandOpen(true)}
                selectedTool={selectedTool}
                onClearTool={() => setSelectedTool(null)}
            />

            <CommandDialog open={isCommandOpen} onOpenChange={setIsCommandOpen}>
                <CommandInput placeholder="Select a tool..." />
                <CommandList>
                    <CommandEmpty>No tool found.</CommandEmpty>
                    <CommandGroup heading="Tools">
                        {TOOLS.map((tool) => (
                            <CommandItem
                                key={tool.value}
                                onSelect={() => {
                                    setSelectedTool(tool.value);
                                    setIsCommandOpen(false);
                                    // Remove the '@' if it was typed at the end
                                    if (inputVal.endsWith('@')) {
                                        setInputVal(inputVal.slice(0, -1));
                                    }
                                }}
                            >
                                <Check className={cn("mr-2 h-4 w-4", selectedTool === tool.value ? "opacity-100" : "opacity-0")} />
                                {tool.title}
                            </CommandItem>
                        ))}
                    </CommandGroup>
                </CommandList>
            </CommandDialog>
        </div>
    );
}
