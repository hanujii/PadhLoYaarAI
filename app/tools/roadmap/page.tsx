'use client';

import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { generateRoadmap } from './actions';
import { Loader2, Map as MapIcon, Calendar, Clock, CheckCircle2, BookOpen } from 'lucide-react';
import { DownloadPDFButton } from '@/components/global/DownloadPDFButton';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useHistoryStore } from '@/lib/history-store';
import { ToolBackButton } from '@/components/global/ToolBackButton';

interface DayPlan {
    day: number;
    title: string;
    tasks: string[];
    resources?: string[];
    tip?: string;
}

export default function RoadmapPage() {
    const [loading, setLoading] = useState(false);
    const [roadmap, setRoadmap] = useState<DayPlan[] | null>(null);
    const outputRef = useRef<HTMLDivElement>(null);
    const { addToHistory } = useHistoryStore();

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setLoading(true);
        setRoadmap(null);

        const formData = new FormData(event.currentTarget);
        const result = await generateRoadmap(formData);

        if (result.success && result.data) {
            setRoadmap(result.data);
            addToHistory({
                type: 'generation',
                tool: 'Roadmap Architect',
                query: `Goal: ${formData.get('goal')}, Days: ${formData.get('days')}`,
                result: JSON.stringify(result.data, null, 2)
            });
        } else {
            alert(result.error);
        }
        setLoading(false);
    }

    return (
        <div className="max-w-4xl mx-auto space-y-8 px-4 md:px-0">
            <ToolBackButton />
            <div className="space-y-2 text-center">
                <h1 className="text-3xl font-bold flex items-center justify-center gap-2">
                    <MapIcon className="w-8 h-8 text-blue-600" />
                    Roadmap Architect
                </h1>
                <p className="text-muted-foreground">Turn a syllabus or goal into a day-by-day action plan.</p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Define Your Goal</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-2 md:col-span-2">
                            <Label htmlFor="goal">What do you want to learn?</Label>
                            <Input name="goal" id="goal" placeholder="e.g. Master React Hooks, Complete Class 10 History, Learn Python Basics" required />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="days">Duration (Days)</Label>
                            <Input name="days" id="days" type="number" min="1" max="60" placeholder="7" required />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="hours">Hours per Day</Label>
                            <Input name="hours" id="hours" type="number" min="1" max="12" placeholder="2" />
                        </div>
                        <div className="md:col-span-2">
                            <Button type="submit" className="w-full" disabled={loading}>
                                {loading ? <Loader2 className="animate-spin mr-2" /> : <Calendar className="w-4 h-4 mr-2" />}
                                {loading ? 'Planning your success...' : 'Generate Roadmap'}
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>

            {roadmap && (
                <div className="space-y-4">
                    <div className="flex justify-end">
                        <DownloadPDFButton targetRef={outputRef} filename="study-roadmap.pdf" buttonText="Download Plan" />
                    </div>

                    <div ref={outputRef} className="space-y-8 relative border-l-2 border-primary/20 ml-6 pl-8 py-4">
                        {roadmap.map((day, index) => (
                            <motion.div
                                key={day.day}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="relative"
                            >
                                <div className="absolute -left-[41px] top-0 bg-background border-2 border-primary rounded-full w-6 h-6 flex items-center justify-center z-10">
                                    <div className="w-2 h-2 bg-primary rounded-full" />
                                </div>

                                <Card className="overflow-hidden">
                                    <CardHeader className="pb-3 bg-muted/30">
                                        <div className="flex items-center justify-between">
                                            <CardTitle className="text-lg text-primary flex items-center gap-2">
                                                <span className="font-mono text-sm bg-primary/10 text-primary px-2 py-1 rounded">DAY {day.day}</span>
                                                {day.title}
                                            </CardTitle>
                                            <Clock className="w-4 h-4 text-muted-foreground" />
                                        </div>
                                    </CardHeader>
                                    <CardContent className="pt-4 space-y-4">
                                        <div className="space-y-2">
                                            <h4 className="text-sm font-semibold flex items-center gap-2 text-muted-foreground">
                                                <CheckCircle2 className="w-4 h-4" /> TASKS
                                            </h4>
                                            <ul className="grid gap-2">
                                                {day.tasks.map((task, i) => (
                                                    <li key={i} className="flex items-start justify-between gap-2 text-sm bg-card border p-2 rounded-md hover:border-primary/50 transition-colors group">
                                                        <span>{task}</span>
                                                        <Button asChild variant="ghost" size="icon" className="h-6 w-6 opacity-0 group-hover:opacity-100" title="Get Help">
                                                            <Link href={`/tools/tutor?topic=${encodeURIComponent(task)}`}>
                                                                <BookOpen className="w-3 h-3" />
                                                            </Link>
                                                        </Button>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>

                                        {day.resources && day.resources.length > 0 && (
                                            <div className="space-y-2">
                                                <h4 className="text-sm font-semibold flex items-center gap-2 text-muted-foreground">
                                                    <BookOpen className="w-4 h-4" /> RESOURCES
                                                </h4>
                                                <div className="flex flex-wrap gap-2">
                                                    {day.resources.map((res, i) => (
                                                        <a
                                                            key={i}
                                                            href={`https://www.google.com/search?q=${encodeURIComponent(res)}`}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="text-xs bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 px-2 py-1 rounded-full hover:underline border border-blue-100 dark:border-blue-900"
                                                        >
                                                            {res}
                                                        </a>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        {day.tip && (
                                            <div className="bg-yellow-50 dark:bg-yellow-900/10 border border-yellow-200 dark:border-yellow-900 p-3 rounded-lg text-sm text-yellow-800 dark:text-yellow-200 italic flex gap-2">
                                                <span className="font-bold not-italic">💡 Tip:</span> {day.tip}
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>
                            </motion.div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
