'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { roastCode } from './actions';
import { Flame, Loader2, RefreshCcw } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { motion } from 'framer-motion';

export default function RoastMyCodePage() {
    const [code, setCode] = useState('');
    const [roast, setRoast] = useState('');
    const [loading, setLoading] = useState(false);

    const handleRoast = async () => {
        if (!code.trim()) return;
        setLoading(true);
        setRoast('');

        const result = await roastCode(code);
        if (result.success && result.data) {
            setRoast(result.data);
        } else {
            setRoast("Even the AI refused to read this garbage. (Error occurred)");
        }
        setLoading(false);
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <div className="text-center space-y-2">
                <h1 className="text-3xl font-bold flex items-center justify-center gap-2">
                    <Flame className="text-orange-500 w-8 h-8 fill-orange-500 animate-pulse" />
                    Roast My Code
                </h1>
                <p className="text-muted-foreground">Detailed feedback? No. Brutal honesty? Yes.</p>
            </div>

            <div className="grid gap-8 md:grid-cols-2">
                <Card className="border-orange-500/20 bg-orange-500/5">
                    <CardHeader>
                        <CardTitle>Your Code</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <Textarea
                            placeholder="Paste your spaghetti here..."
                            className="min-h-[400px] font-mono text-xs"
                            value={code}
                            onChange={(e) => setCode(e.target.value)}
                        />
                        <Button
                            onClick={handleRoast}
                            disabled={loading || !code.trim()}
                            className="w-full bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600"
                        >
                            {loading ? <Loader2 className="animate-spin mr-2" /> : <Flame className="mr-2" />}
                            Roast It
                        </Button>
                    </CardContent>
                </Card>

                <div className="space-y-4">
                    {roast && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="h-full"
                        >
                            <Card className="h-full border-red-500/50 shadow-[0_0_30px_rgba(239,68,68,0.2)]">
                                <CardHeader>
                                    <CardTitle className="text-red-500">The Verdict</CardTitle>
                                </CardHeader>
                                <CardContent className="prose dark:prose-invert max-w-none">
                                    <ReactMarkdown>{roast}</ReactMarkdown>
                                </CardContent>
                            </Card>
                        </motion.div>
                    )}

                    {!roast && (
                        <div className="h-full border-2 border-dashed border-muted rounded-xl flex items-center justify-center p-12 text-muted-foreground text-center">
                            Waiting for a victim...
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
