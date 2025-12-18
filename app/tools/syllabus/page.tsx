'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { parseSyllabus } from './actions';
import { Loader2, ShieldCheck, Upload, CheckSquare, Clock } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { useHistoryStore } from '@/lib/history-store';
import { ToolBackButton } from '@/components/global/ToolBackButton';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

type Unit = {
    unit: string;
    hours: string;
    topics: string[];
};

export default function SyllabusPage() {
    const [loading, setLoading] = useState(false);
    const [units, setUnits] = useState<Unit[]>([]);
    const [completedTopics, setCompletedTopics] = useState<Record<string, boolean>>({});

    const { addToHistory } = useHistoryStore();

    // Load from local storage
    useEffect(() => {
        const savedUnits = localStorage.getItem('syllabus_units');
        const savedProgress = localStorage.getItem('syllabus_progress');

        if (savedUnits) setUnits(JSON.parse(savedUnits));
        if (savedProgress) setCompletedTopics(JSON.parse(savedProgress));
    }, []);

    // Save to local storage
    useEffect(() => {
        if (units.length > 0) localStorage.setItem('syllabus_units', JSON.stringify(units));
        localStorage.setItem('syllabus_progress', JSON.stringify(completedTopics));
    }, [units, completedTopics]);

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setLoading(true);
        const formData = new FormData(event.currentTarget);
        const result = await parseSyllabus(formData);

        if (result.success && result.data) {
            setUnits(result.data);
            setCompletedTopics({});
            localStorage.setItem('syllabus_units', JSON.stringify(result.data));

            const file = formData.get('file') as File;
            addToHistory({
                type: 'generation',
                tool: 'Syllabus Sentinel',
                query: `Syllabus File: ${file?.name}`,
                result: `Extracted ${result.data.length} units.`
            });
        } else if (result.error) {
            alert(result.error);
        }
        setLoading(false);
    }

    const toggleTopic = (unitIndex: number, topic: string) => {
        const key = `${unitIndex}-${topic}`;
        setCompletedTopics(prev => ({ ...prev, [key]: !prev[key] }));
    };

    // Calculate progress
    const totalTopics = units.reduce((acc, unit) => acc + unit.topics.length, 0);
    const completedCount = Object.values(completedTopics).filter(Boolean).length;
    const progress = totalTopics > 0 ? (completedCount / totalTopics) * 100 : 0;

    const resetSyllabus = () => {
        if (confirm("Are you sure? This will delete your syllabus track.")) {
            setUnits([]);
            setCompletedTopics({});
            localStorage.removeItem('syllabus_units');
            localStorage.removeItem('syllabus_progress');
        }
    };

    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 sm:space-y-8 pb-16 sm:pb-20">
            <ToolBackButton />
            <div className="space-y-2 text-center">
                <h1 className="text-2xl xs:text-3xl sm:text-3xl font-bold flex items-center justify-center gap-2 flex-wrap">
                    <ShieldCheck className="w-6 h-6 sm:w-8 sm:h-8 text-green-600" />
                    Syllabus Sentinel
                </h1>
                <p className="text-sm sm:text-base text-muted-foreground">Upload your exam syllabus and track your mastery.</p>
            </div>

            {units.length === 0 ? (
                <Card>
                    <CardHeader className="pb-3 sm:pb-4">
                        <CardTitle className="text-lg sm:text-xl">Upload Official Syllabus (PDF)</CardTitle>
                        <CardDescription className="text-sm">We will extract the topics so you can track them.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="flex flex-col  sm:flex-row gap-3 sm:gap-4 items-stretch sm:items-center">
                            <Input name="file" type="file" accept=".pdf" required className="cursor-pointer h-10 sm:h-11" />
                            <Button type="submit" disabled={loading} className="h-10 sm:h-11 touch-target shrink-0">
                                {loading ? <Loader2 className="animate-spin" /> : <><Upload className="w-4 h-4 mr-2" /> Analyze</>}
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            ) : (
                <div className="space-y-6">
                    <Card className="border-2 border-primary/20 bg-primary/5">
                        <CardContent className="pt-6">
                            <div className="flex justify-between text-sm font-medium mb-2">
                                <span>Total Mastery: {Math.round(progress)}%</span>
                                <span>{completedCount}/{totalTopics} Topics</span>
                            </div>
                            <Progress value={progress} className="h-4" />
                        </CardContent>
                    </Card>

                    <Accordion type="single" collapsible className="w-full space-y-4">
                        {units.map((unit, i) => (
                            <AccordionItem key={i} value={`unit-${i}`} className="border rounded-lg px-4 bg-card">
                                <AccordionTrigger className="hover:no-underline">
                                    <div className="flex items-center gap-4 text-left w-full">
                                        <div className="flex-1">
                                            <div className="font-semibold">{unit.unit}</div>
                                            <div className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                                                <Clock className="w-3 h-3" /> {unit.hours}
                                            </div>
                                        </div>
                                        <div className="text-xs font-mono bg-muted px-2 py-1 rounded">
                                            {unit.topics.filter(t => completedTopics[`${i}-${t}`]).length}/{unit.topics.length}
                                        </div>
                                    </div>
                                </AccordionTrigger>
                                <AccordionContent>
                                    <div className="grid gap-2 pt-2 pb-4">
                                        {unit.topics.map((topic, j) => {
                                            const key = `${i}-${topic}`;
                                            const isDone = completedTopics[key];
                                            return (
                                                <div
                                                    key={j}
                                                    onClick={() => toggleTopic(i, topic)}
                                                    className={`flex items-center gap-3 p-3 rounded-lg border transition-colors cursor-pointer ${isDone ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-900/50' : 'bg-background hover:bg-muted'}`}
                                                >
                                                    <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${isDone ? 'bg-green-600 border-green-600 text-white' : 'border-muted-foreground'}`}>
                                                        {isDone && <CheckSquare className="w-3.5 h-3.5" />}
                                                    </div>
                                                    <span className={`text-sm ${isDone ? 'text-muted-foreground line-through' : ''}`}>
                                                        {topic}
                                                    </span>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </AccordionContent>
                            </AccordionItem>
                        ))}
                    </Accordion>

                    <div className="flex justify-center pt-8">
                        <Button variant="ghost" className="text-destructive hover:text-destructive hover:bg-destructive/10" onClick={resetSyllabus}>
                            Reset / Upload New Syllabus
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
}
