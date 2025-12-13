'use client';

import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { getYouTubeNotes } from './actions';
import { Loader2, Youtube as YoutubeIcon, FileText } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { DownloadPDFButton } from '@/components/global/DownloadPDFButton';

import { useHistoryStore } from '@/lib/history-store';

import { Typewriter } from '@/components/global/Typewriter';

export default function YouTubeNotesPage() {
    const [loading, setLoading] = useState(false);
    const [displayNotes, setDisplayNotes] = useState<string | null>(null);
    const { addToHistory } = useHistoryStore();
    const [url, setUrl] = useState('');
    const outputRef = useRef<HTMLDivElement>(null);

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setLoading(true);
        setDisplayNotes(null);

        const formData = new FormData(event.currentTarget);
        const result = await getYouTubeNotes(formData);

        if (result.success && result.data) {
            setDisplayNotes(result.data);
            addToHistory({
                type: 'generation',
                tool: 'YouTube Note-Taker',
                query: formData.get('url') as string,
                result: result.data || 'Notes generated'
            });
        } else {
            setDisplayNotes(`**Error**: ${result.error}`);
        }
        setLoading(false);
    }

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <div className="space-y-2">
                <h1 className="text-3xl font-bold flex items-center gap-2">
                    <YoutubeIcon className="w-8 h-8 text-red-600" />
                    YouTube Note-Taker
                </h1>
                <p className="text-muted-foreground">Convert video lectures into structured study notes instantly.</p>
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

            {displayNotes && (
                <Card className="min-h-[400px]">
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle className="flex items-center gap-2">
                            <FileText className="w-5 h-5" /> Generated Notes
                        </CardTitle>
                        <DownloadPDFButton targetRef={outputRef} filename="video-notes.pdf" />
                    </CardHeader>
                    <CardContent className="prose dark:prose-invert max-w-none">
                        <div ref={outputRef}>
                            <Typewriter content={displayNotes} speed={3} />
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
