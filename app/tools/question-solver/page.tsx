'use client';

import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { solveQuestion } from './actions';
import { Loader2, Upload, X, Image as ImageIcon } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { DownloadPDFButton } from '@/components/global/DownloadPDFButton';
import { Typewriter } from '@/components/global/Typewriter';

export default function QuestionSolverPage() {
    const [loading, setLoading] = useState(false);
    const [response, setResponse] = useState<string | null>(null);
    const [selectedImage, setSelectedImage] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const outputRef = useRef<HTMLDivElement>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setSelectedImage(file);
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    const clearImage = () => {
        setSelectedImage(null);
        setPreviewUrl(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setLoading(true);
        setResponse(null);

        const formData = new FormData(event.currentTarget);
        // Append file if not picked by input directly (though input[type=file] handles it)

        const result = await solveQuestion(formData);

        if (result.success && result.data) {
            setResponse(result.data);
        } else {
            setResponse('Error: ' + (result.error || 'Something went wrong'));
        }
        setLoading(false);
    }

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <div className="space-y-2">
                <h1 className="text-3xl font-bold">Question Solver</h1>
                <p className="text-muted-foreground">Upload a photo of a problem or type it out.</p>
            </div>

            <div className="grid gap-8 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle>Input</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">

                            <div className="space-y-2">
                                <label className="text-sm font-medium">Question Text (Optional)</label>
                                <Textarea
                                    name="question"
                                    placeholder="Type your question here or add context to the image..."
                                    className="resize-none min-h-[100px]"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium">Image (Optional)</label>
                                <div
                                    className="border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer hover:bg-muted/50 transition-colors"
                                    onClick={() => fileInputRef.current?.click()}
                                >
                                    {previewUrl ? (
                                        <div className="relative w-full aspect-video">
                                            {/* eslint-disable-next-line @next/next/no-img-element */}
                                            <img src={previewUrl} alt="Preview" className="w-full h-full object-contain rounded-md" />
                                            <Button
                                                type="button"
                                                variant="destructive"
                                                size="icon"
                                                className="absolute top-2 right-2 h-6 w-6"
                                                onClick={(e) => { e.stopPropagation(); clearImage(); }}
                                            >
                                                <X className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    ) : (
                                        <div className="text-center space-y-2">
                                            <ImageIcon className="w-8 h-8 text-muted-foreground mx-auto" />
                                            <span className="text-sm text-muted-foreground">Click to upload image</span>
                                        </div>
                                    )}
                                    <input
                                        ref={fileInputRef}
                                        type="file"
                                        name="image"
                                        accept="image/*"
                                        className="hidden"
                                        onChange={handleFileChange}
                                    />
                                </div>
                            </div>

                            <Button type="submit" className="w-full" disabled={loading}>
                                {loading ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Solving...
                                    </>
                                ) : (
                                    'Solve Question'
                                )}
                            </Button>
                        </form>
                    </CardContent>
                </Card>

                <Card className="h-full">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle>Solution</CardTitle>
                        {response && <DownloadPDFButton targetRef={outputRef} filename="solution.pdf" />}
                    </CardHeader>
                    <CardContent className="prose dark:prose-invert max-w-none overflow-y-auto max-h-[600px]">
                        <div ref={outputRef}>
                            {response ? (
                                <Typewriter content={response} speed={5} />
                            ) : (
                                <div className="flex flex-col items-center justify-center h-[300px] text-muted-foreground text-center">
                                    <UplaodPlaceholder />
                                    <p className="mt-4">Upload a question to see the step-by-step solution here.</p>
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

function UplaodPlaceholder() {
    return (
        <svg className="w-16 h-16 opacity-20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
    )
}
