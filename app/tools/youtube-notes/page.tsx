'use client';

import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { getYouTubeNotes } from './actions';
import { Loader2, Youtube as YoutubeIcon, FileText, ShieldCheck } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { DownloadPDFButton } from '@/components/global/DownloadPDFButton';
import { QuizRenderer } from '@/components/global/QuizRenderer';

import { useHistoryStore } from '@/lib/history-store';

import { Typewriter } from '@/components/global/Typewriter';
import { ToolBackButton } from '@/components/global/ToolBackButton';

export default function YouTubeNotesPage() {
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<{ summary: string; quiz: any[] } | null>(null);
    const { addToHistory } = useHistoryStore();
    const [url, setUrl] = useState('');
    const outputRef = useRef<HTMLDivElement>(null);

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setLoading(true);
        setResult(null);

        const formData = new FormData(event.currentTarget);
        const res = await getYouTubeNotes(formData);

        if (res.success && res.data) {
            setResult(res.data);
            addToHistory({
                type: 'generation',
                tool: 'YouTube Note-Taker',
                query: formData.get('url') as string,
                result: 'Generates notes & quiz'
            });
        } else {
            alert(`Error: ${res.error}`);
        }
        setLoading(false);
    }

    return (
        <div className="max-w-4xl mx-auto space-y-8 px-4 md:px-0">
            <ToolBackButton />
            <div className="space-y-2">
                <h1 className="text-3xl font-bold flex items-center gap-2">
                    <YoutubeIcon className="w-8 h-8 text-red-600" />
                    YouTube Note-Taker
                </h1>
                <p className="text-muted-foreground">Convert video lectures into structured study notes and quizzes.</p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Video URL</CardTitle>
                    <CardDescription>Paste the link to any YouTube video (must have captions).</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="flex gap-4">
                        <Input
                            name="url"
                            placeholder="https://www.youtube.com/watch?v=..."
                            value={url}
                            onChange={(e) => setUrl(e.target.value)}
                            required
                        />
                        <Button type="submit" disabled={loading || !url}>
                            {loading ? <Loader2 className="animate-spin" /> : 'Get Notes'}
                        </Button>
                    </form>
                </CardContent>
            </Card>

            {result && (
                <div className="space-y-6">
                    <div className="flex justify-end">
                        <DownloadPDFButton targetRef={outputRef} filename="video-notes.pdf" />
                    </div>

                    <div ref={outputRef}>
                        <Card className="min-h-[400px]">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <FileText className="w-5 h-5" /> Study Material
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="prose dark:prose-invert max-w-none mb-8">
                                    <Typewriter content={result.summary} speed={2} />
                                </div>

                                {result.quiz && result.quiz.length > 0 && (
                                    <div className="mt-8 pt-8 border-t">
                                        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                                            <ShieldCheck className="w-6 h-6 text-primary" />
                                            Video Quiz
                                        </h2>
                                        <QuizRenderer questions={result.quiz} />
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </div>
            )}
        </div>
    );
}
