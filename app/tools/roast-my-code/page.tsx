'use client';

import { useRef, useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ShareResult } from '@/components/global/ShareResult';
import { GlassCard } from '@/components/ui/glass-card';
import { roastCode } from './actions';
import { useHistoryStore } from '@/lib/history-store';
import { Flame, Loader2, RefreshCcw } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { motion } from 'framer-motion';
import { ToolBackButton } from '@/components/global/ToolBackButton';

// ... imports

function RoastMyCodeContent() {
    const [code, setCode] = useState('');
    const [roastData, setRoastData] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const resultRef = useRef<HTMLDivElement>(null);
    const { addToHistory } = useHistoryStore();
    const searchParams = useSearchParams();

    useEffect(() => {
        const initialQuery = searchParams.get('q');
        if (initialQuery && !code) {
            setCode(initialQuery);
        }
    }, [searchParams, code]);

    const handleRoast = async () => {
        if (!code.trim()) return;
        setLoading(true);
        setRoastData(null);

        const result = await roastCode(code);
        if (result.success && result.data) {
            setRoastData(result.data);
            addToHistory({
                tool: 'roast-my-code',
                query: code.substring(0, 50) + '...',
                result: `Burn Score: ${result.data.burn_score}/10`
            });
        } else {
            // Handle error
            alert("Error roasting code");
        }
        setLoading(false);
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8 px-4 md:px-0">
            <ToolBackButton />
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center space-y-2"
            >
                <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl flex items-center justify-center gap-3">
                    <Flame className="text-orange-500 w-10 h-10 fill-orange-500 animate-pulse drop-shadow-lg" />
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-red-500 to-orange-500">
                        Roast My Code
                    </span>
                </h1>
                <p className="text-lg text-muted-foreground">Detailed feedback? No. Brutal honesty? Yes.</p>
            </motion.div>

            <div className="grid gap-8 md:grid-cols-2">
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 }}
                >
                    <GlassCard className="h-full border-orange-500/10 bg-orange-950/5" enableTilt={true}>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <RefreshCcw className="w-5 h-5 text-orange-500" /> Your Spaghetti Code
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <Textarea
                                placeholder="Paste your spaghetti here..."
                                className="min-h-[400px] font-mono text-xs bg-background/50 border-white/10 resize-none focus:ring-orange-500/50"
                                value={code}
                                onChange={(e) => setCode(e.target.value)}
                            />
                            <Button
                                onClick={handleRoast}
                                disabled={loading || !code.trim()}
                                className="w-full bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 shadow-lg shadow-orange-500/20 transition-all duration-300 transform hover:scale-[1.02]"
                            >
                                {loading ? <Loader2 className="animate-spin mr-2" /> : <Flame className="mr-2 fill-white" />}
                                Roast It
                            </Button>
                        </CardContent>
                    </GlassCard>
                </motion.div>

                <div className="space-y-4 h-full">
                    {roastData && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, rotate: -2 }}
                            animate={{ opacity: 1, scale: 1, rotate: 0 }}
                            className="h-full flex flex-col gap-4"
                        >
                            {/* Burn Score Card */}
                            <GlassCard className="border-orange-500/30 bg-orange-950/20" enableTilt={false}>
                                <div className="p-4 flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <Flame className={`w-8 h-8 ${roastData.burn_score > 7 ? 'text-red-600 animate-pulse' : 'text-orange-500'}`} />
                                        <div>
                                            <h3 className="text-lg font-bold text-orange-100">Burn Score</h3>
                                            <p className="text-xs text-orange-300/70">Emotional Damage Level</p>
                                        </div>
                                    </div>
                                    <div className="text-4xl font-black text-white drop-shadow-[0_0_10px_rgba(234,88,12,0.5)]">
                                        {roastData.burn_score}<span className="text-lg text-muted-foreground">/10</span>
                                    </div>
                                </div>
                                <div className="h-2 bg-black/50 w-full mt-2">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${roastData.burn_score * 10}%` }}
                                        className={`h-full ${roastData.burn_score > 8 ? 'bg-red-600' : 'bg-orange-500'}`}
                                        transition={{ duration: 1, delay: 0.5 }}
                                    />
                                </div>
                            </GlassCard>

                            {/* The Roast */}
                            <GlassCard className="flex-1 border-red-500/30 shadow-[0_0_50px_rgba(239,68,68,0.1)] bg-gradient-to-br from-red-950/10 to-transparent" enableTilt={false}>
                                <div ref={resultRef}>
                                    <CardHeader className="border-b border-red-500/10 pb-4 flex flex-row items-center justify-between">
                                        <CardTitle className="text-red-500 flex items-center gap-2">
                                            <Flame className="w-5 h-5 fill-red-500" /> The Verdict
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="prose dark:prose-invert max-w-none p-6 pt-4 text-red-100/90 prose-p:leading-relaxed prose-strong:text-red-400">
                                        <ReactMarkdown>{roastData.roast}</ReactMarkdown>
                                    </CardContent>

                                    {/* The Fix */}
                                    {roastData.fix_suggestion && (
                                        <div className="mx-6 mb-6 p-4 rounded bg-green-950/20 border border-green-500/20">
                                            <h4 className="text-sm font-bold text-green-400 mb-1 flex items-center gap-2">
                                                <RefreshCcw className="w-4 h-4" /> Redemption Arc (The Fix)
                                            </h4>
                                            <p className="text-sm text-green-100/80">{roastData.fix_suggestion}</p>
                                        </div>
                                    )}
                                </div>
                                <div className="p-4 pt-0 flex justify-end">
                                    <ShareResult targetRef={resultRef as React.RefObject<HTMLElement>} fileName="my-code-roast.png" title="My Code Roast" text={`I scored ${roastData.burn_score}/10 on PadhLoYaarAI Roast!`} />
                                </div>
                            </GlassCard>
                        </motion.div>
                    )}

                    {!roastData && (
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.2 }}
                            className="h-full"
                        >
                            <GlassCard className="h-full flex items-center justify-center border-dashed border-white/10 bg-white/5">
                                <div className="text-center p-12 text-muted-foreground">
                                    <Flame className="w-16 h-16 mx-auto mb-4 text-orange-500/20" />
                                    <p className="text-lg">Waiting for a victim...</p>
                                    <p className="text-sm opacity-50 mt-2">Paste your code to receive emotional damage.</p>
                                </div>
                            </GlassCard>
                        </motion.div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default function RoastMyCodePage() {
    return (
        <Suspense fallback={<div className="flex justify-center items-center min-h-[50vh]"><Loader2 className="h-8 w-8 animate-spin" /></div>}>
            <RoastMyCodeContent />
        </Suspense>
    );
}
