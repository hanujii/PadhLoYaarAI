'use client';

import { useState, useRef, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import {
    Loader2, Bookmark, Check, Brain, Sparkles,
    MessageSquare, Send, Image as ImageIcon, Settings2, X
} from 'lucide-react';

// UI Components
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { GlassCard } from '@/components/ui/glass-card';
import { ToolBackButton } from '@/components/global/ToolBackButton';
import { AIModelSelector, AISelection } from '@/components/global/AIModelSelector';
import { DownloadPDFButton } from '@/components/global/DownloadPDFButton';
import { CheckUnderstandingSection } from './CheckUnderstanding';
import { Typewriter } from '@/components/global/Typewriter';

// Stores & Logic
import { useHistoryStore } from '@/lib/history-store';
import { useGamificationStore } from '@/lib/gamification-store';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

function TutorContent() {
    // State
    const [topicInput, setTopicInput] = useState('');
    const [initialTopic, setInitialTopic] = useState('');
    const [response, setResponse] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [isSaved, setIsSaved] = useState(false);
    const [selectedModel, setSelectedModel] = useState<AISelection>('auto');
    const [showConfig, setShowConfig] = useState(true); // Toggle for mobile cleanliness

    // Refs
    const outputRef = useRef<HTMLDivElement>(null);
    const currentGenTopic = useRef('');

    // Hooks
    const searchParams = useSearchParams();
    const { addToHistory } = useHistoryStore();
    const { addXp } = useGamificationStore(); // Gamification Hook

    // Load URL Params
    useEffect(() => {
        const topicParam = searchParams.get('topic');
        if (topicParam) setTopicInput(topicParam);
    }, [searchParams]);

    // Handle Generation
    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setLoading(true);
        setResponse('');
        setIsSaved(false);
        setInitialTopic(topicInput);
        currentGenTopic.current = topicInput;

        // Form Data Extraction
        const formData = new FormData(event.currentTarget);
        const mode = formData.get('mode') as string;
        const instructions = formData.get('instructions') as string;
        const imageFile = formData.get('image') as File | null;

        let imageBase64 = null;
        if (imageFile && imageFile.size > 0) {
            try {
                imageBase64 = await new Promise((resolve) => {
                    const reader = new FileReader();
                    reader.onloadend = () => resolve((reader.result as string).split(',')[1]);
                    reader.readAsDataURL(imageFile);
                });
            } catch (e) {
                toast.error("Failed to process image.");
                setLoading(false);
                return;
            }
        }

        try {
            // Collapse config on mobile/desktop to focus on content
            if (window.innerWidth < 768) setShowConfig(false);

            const res = await fetch('/api/tutor', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    prompt: topicInput,
                    topic: topicInput,
                    mode,
                    instructions,
                    image: imageBase64,
                    model: selectedModel
                })
            });

            if (!res.ok) {
                if (res.status === 429) throw new Error("API Quota Exceeded. Please try a free model.");
                throw new Error(res.statusText || "Connection failed");
            }
            if (!res.body) throw new Error('No response body');

            const reader = res.body.getReader();
            const decoder = new TextDecoder();
            let fullText = '';
            let loopError = false;

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;
                const text = decoder.decode(value, { stream: true });

                // Panic checks
                if (text.includes('"error":')) {
                    try {
                        const json = JSON.parse(text);
                        if (json.error) throw new Error(json.error);
                    } catch (e) { }
                }

                fullText += text;
                setResponse(prev => (prev || '') + text);
            }

            if (!fullText) {
                // If the stream finished but we got no text, it likely failed silently or was filtered.
                const errorMsg = "**⚠️ No Response**\n\nThe AI returned no text. This could be due to:\n- Safety settings filtering the response\n- Invalid API Key permissions (404)\n- Connection interruption";
                setResponse(errorMsg);
                // Also add a failed entry to history? No, better not.
                return;
            }

            // GAMIFICATION REWARD
            addXp(50);
            // toast.success("Knowledge Gained! +50 XP"); // Optional: Store handles toast usually

        } catch (e: any) {
            console.error(e);
            setResponse(`**Error:** ${e.message}\n\n*Try selecting a different model or checking your connection.*`);
        } finally {
            setLoading(false);
        }
    }

    const handleSave = () => {
        if (!response || isSaved) return;
        addToHistory({
            type: 'generation',
            tool: 'AI Tutor (Saved)',
            query: initialTopic,
            result: response
        });
        setIsSaved(true);
        toast.success("Saved to History");
    };

    return (
        <div className="max-w-7xl mx-auto space-y-6 pb-20">
            <div className="flex items-center justify-between">
                <ToolBackButton />
                <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground mr-2 hidden sm:inline">Powered by</span>
                    <AIModelSelector value={selectedModel} onValueChange={setSelectedModel} />
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-full min-h-[500px]">

                {/* LEFT COLUMN: Input Configuration */}
                <motion.div
                    className={cn("lg:col-span-4 space-y-4", !showConfig && "hidden lg:block")}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                >
                    <GlassCard className="h-full border-primary/10">
                        <CardHeader className="pb-2">
                            <CardTitle className="flex items-center gap-2">
                                <Settings2 className="w-5 h-5 text-primary" />
                                Setup Tutor
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit} className="space-y-5">
                                <div className="space-y-2">
                                    <Label htmlFor="topic">What do you want to learn?</Label>
                                    <div className="relative">
                                        <Brain className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                                        <Input
                                            id="topic"
                                            name="topic"
                                            value={topicInput}
                                            onChange={(e) => setTopicInput(e.target.value)}
                                            placeholder="e.g. Black Holes, Calculus..."
                                            required
                                            className="pl-9 bg-background/50 border-white/10"
                                            autoComplete="off"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label>Learning Style</Label>
                                    <Select name="mode" defaultValue="concise">
                                        <SelectTrigger className="bg-background/50 border-white/10">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="concise">Concise & Clear</SelectItem>
                                            <SelectItem value="detailed">In-Depth Analysis</SelectItem>
                                            <SelectItem value="eli5">Explain Like I'm 5</SelectItem>
                                            <SelectItem value="academic">Academic / Formal</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <Label>Additional Instructions</Label>
                                    <Textarea
                                        name="instructions"
                                        placeholder="Specific focus areas, tone, etc."
                                        className="bg-background/50 border-white/10 h-24 resize-none"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label className="flex items-center gap-2 cursor-pointer hover:text-primary transition-colors w-fit">
                                        <ImageIcon className="w-4 h-4" />
                                        Attach Image (Optional)
                                    </Label>
                                    <Input
                                        type="file"
                                        name="image"
                                        accept="image/*"
                                        className="bg-background/50 border-white/10 text-xs file:bg-primary/10 file:text-primary file:border-0 file:rounded-md file:mr-4 file:px-2 file:py-1"
                                    />
                                </div>

                                <Button
                                    type="submit"
                                    className="w-full bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-700 shadow-lg shadow-primary/20 transition-all duration-300"
                                    disabled={loading || !topicInput.trim()}
                                >
                                    {loading ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Thinking...
                                        </>
                                    ) : (
                                        <>
                                            Start Lesson <Sparkles className="ml-2 w-4 h-4" />
                                        </>
                                    )}
                                </Button>
                            </form>
                        </CardContent>
                    </GlassCard>
                </motion.div>

                {/* RIGHT COLUMN: Output Area */}
                <motion.div
                    className="lg:col-span-8 flex flex-col gap-6"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                >
                    {/* Placeholder when empty */}
                    {!response && !loading && (
                        <div className="h-full min-h-[400px] flex flex-col items-center justify-center text-center p-8 border border-dashed border-white/10 rounded-3xl bg-white/5 animate-in fade-in zoom-in duration-500">
                            <div className="bg-primary/10 p-4 rounded-full mb-4">
                                <MessageSquare className="w-8 h-8 text-primary" />
                            </div>
                            <h3 className="text-xl font-semibold mb-2">Ready to Teach</h3>
                            <p className="text-muted-foreground max-w-md">
                                Select a topic and configure your preferences to get a personalized AI lesson.
                            </p>
                        </div>
                    )}

                    {/* Active Content */}
                    {(response || loading) && (
                        <AnimatePresence mode="wait">
                            <motion.div
                                key="output"
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0 }}
                                className="h-full"
                            >
                                <GlassCard className="min-h-[600px] flex flex-col border-primary/20 relative overflow-hidden" enableTilt={false}>
                                    {/* Action Bar */}
                                    <div className="absolute top-4 right-4 flex gap-2 z-10">
                                        {!loading && response && (
                                            <>
                                                <DownloadPDFButton targetRef={outputRef} filename={`tutor-${initialTopic}.pdf`} />
                                                <Button variant="outline" size="icon" onClick={handleSave} disabled={isSaved} title="Save to History">
                                                    {isSaved ? <Check className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
                                                </Button>
                                            </>
                                        )}
                                    </div>

                                    <CardContent className="flex-1 p-6 md:p-8 overflow-y-auto custom-scrollbar">
                                        {/* Original Query Display */}
                                        <div className="mb-6 pb-4 border-b border-white/5">
                                            <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-white/70">
                                                {initialTopic}
                                            </h2>
                                            <p className="text-sm text-primary/80 font-medium mt-1 uppercase tracking-wider">AI Tutor Response</p>
                                        </div>

                                        {/* Main Markdown Output */}
                                        <div ref={outputRef} className="prose prose-invert max-w-none 
                                            prose-headings:text-indigo-300 prose-h1:text-3xl prose-h2:text-2xl prose-h3:text-xl
                                            prose-p:text-slate-200 prose-p:leading-relaxed
                                            prose-strong:text-amber-400 prose-strong:font-semibold
                                            prose-code:text-pink-300 prose-code:bg-purple-900/30 prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-code:font-mono
                                            prose-pre:bg-slate-950/50 prose-pre:border prose-pre:border-white/10 prose-pre:p-4 prose-pre:rounded-lg
                                            prose-li:text-slate-200 prose-ul:my-4 prose-ol:my-4
                                            prose-table:border-collapse prose-table:w-full prose-table:my-6
                                            prose-th:border prose-th:border-white/20 prose-th:bg-white/5 prose-th:p-3 prose-th:text-left prose-th:text-primary
                                            prose-td:border prose-td:border-white/10 prose-td:p-3
                                            prose-blockquote:border-l-4 prose-blockquote:border-primary/50 prose-blockquote:pl-4 prose-blockquote:italic prose-blockquote:text-slate-400
                                            ">

                                            {response ? (
                                                <ReactMarkdown remarkPlugins={[remarkGfm]}>{response}</ReactMarkdown>
                                            ) : (
                                                <div className="flex flex-col items-center justify-center py-20 space-y-6 opacity-70">
                                                    <Loader2 className="w-10 h-10 animate-spin text-primary" />
                                                    <div className="text-center space-y-2">
                                                        <p className="text-lg font-medium">Drafting Lesson Plan...</p>
                                                        <p className="text-xs text-muted-foreground">Consulting {selectedModel} model</p>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </CardContent>

                                    {/* Check Understanding Integration */}
                                    {!loading && response && !response.includes("Error") && (
                                        <div className="border-t border-white/5 bg-black/20 p-4">
                                            <CheckUnderstandingSection originalTopic={initialTopic} />
                                        </div>
                                    )}
                                </GlassCard>
                            </motion.div>
                        </AnimatePresence>
                    )}
                </motion.div>
            </div>
        </div>
    );
}

export default function TutorPage() {
    return (
        <Suspense fallback={<div className="h-screen flex items-center justify-center"><Loader2 className="w-10 h-10 animate-spin text-primary" /></div>}>
            <TutorContent />
        </Suspense>
    );
}
