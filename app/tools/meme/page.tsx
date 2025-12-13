'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { generateMeme } from './actions';
import { Loader2, Smile, Share2, Flame } from 'lucide-react';

import { useHistoryStore } from '@/lib/history-store';

export default function MemePage() {
    const [loading, setLoading] = useState(false);
    const [meme, setMeme] = useState<any>(null);
    const { addToHistory } = useHistoryStore();

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setLoading(true);
        const formData = new FormData(event.currentTarget);
        const result = await generateMeme(formData);

        if (result.success) {
            setMeme(result.data);
            if (result.data) {
                addToHistory({
                    type: 'generation',
                    tool: 'Meme-ory Mode',
                    query: formData.get('topic') as string,
                    result: `${result.data.top_text} ... ${result.data.bottom_text}`
                });
            }
        } else {
            alert(result.error);
        }
        setLoading(false);
    }

    return (
        <div className="max-w-xl mx-auto space-y-8">
            <div className="space-y-2 text-center">
                <h1 className="text-3xl font-bold flex items-center justify-center gap-2">
                    <Smile className="w-8 h-8 text-yellow-500" />
                    Meme-ory Mode
                </h1>
                <p className="text-muted-foreground">Learn via memes. Retention through laughter.</p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>What are we roasting today?</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="flex gap-4">
                        <Input name="topic" placeholder="e.g. Mitochondria, Shakespeare, Calculus" required />
                        <Button type="submit" disabled={loading}>
                            {loading ? <Loader2 className="animate-spin" /> : 'Meme-ify'}
                        </Button>
                    </form>
                </CardContent>
            </Card>

            {meme && (
                <div className="space-y-6 animate-in fade-in zoom-in duration-500">
                    {/* Meme Card */}
                    <div className="bg-black text-white rounded-lg overflow-hidden shadow-2xl items-center flex flex-col p-4 text-center border-4 border-gray-800">
                        <p className="text-2xl md:text-3xl font-impact uppercase tracking-wide py-4 w-full break-words">{meme.top_text}</p>

                        <div className="bg-gray-800 w-full aspect-video flex items-center justify-center p-4 text-gray-400 italic">
                            [Visual: {meme.image_description}]
                        </div>

                        <p className="text-2xl md:text-3xl font-impact uppercase tracking-wide py-4 w-full break-words">{meme.bottom_text}</p>
                    </div>

                    {/* Roast */}
                    <Card className="bg-orange-50 dark:bg-orange-950/20 border-orange-200 dark:border-orange-900">
                        <CardContent className="pt-6 flex items-start gap-4">
                            <Flame className="w-6 h-6 text-orange-500 shrink-0 mt-1" />
                            <div>
                                <h3 className="font-bold text-orange-700 dark:text-orange-400">The Roast:</h3>
                                <p className="italic text-lg">"{meme.roast}"</p>
                            </div>
                        </CardContent>
                    </Card>

                    <div className="flex justify-center">
                        <Button variant="outline" className="gap-2" onClick={() => alert("Screenshot to share! Native sharing coming soon.")}>
                            <Share2 className="w-4 h-4" /> Share with Friends
                        </Button>
                    </div>

                    <style jsx global>{`
                        .font-impact { font-family: 'Impact', 'Arial Black', sans-serif; text-shadow: 2px 2px 0 #000, -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000; }
                    `}</style>
                </div>
            )}
        </div>
    );
}
