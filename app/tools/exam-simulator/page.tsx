'use client';

import { useState, useRef, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { GlassCard } from '@/components/ui/glass-card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { generateExam } from './actions';
import { Loader2, GraduationCap, CheckCircle, XCircle, Brain, Timer, Award, ChevronRight, RefreshCcw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Progress } from '@/components/ui/progress';
import { useHistoryStore } from '@/lib/history-store';
import { ShareResult } from '@/components/global/ShareResult';

interface ExamData {
    examTitle: string;
    questions: {
        id: number;
        question: string;
        options: string[];
        correctOptionIndex: number;
    }[];
}

export default function ExamSimulatorPage() {
    const [topic, setTopic] = useState('');
    const [difficulty, setDifficulty] = useState('Medium');
    const [loading, setLoading] = useState(false);
    const [exam, setExam] = useState<ExamData | null>(null);
    const [userAnswers, setUserAnswers] = useState<Record<number, number>>({});
    const [submitted, setSubmitted] = useState(false);
    const [score, setScore] = useState(0);
    const [showResults, setShowResults] = useState(false);
    const resultsRef = useRef<HTMLDivElement>(null);
    const { addToHistory } = useHistoryStore();
    const searchParams = useSearchParams();

    useEffect(() => {
        const initialTopic = searchParams.get('topic');
        const q = searchParams.get('q');
        const target = initialTopic || q;
        if (target && !topic) {
            setTopic(target);
            // Optional: Auto-start if desired, but user might want to pick difficulty
        }
    }, [searchParams, topic]);

    const handleStart = async () => {
        setLoading(true);
        setExam(null);
        setSubmitted(false);
        setUserAnswers({});
        setScore(0);
        setShowResults(false);

        const result = await generateExam(topic, difficulty);
        if (result.success && result.data) {
            setExam(result.data);
        } else {
            alert("Failed to generate exam: " + result.error);
        }
        setLoading(false);
    };

    const handleOptionSelect = (qId: number, optIndex: number) => {
        if (submitted) return;
        setUserAnswers(prev => ({ ...prev, [qId]: optIndex }));
    };

    const handleSubmit = () => {
        if (!exam) return;
        let correctCount = 0;
        exam.questions.forEach(q => {
            if (userAnswers[q.id] === q.correctOptionIndex) {
                correctCount++;
            }
        });
        const calculatedScore = correctCount;
        const totalQuestions = exam.questions.length;
        const percentage = Math.round((calculatedScore / totalQuestions) * 100);

        setScore(calculatedScore);
        setSubmitted(true);
        setShowResults(true);
        addToHistory({
            tool: 'exam-simulator',
            query: `Exam on ${topic}`,
            result: `Score: ${calculatedScore}/${totalQuestions} (${percentage}%)`
        });
    };

    const resetExam = () => {
        setExam(null);
        setSubmitted(false);
        setUserAnswers({});
        setScore(0);
        setShowResults(false);
        setTopic('');
        setDifficulty('Medium');
    };

    return (
        <div className="max-w-3xl mx-auto space-y-8">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center space-y-2"
            >
                <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl flex items-center justify-center gap-3">
                    <GraduationCap className="text-blue-500 w-10 h-10 drop-shadow-md" />
                    <span className="text-primary">Exam Simulator</span>
                </h1>
                <p className="text-lg text-muted-foreground">Test your knowledge under pressure.</p>
            </motion.div>

            {!exam && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                >
                    <GlassCard className="border-blue-500/10 bg-blue-950/5" enableTilt={true}>
                        <CardHeader>
                            <CardTitle>Setup Exam</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <Input
                                placeholder="Enter Topic (e.g. Organic Chemistry)"
                                value={topic}
                                onChange={(e) => setTopic(e.target.value)}
                                className="bg-background/50 border-white/10"
                            />
                            <Select value={difficulty} onValueChange={setDifficulty}>
                                <SelectTrigger className="bg-background/50 border-white/10">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Easy">Easy</SelectItem>
                                    <SelectItem value="Medium">Medium</SelectItem>
                                    <SelectItem value="Hard">Hard</SelectItem>
                                    <SelectItem value="Nightmare">Nightmare</SelectItem>
                                </SelectContent>
                            </Select>
                            <Button
                                className="w-full bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-500/20"
                                onClick={handleStart}
                                disabled={loading || !topic.trim()}
                            >
                                {loading ? <Loader2 className="animate-spin mr-2" /> : "Start Exam"}
                            </Button>
                        </CardContent>
                    </GlassCard>
                </motion.div>
            )}

            {exam && (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                    <div className="flex justify-between items-center bg-muted/50 backdrop-blur-sm p-4 rounded-lg border border-white/5">
                        <h2 className="text-xl font-bold">{exam.examTitle}</h2>
                        {submitted && (
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className="text-2xl font-bold text-primary bg-primary/10 px-4 py-2 rounded-full border border-primary/20"
                            >
                                Score: {score} / {exam.questions.length}
                            </motion.div>
                        )}
                    </div>

                    {exam.questions.map((q, idx) => {
                        const isCorrect = submitted && userAnswers[q.id] === q.correctOptionIndex;
                        const isWrong = submitted && userAnswers[q.id] !== q.correctOptionIndex;
                        const userAnswer = userAnswers[q.id];

                        return (
                            <motion.div
                                key={q.id}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: idx * 0.1 }}
                            >
                                <GlassCard
                                    className={`transition-all duration-500 ${submitted ? (isCorrect ? 'border-green-500/50 bg-green-500/5' : (isWrong ? 'border-red-500/50 bg-red-500/5' : '')) : 'hover:border-blue-500/30'}`}
                                    enableTilt={false}
                                >
                                    <CardHeader className="py-4 border-b border-white/5">
                                        <div className="flex justify-between items-start gap-4">
                                            <CardTitle className="text-lg leading-snug">Q{idx + 1}: {q.question}</CardTitle>
                                            {submitted && (
                                                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}>
                                                    {isCorrect ? <CheckCircle className="text-green-500 w-6 h-6" /> : (isWrong ? <XCircle className="text-red-500 w-6 h-6" /> : null)}
                                                </motion.div>
                                            )}
                                        </div>
                                    </CardHeader>
                                    <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-4">
                                        {q.options.map((opt, i) => (
                                            <Button
                                                key={i}
                                                variant={userAnswer === i ? "default" : "outline"}
                                                className={`justify-start h-auto py-3 px-4 text-left whitespace-normal transition-all duration-200 ${submitted && i === q.correctOptionIndex ? 'ring-2 ring-green-500 bg-green-500/10 hover:bg-green-500/20 text-green-500' : ''
                                                    } ${submitted && userAnswer === i && i !== q.correctOptionIndex ? 'bg-red-500 hover:bg-red-600 text-white border-red-500' : ''
                                                    } ${!submitted && userAnswer === i ? 'bg-blue-600 hover:bg-blue-700' : 'hover:bg-accent/50'
                                                    }`}
                                                onClick={() => handleOptionSelect(q.id, i)}
                                                disabled={submitted}
                                            >
                                                <span className="font-bold mr-2 opacity-50">{String.fromCharCode(65 + i)}.</span> {opt}
                                            </Button>
                                        ))}
                                    </CardContent>
                                </GlassCard>
                            </motion.div>
                        );
                    })}

                    {!submitted && (
                        <div className="sticky bottom-6 z-10">
                            <Button size="lg" className="w-full shadow-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 transform hover:scale-[1.01] transition-all" onClick={handleSubmit}>
                                Submit Exam
                            </Button>
                        </div>
                    )}

                    {submitted && (
                        <Button size="lg" variant="outline" className="w-full border-primary/20 hover:bg-primary/10" onClick={() => setExam(null)}>
                            Take Another Exam
                        </Button>
                    )}
                </motion.div>
            )}
        </div>
    );
}
