'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getTutorResponse } from './actions';
import ReactMarkdown from 'react-markdown';
import { Loader2, Bookmark, Check } from 'lucide-react';
import { useHistoryStore } from '@/lib/history-store';

export default function TutorPage() {
    const [loading, setLoading] = useState(false);
    const [response, setResponse] = useState<string | null>(null);
    const { addToHistory, saveItem } = useHistoryStore();
    const [isSaved, setIsSaved] = useState(false);

    // Reset saved state when response changes
    const [lastResponse, setLastResponse] = useState<string | null>(null);
    if (response !== lastResponse) {
        setIsSaved(false);
        setLastResponse(response);
    }

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setLoading(true);
        setResponse(null);

        const formData = new FormData(event.currentTarget);
        const result = await getTutorResponse(formData);

        if (result.success && result.data) {
            setResponse(result.data);

            // Auto-add to history
            addToHistory({
                type: 'generation',
                tool: 'Tutor',
                query: (formData.get('topic') as string) || 'Unknown Topic',
                result: result.data
            });
        } else {
            setResponse('Error: ' + (result.error || 'Something went wrong'));
        }
        setLoading(false);
    }

    const handleSave = () => {
        if (!response) return;
        const topic = (document.getElementById('topic') as HTMLInputElement)?.value || 'Tutor Result';
        saveItem({
            type: 'result',
            title: `Tutor: ${topic}`,
            content: response
        });
        setIsSaved(true);
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <div className="space-y-2">
                <h1 className="text-3xl font-bold">AI Tutor</h1>
                <p className="text-muted-foreground">Get personalized explanations for any topic.</p>
            </div>

            <div className="grid gap-8 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle>Configuration</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="topic">Topic</Label>
                                <Input id="topic" name="topic" placeholder="e.g. Quantum Entanglement" required />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="mode">Learning Mode</Label>
                                <Select name="mode" defaultValue="concise">
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select mode" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="concise">Concise & Clear</SelectItem>
                                        <SelectItem value="detailed">Detailed Deep Dive</SelectItem>
                                        <SelectItem value="eli5">Explain Like I&apos;m 5</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="instructions">Custom Instructions</Label>
                                <Textarea
                                    id="instructions"
                                    name="instructions"
                                    placeholder="e.g. Focus on the mathematical aspect..."
                                />
                            </div>

                            <Button type="submit" className="w-full" disabled={loading}>
                                {loading ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Generating...
                                    </>
                                ) : (
                                    'Start Learning'
                                )}
                            </Button>
                        </form>
                    </CardContent>
                </Card>

                <Card className="h-full min-h-[400px]">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle>Explanation</CardTitle>
                        {response && !response.startsWith('Error:') && (
                            <Button variant="outline" size="sm" onClick={handleSave} disabled={isSaved}>
                                {isSaved ? <Check className="w-4 h-4 mr-2" /> : <Bookmark className="w-4 h-4 mr-2" />}
                                {isSaved ? 'Saved' : 'Save'}
                            </Button>
                        )}
                    </CardHeader>
                    <CardContent className="prose dark:prose-invert max-w-none overflow-y-auto max-h-[600px]">
                        {response ? (
                            <ReactMarkdown>{response}</ReactMarkdown>
                        ) : (
                            <div className="text-center text-muted-foreground py-12">
                                result will appear here...
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
