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
import { ToolBackButton } from '@/components/global/ToolBackButton';

const PRESET_INTERESTS = [
    "Cricket", "Bollywood", "Marvel/MCU", "Football", "Gaming (Minecraft/GTA)",
    "Cooking", "Music", "Harry Potter", "Social Media (Reels/TikTok)"
];

export default function AnalogyPage() {
    const [loading, setLoading] = useState(false);
    const [analogy, setAnalogy] = useState<any>(null);
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
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 sm:space-y-8 pb-16 sm:pb-20">
            <ToolBackButton />
            <div className="space-y-2 text-center">
                <h1 className="text-2xl xs:text-3xl sm:text-3xl md:text-4xl font-bold flex items-center justify-center gap-2">
                    <Lightbulb className="w-8 h-8 text-yellow-500" />
                    The Analogy Engine
                </h1>
                <p className="text-muted-foreground">Explain anything using something you already love.</p>
            </div>

            <Card>
                <CardHeader className="pb-3 sm:pb-4">
                    <CardTitle className="text-lg sm:text-xl">Connect the Dots</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid gap-4 sm:gap-6 md:grid-cols-2">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Concept to Learn</label>
                                <Input name="concept" placeholder="e.g. Recursion, Photosynthesis, Inflation" required className="h-10 sm:h-11" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Explain using...</label>
                                <div className="flex gap-2">
                                    <Select onValueChange={setInterest} value={interest}>
                                        <SelectTrigger className="w-full sm:w-[180px] h-10 sm:h-11">
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
                                        className="flex-1 h-10 sm:h-11"
                                    />
                                </div>
                            </div>
                        </div>
                        <Button type="submit" className="w-full h-10 sm:h-11 touch-target" disabled={loading || !interest}>
                            {loading ? <Loader2 className="animate-spin mr-2" /> : <Zap className="w-4 h-4 mr-2" />}
                            Make it Click
                        </Button>
                    </form>
                </CardContent>
            </Card>

            {analogy && (
                <div ref={outputRef} className="space-y-6">
                    <Card className="border-indigo-500/20 bg-indigo-50/50 dark:bg-indigo-950/10">
                        <CardHeader className="pb-3 sm:pb-4">
                            <CardTitle className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-0 text-lg sm:text-xl">
                                <span>The Analogy</span>
                                <DownloadPDFButton targetRef={outputRef} filename="analogy.pdf" />
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="prose dark:prose-invert max-w-none text-lg leading-relaxed">
                                <ReactMarkdown remarkPlugins={[remarkGfm]}>{(analogy as any).analogy_content}</ReactMarkdown>
                            </div>
                        </CardContent>
                    </Card>

                    <div className="grid gap-4 sm:gap-6 md:grid-cols-2">
                        <Card className="border-orange-500/20 bg-orange-50/50 dark:bg-orange-950/10">
                            <CardHeader className="pb-3 sm:pb-4">
                                <CardTitle className="text-sm sm:text-base font-semibold uppercase tracking-wider text-orange-600 dark:text-orange-400">Key Mapping</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <ul className="space-y-3">
                                    {(analogy as any).key_mapping.map((map: any, i: number) => (
                                        <li key={i} className="flex items-center justify-between p-2 rounded bg-white/50 dark:bg-white/5 shadow-sm">
                                            <span className="font-medium">{map.concept_term}</span>
                                            <ArrowRight className="w-4 h-4 text-muted-foreground mx-2" />
                                            <span className="font-bold text-primary">{map.analogy_term}</span>
                                        </li>
                                    ))}
                                </ul>
                            </CardContent>
                        </Card>

                        <Card className="border-green-500/20 bg-green-50/50 dark:bg-green-950/10">
                            <CardHeader className="pb-3 sm:pb-4">
                                <CardTitle className="text-sm sm:text-base font-semibold uppercase tracking-wider text-green-600 dark:text-green-400">Simplified Definition</CardTitle>
                            </CardHeader>
                            <CardContent className="h-full flex items-center">
                                <p className="text-lg font-medium italic">
                                    "{(analogy as any).simplified_definition}"
                                </p>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            )}
        </div>
    );
}
