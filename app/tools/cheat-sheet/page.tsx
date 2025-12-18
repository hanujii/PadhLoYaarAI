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
import { ToolBackButton } from '@/components/global/ToolBackButton';

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
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 sm:space-y-8 pb-16 sm:pb-20">
            <ToolBackButton />
            <div className="space-y-2">
                <h1 className="text-2xl xs:text-3xl sm:text-3xl md:text-4xl font-bold">Cheat Sheet Generator</h1>
                <p className="text-muted-foreground">Generate tables, formulas, and summaries instantly.</p>
            </div>

            <Card>
                <CardContent className="pt-5 sm:pt-6">
                    <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                        <Input name="topic" placeholder="Topic (e.g. React Hooks, French Grammar, Maxwell's Equations)" required className="h-10 sm:h-11" />
                        <Button type="submit" disabled={loading} className="w-full sm:w-auto h-10 sm:h-11 touch-target">
                            {loading ? <Loader2 className="animate-spin" /> : 'Generate'}
                        </Button>
                    </form>
                </CardContent>
            </Card>

            {content && (
                <Card>
                    <CardHeader className="flex flex-col sm:flex-row sm:items-center pb-3 sm:pb-4 gap-3 sm:gap-0 justify-between">
                        <CardTitle className="flex items-center gap-2 text-lg sm:text-xl"><Table className="w-5 h-5" /> Result</CardTitle>
                        <div className="flex gap-2">
                            <DownloadPDFButton targetRef={contentRef} filename="cheat-sheet.pdf" className="touch-target" />
                            <Button variant="outline" size="sm" onClick={downloadSheet} className="touch-target">
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
