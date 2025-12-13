'use client';

import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { generateAnalogy } from './actions';
import { Loader2, Zap, ArrowRight, Lightbulb } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { DownloadPDFButton } from '@/components/global/DownloadPDFButton';
import { useHistoryStore } from '@/lib/history-store';

const PRESET_INTERESTS = [
    "Cricket", "Bollywood", "Marvel/MCU", "Football", "Gaming (Minecraft/GTA)",
    "Cooking", "Music", "Harry Potter", "Social Media (Reels/TikTok)"
];

export default function AnalogyPage() {
    const [loading, setLoading] = useState(false);
    const [analogy, setAnalogy] = useState<string | null>(null);
    const [interest, setInterest] = useState('');
    const outputRef = useRef<HTMLDivElement>(null);
    const { addToHistory } = useHistoryStore();

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setLoading(true);
        setAnalogy(null);

        const formData = new FormData(event.currentTarget);
        if (interest) formData.set('interest', interest);

        const result = await generateAnalogy(formData);

        if (result.success && result.data) {
            setAnalogy(result.data);
            addToHistory({
                type: 'generation',
                tool: 'Analogy Engine',
                query: `${formData.get('concept')} as ${formData.get('interest')}`,
                result: result.data
            });
        } else {
            alert(result.error);
        }
        setLoading(false);
    }

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <div className="space-y-2 text-center">
                <h1 className="text-3xl font-bold flex items-center justify-center gap-2">
                    <Lightbulb className="w-8 h-8 text-yellow-500" />
                    The Analogy Engine
                </h1>
                <p className="text-muted-foreground">Explain anything using something you already love.</p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Connect the Dots</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Concept to Learn</label>
                                <Input name="concept" placeholder="e.g. Recursion, Photosynthesis, Inflation" required />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Explain using...</label>
                                <div className="flex gap-2">
                                    <Select onValueChange={setInterest} value={interest}>
                                        <SelectTrigger className="w-[180px]">
                                            <SelectValue placeholder="Pick Theme" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {PRESET_INTERESTS.map(i => <SelectItem key={i} value={i}>{i}</SelectItem>)}
                                            <SelectItem value="custom">Custom...</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <Input
                                        name="interest_custom"
                                        placeholder="or type custom topic"
                                        value={interest}
                                        onChange={(e) => setInterest(e.target.value)}
                                        className="flex-1"
                                    />
                                </div>
                            </div>
                        </div>
                        <Button type="submit" className="w-full" disabled={loading || !interest}>
                            {loading ? <Loader2 className="animate-spin mr-2" /> : <Zap className="w-4 h-4 mr-2" />}
                            Make it Click
                        </Button>
                    </form>
                </CardContent>
            </Card>

            {analogy && (
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle>Your Personalized Explanation</CardTitle>
                        <DownloadPDFButton targetRef={outputRef} filename="analogy.pdf" />
                    </CardHeader>
                    <CardContent className="prose dark:prose-invert max-w-none">
                        <div ref={outputRef}>
                            <ReactMarkdown remarkPlugins={[remarkGfm]}>{analogy}</ReactMarkdown>
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
