'use client';

import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { generateExam } from './actions';
import { Loader2 } from 'lucide-react';
import { DownloadPDFButton } from '@/components/global/DownloadPDFButton';
import { ToolBackButton } from '@/components/global/ToolBackButton';
import { QuizRenderer } from '@/components/global/QuizRenderer';

export default function ExamGeneratorPage() {
    const [loading, setLoading] = useState(false);
    const [examContent, setExamContent] = useState<any>(null);
    const examRef = useRef<HTMLDivElement>(null);

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setLoading(true);
        setExamContent(null);

        const formData = new FormData(event.currentTarget);
        const result = await generateExam(formData);

        if (result.success && result.data) {
            setExamContent(result.data);
        } else {
            setExamContent('Error: ' + (result.error || 'Something went wrong'));
        }
        setLoading(false);
    }

    const downloadExam = () => {
        if (!examContent) return;
        const blob = new Blob([examContent], { type: 'text/markdown' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'generated-exam.md';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8 px-4 md:px-0">
            <ToolBackButton />
            <div className="space-y-2">
                <h1 className="text-3xl font-bold">Exam Generator</h1>
                <p className="text-muted-foreground">Create practice exams with solutions instantly.</p>
            </div>

            <div className="grid gap-8 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle>Exam Settings</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="topic">Topic / Subject</Label>
                                <Input id="topic" name="topic" placeholder="e.g. Organic Chemistry, WWII History" required />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="difficulty">Difficulty</Label>
                                    <Select name="difficulty" defaultValue="medium">
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="easy">Easy</SelectItem>
                                            <SelectItem value="medium">Medium</SelectItem>
                                            <SelectItem value="hard">Hard</SelectItem>
                                            <SelectItem value="expert">Expert</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="questionCount">Questions</Label>
                                    <Select name="questionCount" defaultValue="5">
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="5">5 Questions</SelectItem>
                                            <SelectItem value="10">10 Questions</SelectItem>
                                            <SelectItem value="20">20 Questions</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="type">Format</Label>
                                <Select name="type" defaultValue="mcq">
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="mcq">Multiple Choice</SelectItem>
                                        <SelectItem value="written">Written / Short Answer</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <Button type="submit" className="w-full" disabled={loading}>
                                {loading ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Generating...
                                    </>
                                ) : (
                                    'Generate Exam'
                                )}
                            </Button>
                        </form>
                    </CardContent>
                </Card>

                <Card className="h-full min-h-[400px]">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle>Exam Preview</CardTitle>
                        {examContent && (
                            <div className="flex gap-2">
                                <DownloadPDFButton targetRef={examRef} filename="generated-exam.pdf" />
                            </div>
                        )}
                    </CardHeader>
                    <CardContent className="overflow-y-auto max-h-[600px] mt-4">
                        <div ref={examRef}>
                            {examContent ? (
                                <div className="space-y-6">
                                    {/* We need to determine if it is MCQ or Written from the data */}
                                    {Array.isArray(examContent) && examContent.length > 0 && examContent[0].type === 'mcq' ? (
                                        <QuizRenderer questions={examContent} />
                                    ) : (
                                        <div className="space-y-4">
                                            {Array.isArray(examContent) ? examContent.map((q: any, i: number) => (
                                                <Card key={i} className="border">
                                                    <CardHeader>
                                                        <CardTitle className="text-base">Q{i + 1}: {q.question}</CardTitle>
                                                    </CardHeader>
                                                    <CardContent>
                                                        <div className="bg-muted p-4 rounded-md">
                                                            <span className="font-semibold text-sm">Model Answer:</span>
                                                            <p className="text-sm mt-1">{q.answer}</p>
                                                        </div>
                                                    </CardContent>
                                                </Card>
                                            )) : <p>Invalid Data Format</p>}
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className="text-center text-muted-foreground py-12">
                                    Exam will appear here...
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
