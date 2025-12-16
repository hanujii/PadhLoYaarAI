import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { LearningCommandInput } from "@/components/global/LearningCommandInput";
import { Sparkles, Command, Check } from 'lucide-react';
import { TOPICS } from '@/lib/topics';
import { cn } from '@/lib/utils';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { LearningCommandInput } from "@/components/global/LearningCommandInput";
import { Sparkles, Command, Check } from 'lucide-react';
import { TOPICS } from '@/lib/topics';
import {
    CommandDialog,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command";

interface CommandCenterProps {
    onChatStart?: (topic: string) => void;
}

export function CommandCenter({ onChatStart }: CommandCenterProps) {
    const router = useRouter();
    const [inputVal, setInputVal] = useState("");
    const [placeholders, setPlaceholders] = useState(TOPICS.slice(0, 30));
    const [isCommandOpen, setIsCommandOpen] = useState(false);
    const [selectedTool, setSelectedTool] = useState<string | null>(null);

    // Tools list for @ selection
    const tools = [
        { label: 'Tutor', value: 'tutor', path: '/tools/tutor' },
        { label: 'Code Transformer', value: 'code-transformer', path: '/tools/code-transformer' },
        { label: 'Roast My Code', value: 'roast-my-code', path: '/tools/roast-my-code' },
        { label: 'Exam Simulator', value: 'exam-simulator', path: '/tools/exam-simulator' },
        { label: 'Question Solver', value: 'question-solver', path: '/tools/question-solver' },
        // Add others
    ];

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
            const tool = tools.find(t => t.value === selectedTool);
            if (tool) {
                // For tutor loop, query param is 'topic', for others it might be 'q'
                const param = tool.value === 'tutor' || tool.value === 'exam-simulator' ? 'topic' : 'q';
                router.push(`${tool.path}?${param}=${encoded}`);
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
                onAtClick={() => setIsCommandOpen(true)}
                selectedTool={selectedTool}
                onClearTool={() => setSelectedTool(null)}
            />

            <CommandDialog open={isCommandOpen} onOpenChange={setIsCommandOpen}>
                <CommandInput placeholder="Select a tool..." />
                <CommandList>
                    <CommandEmpty>No tool found.</CommandEmpty>
                    <CommandGroup heading="Tools">
                        {tools.map((tool) => (
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
                                {tool.label}
                            </CommandItem>
                        ))}
                    </CommandGroup>
                </CommandList>
            </CommandDialog>
        </div>
    );
}
