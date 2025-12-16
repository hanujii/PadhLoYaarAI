'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { GlassCard } from '@/components/ui/glass-card';
import { getTutorResponse } from './actions';
import ReactMarkdown from 'react-markdown';
import { Loader2, Bookmark, Check, Brain } from 'lucide-react';
import { useHistoryStore } from '@/lib/history-store';
import { DownloadPDFButton } from '@/components/global/DownloadPDFButton';
import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Typewriter } from '@/components/global/Typewriter';
import { CheckUnderstandingSection } from './CheckUnderstanding';

import { Suspense } from 'react';

function TutorContent() {
    const [topicInput, setTopicInput] = useState(initialTopic);

    // ... (keep outputRef and other states)

    // Reset saved state when response changes
    const [lastResponse, setLastResponse] = useState<string | null>(null);
    if (response !== lastResponse) {
        setIsSaved(false);
        setLastResponse(response);
    }

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
                type: 'generation',
                tool: 'Tutor',
                query: topicToSearch,
                result: result.data
            });
        } else {
            setResponse('Error: ' + (result.error || 'Something went wrong'));
        }
        setLoading(false);
    };

    // Auto-start if topic is present in URL
    const hasStarted = useRef(false);
    useEffect(() => {
        if (initialTopic && !hasStarted.current) {
            hasStarted.current = true;
            generateAnswer(initialTopic, 'concise', '');
        }
    }, [initialTopic]);

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        const topic = formData.get('topic') as string;
        const mode = formData.get('mode') as string;
        const instructions = formData.get('instructions') as string;

        await generateAnswer(topic, mode, instructions);
    }

    const handleSave = () => {
        if (!response) return;
        // Use state instead of direct DOM access
        const title = topicInput || 'Tutor Result';
        saveItem({
            type: 'result',
            title: `Tutor: ${title}`,
            content: response
        });
        setIsSaved(true);
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-2 text-center"
            >
                <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl text-primary">AI Tutor</h1>
                <p className="text-lg text-muted-foreground">Get personalized, step-by-step explanations for any topic.</p>
            </motion.div>

            <div className="grid gap-8 md:grid-cols-2">
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 }}
                >
                    <GlassCard className="h-full" enableTilt={true}>
                        <CardHeader>
                            <CardTitle>Configuration</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="topic">Topic</Label>
                                    <Input
                                        id="topic"
                                        name="topic"
                                        value={topicInput}
                                        onChange={(e) => setTopicInput(e.target.value)}
                                        placeholder="e.g. Quantum Entanglement"
                                        required
                                        className="bg-background/50 border-white/10"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="mode">Learning Mode</Label>
                                    <Select name="mode" defaultValue="concise">
                                        <SelectTrigger className="bg-background/50 border-white/10">
                                            <SelectValue placeholder="Select mode" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="concise">Concise & Clear</SelectItem>
                                            <SelectItem value="detailed">Detailed Deep Dive</SelectItem>
                                            <SelectItem value="eli5">Explain Like I&apos;m 5</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="instructions">Custom Instructions</Label>
                                    <Textarea
                                        id="instructions"
                                        name="instructions"
                                        placeholder="e.g. Focus on the mathematical aspect..."
                                        className="bg-background/50 border-white/10 min-h-[100px]"
                                    />
                                </div>

                                <Button type="submit" className="w-full bg-primary/80 hover:bg-primary shadow-lg shadow-primary/20" disabled={loading}>
                                    {loading ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Generating...
                                        </>
                                    ) : (
                                        'Start Learning'
                                    )}
                                </Button>
                            </form>
                        </CardContent>
                    </GlassCard>
                </motion.div>

                {response && (
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5 }}
                        className="h-full"
                    >
                        <GlassCard className="h-full min-h-[400px] flex flex-col border-primary/20" enableTilt={false}>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 border-b border-white/5">
                                <CardTitle>Explanation</CardTitle>
                                <div className="flex gap-2">
                                    {!response.startsWith('Error:') && (
                                        <>
                                            <DownloadPDFButton targetRef={outputRef} filename="tutor-explanation.pdf" />
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
                    </motion.div>
                )}

                {/* Empty State / Placeholder */}
                {!response && (
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                        className="hidden md:block h-full min-h-[400px]"
                    >
                        <GlassCard className="h-full flex items-center justify-center border-dashed border-white/10 bg-white/5">
                            <div className="text-center p-6 text-muted-foreground">
                                <Brain className="w-12 h-12 mx-auto mb-4 opacity-50" />
                                <p>Your personalized explanation will appear here.</p>
                            </div>
                        </GlassCard>
                    </motion.div>
                )}
            </div>

            {/* Check My Understanding Section */}
            {response && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                >
                    <CheckUnderstandingSection originalTopic={initialTopic || "the topic"} />
                </motion.div>
            )}
        </div>
    );
}

export default function TutorPage() {
    return (
        <Suspense fallback={<div className="flex justify-center items-center h-full"><Loader2 className="h-8 w-8 animate-spin" /></div>}>
            <TutorContent />
        </Suspense>
    );
}
