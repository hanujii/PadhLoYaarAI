'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { generateExam } from './actions';
import { Loader2, GraduationCap, CheckCircle, XCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { Progress } from '@/components/ui/progress';

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

    const handleStart = async () => {
        setLoading(true);
        setExam(null);
        setSubmitted(false);
        setUserAnswers({});
        setScore(0);

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
        setScore(correctCount);
        setSubmitted(true);
    };

    return (
        <div className="max-w-3xl mx-auto space-y-8">
            <div className="text-center space-y-2">
                <h1 className="text-3xl font-bold flex items-center justify-center gap-2">
                    <GraduationCap className="text-blue-500 w-8 h-8" />
                    Exam Simulator
                </h1>
                <p className="text-muted-foreground">Test your knowledge under pressure.</p>
            </div>

            {!exam && (
                <Card>
                    <CardHeader><CardTitle>Setup Exam</CardTitle></CardHeader>
                    <CardContent className="space-y-4">
                        <Input
                            placeholder="Enter Topic (e.g. Organic Chemistry)"
                            value={topic}
                            onChange={(e) => setTopic(e.target.value)}
                        />
                        <Select value={difficulty} onValueChange={setDifficulty}>
                            <SelectTrigger><SelectValue /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Easy">Easy</SelectItem>
                                <SelectItem value="Medium">Medium</SelectItem>
                                <SelectItem value="Hard">Hard</SelectItem>
                                <SelectItem value="Nightmare">Nightmare</SelectItem>
                            </SelectContent>
                        </Select>
                        <Button
                            className="w-full"
                            onClick={handleStart}
                            disabled={loading || !topic.trim()}
                        >
                            {loading ? <Loader2 className="animate-spin mr-2" /> : "Start Exam"}
                        </Button>
                    </CardContent>
                </Card>
            )}

            {exam && (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                    <div className="flex justify-between items-center bg-muted p-4 rounded-lg">
                        <h2 className="text-xl font-bold">{exam.examTitle}</h2>
                        {submitted && (
                            <div className="text-2xl font-bold text-primary">
                                Score: {score} / {exam.questions.length}
                            </div>
                        )}
                    </div>

                    {exam.questions.map((q, idx) => {
                        const isCorrect = submitted && userAnswers[q.id] === q.correctOptionIndex;
                        const isWrong = submitted && userAnswers[q.id] !== q.correctOptionIndex;
                        const userAnswer = userAnswers[q.id];

                        return (
                            <Card key={q.id} className={`transition-colors ${submitted ? (isCorrect ? 'border-green-500/50 bg-green-500/5' : (isWrong ? 'border-red-500/50 bg-red-500/5' : '')) : ''}`}>
                                <CardHeader className="py-4">
                                    <div className="flex justify-between">
                                        <CardTitle className="text-lg">Q{idx + 1}: {q.question}</CardTitle>
                                        {submitted && (
                                            isCorrect ? <CheckCircle className="text-green-500" /> : (isWrong ? <XCircle className="text-red-500" /> : null)
                                        )}
                                    </div>
                                </CardHeader>
                                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    {q.options.map((opt, i) => (
                                        <Button
                                            key={i}
                                            variant={userAnswer === i ? "default" : "outline"}
                                            className={`justify-start h-auto py-3 px-4 text-left whitespace-normal ${submitted && i === q.correctOptionIndex ? 'ring-2 ring-green-500' : ''
                                                } ${submitted && userAnswer === i && i !== q.correctOptionIndex ? 'bg-red-500 hover:bg-red-600' : ''
                                                }`}
                                            onClick={() => handleOptionSelect(q.id, i)}
                                            disabled={submitted}
                                        >
                                            <span className="font-bold mr-2">{String.fromCharCode(65 + i)}.</span> {opt}
                                        </Button>
                                    ))}
                                </CardContent>
                            </Card>
                        );
                    })}

                    {!submitted && (
                        <div className="sticky bottom-6 z-10">
                            <Button size="lg" className="w-full shadow-xl" onClick={handleSubmit}>
                                Submit Exam
                            </Button>
                        </div>
                    )}

                    {submitted && (
                        <Button size="lg" variant="outline" className="w-full" onClick={() => setExam(null)}>
                            Take Another Exam
                        </Button>
                    )}
                </motion.div>
            )}
        </div>
    );
}
