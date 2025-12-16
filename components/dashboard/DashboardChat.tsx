'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { GlassCard } from '@/components/ui/glass-card';
import { getTutorResponse } from '@/app/tools/tutor/actions';
import { Loader2, Bookmark, Check, Brain, RefreshCcw } from 'lucide-react';
import { useHistoryStore } from '@/lib/history-store';
import { DownloadPDFButton } from '@/components/global/DownloadPDFButton';
import { motion } from 'framer-motion';
import { Typewriter } from '@/components/global/Typewriter';

interface DashboardChatProps {
    initialTopic: string;
    onReset: () => void;
}

export function DashboardChat({ initialTopic, onReset }: DashboardChatProps) {
    const [loading, setLoading] = useState(false);
    const [response, setResponse] = useState<string | null>(null);
    const { addToHistory, saveItem } = useHistoryStore();
    const [isSaved, setIsSaved] = useState(false);
    const outputRef = useRef<HTMLDivElement>(null);
    const hasFetched = useRef(false);

    // Initial fetch
    useEffect(() => {
        if (initialTopic && !hasFetched.current) {
            hasFetched.current = true;
            generateAnswer(initialTopic, 'concise', '');
        }
    }, [initialTopic]);

    // Unified generation function
    const generateAnswer = async (topicToSearch: string, modeToUse: string, instructionsToUse: string) => {
        setLoading(true);
        setResponse(null);

        const formData = new FormData();
        formData.append('topic', topicToSearch);
        formData.append('mode', modeToUse);
        formData.append('instructions', instructionsToUse);

        const result = await getTutorResponse(formData);

        if (result.success && result.data) {
            setResponse(result.data);

            // Auto-add to history
            addToHistory({
                tool: 'tutor-dashboard',
                query: topicToSearch,
                result: result.data
            });
        } else {
            setResponse('Error: ' + (result.error || 'Something went wrong'));
        }
        setLoading(false);
    };

    const handleSave = () => {
        if (!response) return;
        saveItem({
            type: 'result',
            title: `Quick Chat: ${initialTopic}`,
            content: response
        });
        setIsSaved(true);
    };

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-4xl mx-auto space-y-6"
        >
            <div className="flex justify-between items-center px-4">
                <Button variant="ghost" onClick={onReset} className="text-muted-foreground hover:text-foreground">
                    <RefreshCcw className="mr-2 h-4 w-4" /> New Topic
                </Button>
                <div className="text-sm font-medium text-muted-foreground bg-primary/10 px-3 py-1 rounded-full">
                    Topic: {initialTopic}
                </div>
            </div>

            {loading ? (
                <GlassCard className="h-[400px] flex flex-col items-center justify-center space-y-4">
                    <Loader2 className="w-12 h-12 animate-spin text-primary" />
                    <p className="text-muted-foreground animate-pulse">Thinking about "{initialTopic}"...</p>
                </GlassCard>
            ) : (
                response && (
                    <GlassCard className="min-h-[400px] flex flex-col border-primary/20" enableTilt={false}>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 border-b border-white/5">
                            <CardTitle className="text-primary flex items-center gap-2">
                                <Brain className="w-5 h-5" /> AI Response
                            </CardTitle>
                            <div className="flex gap-2">
                                {!response.startsWith('Error:') && (
                                    <>
                                        <DownloadPDFButton targetRef={outputRef} filename={`tutor-${initialTopic}.pdf`} />
                                        <Button variant="ghost" size="sm" onClick={handleSave} disabled={isSaved} className="hover:bg-primary/20">
                                            {isSaved ? <Check className="w-4 h-4 mr-2" /> : <Bookmark className="w-4 h-4 mr-2" />}
                                            {isSaved ? 'Saved' : 'Save'}
                                        </Button>
                                    </>
                                )}
                            </div>
                        </CardHeader>
                        <CardContent className="flex-1 overflow-y-auto max-h-[600px] p-4 custom-scrollbar">
                            <div ref={outputRef} className="prose dark:prose-invert max-w-none prose-headings:text-primary prose-a:text-blue-400">
                                <Typewriter content={response} speed={3} />
                            </div>
                        </CardContent>
                    </GlassCard>
                )
            )}
        </motion.div>
    );
}
