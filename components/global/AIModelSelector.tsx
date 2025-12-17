'use client';

import React from 'react';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Cpu } from 'lucide-react';

export type AIProviderId = 'auto' | 'google' | 'openrouter' | 'github' | 'groq';

interface AIModelSelectorProps {
    value?: AIProviderId;
    onValueChange: (value: AIProviderId) => void;
    className?: string;
}

export function AIModelSelector({ value = 'auto', onValueChange, className }: AIModelSelectorProps) {
    return (
        <div className={className}>
            <Select value={value} onValueChange={(v) => onValueChange(v as AIProviderId)}>
                <SelectTrigger className="w-[180px] bg-background/50 border-white/10 h-9 text-xs">
                    <div className="flex items-center gap-2">
                        <Cpu className="w-3.5 h-3.5 text-muted-foreground" />
                        <SelectValue placeholder="AI Model" />
                    </div>
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="auto">Auto (Best Available)</SelectItem>
                    <SelectItem value="google">Google Gemini</SelectItem>
                    <SelectItem value="openrouter">OpenRouter (GPT-4o/Llama)</SelectItem>
                    <SelectItem value="github">Github Models</SelectItem>
                    <SelectItem value="groq">Groq (Fastest)</SelectItem>
                </SelectContent>
            </Select>
        </div>
    );
}
