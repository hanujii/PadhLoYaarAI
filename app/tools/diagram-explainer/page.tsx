'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { explainDiagram } from './actions';
import { Loader2, Image as ImageIcon } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

export default function DiagramExplainerPage() {
    const [loading, setLoading] = useState(false);
    const [response, setResponse] = useState<string | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setPreviewUrl(URL.createObjectURL(e.target.files[0]));
        }
    };

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setLoading(true);
        const formData = new FormData(event.currentTarget);
        const result = await explainDiagram(formData);
        if (result.success && result.data) {
            setResponse(result.data);
        } else {
            setResponse('Error: ' + result.error);
        }
        setLoading(false);
    }

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <div className="space-y-2">
                <h1 className="text-3xl font-bold">Diagram Explainer</h1>
                <p className="text-muted-foreground">Upload flowcharts, biology diagrams, or graphs.</p>
            </div>

            <div className="grid gap-8 md:grid-cols-2">
                <Card>
                    <CardHeader><CardTitle>Upload</CardTitle></CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="border-2 border-dashed rounded-lg p-4 flex flex-col items-center justify-center min-h-[200px]">
                                {previewUrl ? (
                                    // eslint-disable-next-line @next/next/no-img-element
                                    <img src={previewUrl} alt="Preview" className="max-h-[300px] object-contain" />
                                ) : (
                                    <div className="text-center text-muted-foreground">
                                        <ImageIcon className="w-12 h-12 mx-auto mb-2 opacity-50" />
                                        <p>Select an image</p>
                                    </div>
                                )}
                                <Input type="file" name="image" accept="image/*" onChange={handleFileChange} required className="mt-4" />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium">Specific Question (Optional)</label>
                                <Textarea name="question" placeholder="Which part represents the mitochondria?" />
                            </div>

                            <Button type="submit" className="w-full" disabled={loading}>
                                {loading ? <Loader2 className="animate-spin mr-2" /> : 'Analyze Diagram'}
                            </Button>
                        </form>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader><CardTitle>Analysis</CardTitle></CardHeader>
                    <CardContent className="prose dark:prose-invert max-w-none max-h-[600px] overflow-y-auto">
                        {response ? <ReactMarkdown>{response}</ReactMarkdown> : <p className="text-muted-foreground">Analysis will appear here...</p>}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
