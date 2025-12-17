'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle2, XCircle } from 'lucide-react';
import { motion } from 'framer-motion';

export interface Question {
    question: string;
    options: string[];
    answer: string; // The correct option text
    clarification?: string; // Optional explanation
}

export function QuizRenderer({ questions }: { questions: Question[] }) {
    const [selectedOptions, setSelectedOptions] = useState<Record<number, string>>({});
    const [showResults, setShowResults] = useState<Record<number, boolean>>({});

    const handleSelect = (qIndex: number, option: string) => {
        if (showResults[qIndex]) return; // distinct selection after reveal
        setSelectedOptions(prev => ({ ...prev, [qIndex]: option }));
    };

    const checkAnswer = (qIndex: number) => {
        setShowResults(prev => ({ ...prev, [qIndex]: true }));
    };

    return (
        <div className="space-y-6">
            {questions.map((q, i) => (
                <Card key={i} className="border-2">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-lg flex gap-2">
                            <span className="text-primary/80">Q{i + 1}.</span> {q.question}
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                            {q.options.map((opt, idx) => {
                                const isSelected = selectedOptions[i] === opt;
                                const isCorrect = opt === q.answer;
                                const isWrong = isSelected && !isCorrect;
                                const show = showResults[i];

                                let variant = "outline";
                                let className = "justify-start text-left h-auto py-3 px-4";

                                if (show) {
                                    if (isCorrect) className += " bg-green-100 dark:bg-green-900/30 border-green-500 text-green-700 dark:text-green-300";
                                    else if (isWrong) className += " bg-red-100 dark:bg-red-900/30 border-red-500 text-red-700 dark:text-red-300";
                                    else className += " opacity-50";
                                } else {
                                    if (isSelected) className += " border-primary bg-primary/5 ring-1 ring-primary";
                                }

                                return (
                                    <Button
                                        key={idx}
                                        variant="ghost"
                                        className={className}
                                        onClick={() => handleSelect(i, opt)}
                                        disabled={show}
                                    >
                                        <div className="flex items-center gap-2 w-full">
                                            <span className="w-6 h-6 rounded-full border flex items-center justify-center text-xs shrink-0">
                                                {String.fromCharCode(65 + idx)}
                                            </span>
                                            <span className="flex-1">{opt}</span>
                                            {show && isCorrect && <CheckCircle2 className="w-4 h-4 text-green-600" />}
                                            {show && isWrong && <XCircle className="w-4 h-4 text-red-600" />}
                                        </div>
                                    </Button>
                                );
                            })}
                        </div>

                        {!showResults[i] && selectedOptions[i] && (
                            <div className="flex justify-end mt-2">
                                <Button size="sm" onClick={() => checkAnswer(i)}>Check Answer</Button>
                            </div>
                        )}

                        {showResults[i] && q.clarification && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                className="mt-2 p-3 bg-muted rounded-lg text-sm"
                            >
                                <span className="font-semibold">Explanation:</span> {q.clarification}
                            </motion.div>
                        )}
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}
