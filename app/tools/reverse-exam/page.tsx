'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { generateMistake, gradeCorrection } from './actions';
import { Loader2, GraduationCap, School, Check, X, AlertTriangle } from 'lucide-react';
import { motion } from 'framer-motion';

import { useHistoryStore } from '@/lib/history-store';
import { ToolBackButton } from '@/components/global/ToolBackButton';

export default function ReverseExamPage() {
    const [loading, setLoading] = useState(false);
    const [step, setStep] = useState<'input' | 'correct' | 'graded'>('input');
    const [examData, setExamData] = useState<any>(null);
    const [correction, setCorrection] = useState('');
    const [grade, setGrade] = useState<any>(null);
    const { addToHistory } = useHistoryStore();

    async function handleStart(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setLoading(true);
        const formData = new FormData(event.currentTarget);
        const result = await generateMistake(formData);

        if (result.success) {
            setExamData(result.data);
            setStep('correct');
            addToHistory({
                type: 'generation',
                tool: 'Reverse Exam',
                query: formData.get('topic') as string,
                result: `Generated mistake for: ${(result.data as any).question}`
            });
        } else {
            alert(result.error);
        }
        setLoading(false);
    }

    async function handleGrade() {
        if (!correction) return;
        setLoading(true);
        const result = await gradeCorrection(examData.wrong_answer, correction, examData.question);

        if (result.success) {
            setGrade(result.data);
            setStep('graded');
        } else {
            alert(result.error);
        }
        setLoading(false);
    }

    const reset = () => {
        setStep('input');
        setExamData(null);
        setGrade(null);
        setCorrection('');
    };

    return (
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 sm:space-y-8 pb-16 sm:pb-20">
            <ToolBackButton />
            <div className="space-y-2 text-center">
                <h1 className="text-2xl xs:text-3xl sm:text-3xl md:text-4xl font-bold flex items-center justify-center gap-2">
                    <GraduationCap className="w-8 h-8 text-indigo-600" />
                    The Reverse Exam
                </h1>
                <p className="text-muted-foreground">The AI is the confused student. You are the Teacher. Find the mistake!</p>
            </div>

            {/* Step 1: Input Topic */}
            {step === 'input' && (
                <Card>
                    <CardHeader className="pb-3 sm:pb-4">
                        <CardTitle className="text-lg sm:text-xl">Pick a Topic</CardTitle>
                        <CardDescription>What subject do you want to teach?</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleStart} className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                            <Input name="topic" placeholder="e.g. Newton's Third Law, The Water Cycle, Python Lists" required className="h-10 sm:h-11" />
                            <Button type="submit" disabled={loading} className="w-full sm:w-auto h-10 sm:h-11 touch-target">
                                {loading ? <Loader2 className="animate-spin" /> : 'Start Class'}
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            )}

            {/* Step 2: The Mistake (Chat Interface) */}
            {step !== 'input' && examData && (
                <div className="space-y-6">
                    {/* The "student" message */}
                    <div className="flex justify-start">
                        <div className="flex items-start gap-3 max-w-[85%]">
                            <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center border-2 border-orange-200 shrink-0">
                                <School className="w-6 h-6 text-orange-600" />
                            </div>
                            <div className="bg-muted p-4 rounded-r-2xl rounded-bl-2xl space-y-2">
                                <div className="text-sm font-semibold text-muted-foreground">Confused Student</div>
                                <p className="font-medium text-lg">{examData.question}</p>
                                <div className="bg-red-50 dark:bg-red-900/20 p-3 rounded-md border border-red-100 dark:border-red-900/50">
                                    <p className="italic text-red-600 dark:text-red-400">"{examData.wrong_answer}"</p>
                                    <p className="text-xs text-muted-foreground mt-2">Thinking: {examData.lie_explanation}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* The "Teacher" correction (User) */}
                    <div className="flex justify-end">
                        <div className="flex items-start gap-3 max-w-[85%] w-full justify-end">
                            <div className="space-y-2 w-full">
                                <div className="text-right text-sm font-semibold text-muted-foreground">You (Teacher)</div>
                                {step === 'correct' ? (
                                    <div className="flex gap-2">
                                        <div className="relative w-full">
                                            <Input
                                                autoFocus
                                                value={correction}
                                                onChange={(e) => setCorrection(e.target.value)}
                                                placeholder="No, that's wrong because..."
                                                className="w-full h-10 sm:h-11"
                                                onKeyDown={(e) => e.key === 'Enter' && handleGrade()}
                                            />
                                        </div>
                                        <Button onClick={handleGrade} disabled={loading || !correction} className="h-10 sm:h-11 touch-target">
                                            {loading ? <Loader2 className="animate-spin" /> : 'Grade'}
                                        </Button>
                                    </div>
                                ) : (
                                    <div className="bg-primary text-primary-foreground p-4 rounded-l-2xl rounded-br-2xl ml-auto w-fit">
                                        {correction}
                                    </div>
                                )}
                            </div>
                            <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center shrink-0">
                                <GraduationCap className="w-6 h-6 text-primary-foreground" />
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Step 3: The Grade */}
            {step === 'graded' && grade && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <Card className={`border-2 ${grade.score > 7 ? 'border-green-500' : 'border-yellow-500'}`}>
                        <CardHeader className="pb-3 sm:pb-4">
                            <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                                Score: {grade.score}/10
                                {grade.score > 7 ? <Check className="w-6 h-6 text-green-500" /> : <AlertTriangle className="w-6 h-6 text-yellow-500" />}
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <p className="text-lg">{grade.feedback}</p>
                            <div className="bg-secondary/50 p-3 rounded-md">
                                <span className="font-semibold text-sm uppercase text-muted-foreground">The Absolute Truth:</span>
                                <p className="mt-1">{grade.correct_answer}</p>
                            </div>
                        </CardContent>
                        <CardFooter>
                            <Button onClick={reset} variant="outline" className="w-full h-10 sm:h-11 touch-target">Teach Another Topic</Button>
                        </CardFooter>
                    </Card>
                </motion.div>
            )}
        </div>
    );
}
