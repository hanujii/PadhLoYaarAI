'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { explainDiagram } from './actions';
import { Loader2, Image as ImageIcon } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { DownloadPDFButton } from '@/components/global/DownloadPDFButton';
import { ToolBackButton } from '@/components/global/ToolBackButton';
import { toast } from 'sonner';

export default function DiagramExplainerPage() {
    const [loading, setLoading] = useState(false);
    const [response, setResponse] = useState<string | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const outputRef = useRef<HTMLDivElement>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            
            // Validate file size (10MB limit)
            if (file.size > 10 * 1024 * 1024) {
                toast.error('Image size exceeds 10MB limit. Please choose a smaller image.');
                return;
            }

            // Validate file type
            const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
            if (!validTypes.includes(file.type)) {
                toast.error('Invalid image format. Please use JPEG, PNG, GIF, or WebP.');
                return;
            }

            // Cleanup previous URL
            if (previewUrl) {
                URL.revokeObjectURL(previewUrl);
            }

            const url = URL.createObjectURL(file);
            setPreviewUrl(url);
        }
    };

    // Cleanup object URL on unmount
    useEffect(() => {
        return () => {
            if (previewUrl) {
                URL.revokeObjectURL(previewUrl);
            }
        };
    }, [previewUrl]);

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setLoading(true);
        const formData = new FormData(event.currentTarget);
        const result = await explainDiagram(formData);
        if (result.success && result.data) {
            setResponse(result.data);
        } else {
            const errorMessage = result.error || 'Something went wrong';
            if (process.env.NODE_ENV === 'development') {
                console.error("Diagram Analysis Failed:", result.error);
            }
            setResponse(`**Error:** ${errorMessage}`);
            toast.error(errorMessage);
        }
        setLoading(false);
    }

    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 sm:space-y-8 pb-16 sm:pb-20">
            <ToolBackButton />
            <div className="space-y-2">
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold">Diagram Explainer</h1>
                <p className="text-muted-foreground">Upload flowcharts, biology diagrams, or graphs.</p>
            </div>

            <div className="grid gap-6 sm:gap-8 md:grid-cols-2">
                <Card>
                    <CardHeader className="pb-3 sm:pb-4"><CardTitle className="text-lg sm:text-xl">Upload</CardTitle></CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="border-2 border-dashed rounded-lg p-4 flex flex-col items-center justify-center min-h-[200px]">
                                {previewUrl ? (
                                    // eslint-disable-next-line @next/next/no-img-element
                                    <img 
                                        src={previewUrl} 
                                        alt="Diagram preview" 
                                        className="max-h-[300px] object-contain"
                                        loading="lazy"
                                    />
                                ) : (
                                    <div className="text-center text-muted-foreground">
                                        <ImageIcon className="w-12 h-12 mx-auto mb-2 opacity-50" />
                                        <p>Select an image</p>
                                    </div>
                                )}
                                <Input type="file" name="image" accept="image/*" onChange={handleFileChange} required className="mt-4 h-10 sm:h-11" />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium">Specific Question (Optional)</label>
                                <Textarea name="question" placeholder="Which part represents the mitochondria?" className="h-20 sm:h-24" />
                            </div>

                            <Button type="submit" className="w-full h-10 sm:h-11 touch-target" disabled={loading}>
                                {loading ? <Loader2 className="animate-spin mr-2" /> : 'Analyze Diagram'}
                            </Button>
                        </form>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-col sm:flex-row sm:items-center pb-3 sm:pb-4 gap-3 sm:gap-0 justify-between">
                        <CardTitle className="text-lg sm:text-xl">Analysis</CardTitle>
                        {response && <DownloadPDFButton targetRef={outputRef} filename="diagram-analysis.pdf" />}
                    </CardHeader>
                    <CardContent className="prose dark:prose-invert max-w-none max-h-[600px] overflow-y-auto">
                        <div ref={outputRef}>
                            {response ? <ReactMarkdown>{response}</ReactMarkdown> : <p className="text-muted-foreground">Analysis will appear here...</p>}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
