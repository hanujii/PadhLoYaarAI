'use client';

import React, { useEffect, useState } from 'react';
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Cpu, Loader2 } from 'lucide-react';
import { ModelDTO } from '@/lib/ai/types';
import { getAvailableModels } from '@/app/actions/ai-config';

// We now pass the specific model ID, or 'auto'
export type AISelection = 'auto' | string;

interface AIModelSelectorProps {
    value?: AISelection;
    onValueChange: (value: AISelection) => void;
    className?: string;
}

export function AIModelSelector({ value = 'auto', onValueChange, className }: AIModelSelectorProps) {
    const [models, setModels] = useState<ModelDTO[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let isCancelled = false;
        
        getAvailableModels()
            .then((models) => {
                if (!isCancelled) {
                    setModels(models);
                }
            })
            .catch((error) => {
                if (!isCancelled) {
                    if (process.env.NODE_ENV === 'development') {
                        console.error('Failed to load AI models:', error);
                    }
                    // Set empty array on error to show "Auto" option only
                    setModels([]);
                }
            })
            .finally(() => {
                if (!isCancelled) {
                    setLoading(false);
                }
            });
        
        return () => {
            isCancelled = true;
        };
    }, []);

    // Group models by provider
    const groupedModels = models.reduce((acc, model) => {
        if (!acc[model.provider]) acc[model.provider] = [];
        acc[model.provider].push(model);
        return acc;
    }, {} as Record<string, ModelDTO[]>);

    return (
        <div className={className}>
            <Select value={value} onValueChange={onValueChange}>
                <SelectTrigger className="w-[200px] bg-background/50 border-white/10 h-9 text-xs">
                    <div className="flex items-center gap-2">
                        <Cpu className="w-3.5 h-3.5 text-muted-foreground" />
                        <SelectValue placeholder="Select Model" />
                    </div>
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="auto">
                        <span className="font-bold">Auto (Best Available)</span>
                    </SelectItem>

                    {loading ? (
                        <div className="p-2 text-center text-xs text-muted-foreground flex items-center justify-center gap-2">
                            <Loader2 className="w-3 h-3 animate-spin" /> Loading models...
                        </div>
                    ) : (
                        Object.entries(groupedModels).map(([provider, providerModels]) => (
                            <SelectGroup key={provider}>
                                <SelectLabel className="capitalize text-xs text-muted-foreground">{provider}</SelectLabel>
                                {providerModels.map(model => (
                                    <SelectItem key={model.id} value={model.id}>
                                        <div className="flex items-center justify-between w-full gap-2">
                                            <span>{model.name}</span>
                                            {model.isPro && <span className="text-[10px] bg-amber-500/10 text-amber-500 px-1 rounded">PRO</span>}
                                        </div>
                                    </SelectItem>
                                ))}
                            </SelectGroup>
                        ))
                    )}
                </SelectContent>
            </Select>
        </div>
    );
}
