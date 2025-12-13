'use client';

import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { generateCheatSheet } from './actions';
import ReactMarkdown from 'react-markdown';
import { Loader2, Download, Table } from 'lucide-react';
import remarkGfm from 'remark-gfm';
import { DownloadPDFButton } from '@/components/global/DownloadPDFButton';
import { Typewriter } from '@/components/global/Typewriter';

export default function CheatSheetPage() {
    const [loading, setLoading] = useState(false);
    const [content, setContent] = useState<string | null>(null);
    const contentRef = useRef<HTMLDivElement>(null);

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setLoading(true);
        const formData = new FormData(event.currentTarget);
        const result = await generateCheatSheet(formData);
        if (result.success && result.data) {
            setContent(result.data);
        } else {
            setContent('Error: ' + result.error);
        }
        setLoading(false);
    }

    const downloadSheet = () => {
        if (!content) return;
        const blob = new Blob([content], { type: 'text/markdown' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'cheat-sheet.md';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <div className="space-y-2">
                <h1 className="text-3xl font-bold">Cheat Sheet Generator</h1>
                <p className="text-muted-foreground">Generate tables, formulas, and summaries instantly.</p>
            </div>

            <Card>
                <CardContent className="pt-6">
                    <form onSubmit={handleSubmit} className="flex gap-4">
                        <Input name="topic" placeholder="Topic (e.g. React Hooks, French Grammar, Maxwell's Equations)" required />
                        <Button type="submit" disabled={loading}>
                            {loading ? <Loader2 className="animate-spin" /> : 'Generate'}
                        </Button>
                    </form>
                </CardContent>
            </Card>

            {content && (
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle className="flex items-center gap-2"><Table className="w-5 h-5" /> Result</CardTitle>
                        <div className="flex gap-2">
                            <DownloadPDFButton targetRef={contentRef} filename="cheat-sheet.pdf" />
                            <Button variant="outline" size="sm" onClick={downloadSheet}>
                                <Download className="w-4 h-4 mr-2" /> Download Markdown
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent className="prose dark:prose-invert max-w-none overflow-x-auto">
                        <div ref={contentRef}>
                            <Typewriter content={content} speed={1} />
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
