'use client';

import { useChat } from '@ai-sdk/react';
import { ToolBackButton } from '@/components/global/ToolBackButton';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2, Send, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';

interface UniversalChatProps {
    tool: {
        title: string;
        description: string;
        icon: any;
        color: string;
    }
}

export function UniversalChat({ tool }: UniversalChatProps) {
    const { messages, append, isLoading } = useChat({
        api: '/api/universal-chat',
        body: {
            systemPrompt: `You are ${tool.title}. ${tool.description}. Provide helpful, concise, and expert assistance to the student.`
        }
    });

    const [input, setInput] = useState('');
    const scrollRef = useRef<HTMLDivElement>(null);

    const handleSend = async (e?: React.FormEvent) => {
        e?.preventDefault();
        if (!input.trim() || isLoading) return;

        const userMessage = input;
        setInput('');

        try {
            await append({
                role: 'user',
                content: userMessage
            });
        } catch (error) {
            console.error(error);
            toast.error("Failed to send message");
        }
    };

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    return (
        <div className="max-w-4xl mx-auto px-4 h-[calc(100vh-6rem)] flex flex-col">
            {/* Header */}
            <div className="flex items-center gap-4 py-6 border-b border-white/10">
                <ToolBackButton />
                <div className="flex items-center gap-3">
                    <div className={cn("p-2 rounded-lg", tool.color.split(' ')[0])}>
                        <tool.icon className="w-6 h-6" />
                    </div>
                    <div>
                        <h1 className="text-xl font-bold">{tool.title}</h1>
                        <p className="text-sm text-muted-foreground">{tool.description}</p>
                    </div>
                </div>
            </div>

            {/* Chat Area */}
            <div className="flex-1 overflow-y-auto py-6 space-y-4 custom-scrollbar" ref={scrollRef}>
                {messages.length === 0 && (
                    <div className="h-full flex flex-col items-center justify-center text-center opacity-50 space-y-4">
                        <Sparkles className="w-12 h-12 text-primary" />
                        <p>How can I help you with {tool.title} today?</p>
                    </div>
                )}

                {messages.map((m) => (
                    <div key={m.id} className={cn("flex w-full", m.role === 'user' ? "justify-end" : "justify-start")}>
                        <div className={cn(
                            "max-w-[80%] rounded-2xl px-4 py-3 text-sm",
                            m.role === 'user'
                                ? "bg-primary text-primary-foreground"
                                : "bg-zinc-800 text-zinc-100 border border-white/5"
                        )}>
                            {m.content}
                        </div>
                    </div>
                ))}
                {isLoading && (
                    <div className="flex justify-start">
                        <div className="bg-zinc-800 rounded-2xl px-4 py-3 flex items-center gap-2">
                            <Loader2 className="w-4 h-4 animate-spin text-zinc-400" />
                            <span className="text-xs text-zinc-500">Thinking...</span>
                        </div>
                    </div>
                )}
            </div>

            {/* Input */}
            <form onSubmit={handleSend} className="py-4">
                <div className="relative">
                    <Input
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder={`Ask ${tool.title}...`}
                        className="pr-12 bg-zinc-900 border-white/10 h-14 rounded-full shadow-lg"
                    />
                    <Button type="submit" size="icon" disabled={isLoading || !input.trim()} className="absolute right-2 top-2 rounded-full w-10 h-10">
                        <Send className="w-4 h-4" />
                    </Button>
                </div>
            </form>
        </div>
    );
}
