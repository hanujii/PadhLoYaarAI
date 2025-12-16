'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { parseSyllabus } from './actions';
import { Loader2, ShieldCheck, Upload, CheckSquare } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { useHistoryStore } from '@/lib/history-store';
import { ToolBackButton } from '@/components/global/ToolBackButton';

export default function SyllabusPage() {
    const [loading, setLoading] = useState(false);
    const [topics, setTopics] = useState<string[]>([]);
    const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});

    const { addToHistory } = useHistoryStore();

    // Load from local storage on mount
    useEffect(() => {
        const savedTopics = localStorage.getItem('syllabus_topics');
        const savedChecked = localStorage.getItem('syllabus_checked'); // This will become less relevant
        if (savedTopics) {
            const parsedTopics = JSON.parse(savedTopics);
            // Ensure topics are in the new object format, or convert old string[] format
            if (parsedTopics.length > 0 && typeof parsedTopics[0] === 'string') {
                setTopics(parsedTopics.map((t: string) => ({ title: t, completed: false })));
            } else {
                setTopics(parsedTopics);
            }
        }
        if (savedChecked) setCheckedItems(JSON.parse(savedChecked));
    }, []);

    // Save to local storage whenever state changes
    useEffect(() => {
        if (topics.length > 0) localStorage.setItem('syllabus_topics', JSON.stringify(topics));
        // The checkedItems state is now redundant as completion status is stored within topics.
        // We'll keep saving it for now to match the original structure, but it won't be used for display.
        localStorage.setItem('syllabus_checked', JSON.stringify(checkedItems));
    }, [topics, checkedItems]);

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setLoading(true);
        const formData = new FormData(event.currentTarget);
        const result = await parseSyllabus(formData);

        if (result.success && result.data) {
            const newTopics = result.data.map((t: string) => ({ title: t, completed: false }));
            setTopics(newTopics);
            setCheckedItems({}); // Reset progress on new upload
            localStorage.setItem('syllabus_topics', JSON.stringify(newTopics)); // Explicitly save new format

            const file = formData.get('file') as File;
            addToHistory({
                type: 'generation',
                tool: 'Syllabus Sentinel',
                query: `Syllabus File: ${file?.name}`,
                result: `Extracted ${newTopics.length} topics.`
            });
        } else if (result.error) {
            alert(result.error);
        }
        setLoading(false);
    }

    const toggleItem = (topic: string) => {
        setCheckedItems(prev => ({ ...prev, [topic]: !prev[topic] }));
    };

    const completedCount = Object.values(checkedItems).filter(Boolean).length;
    const progress = topics.length > 0 ? (completedCount / topics.length) * 100 : 0;

    const resetSyllabus = () => {
        if (confirm("Are you sure you want to clear your syllabus and progress?")) {
            setTopics([]);
            setCheckedItems({});
            localStorage.removeItem('syllabus_topics');
            localStorage.removeItem('syllabus_checked');
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8 px-4 md:px-0">
            <ToolBackButton />
            <div className="space-y-2 text-center">
                <h1 className="text-3xl font-bold flex items-center justify-center gap-2">
                    <ShieldCheck className="w-8 h-8 text-green-600" />
                    Syllabus Sentinel
                </h1>
                <p className="text-muted-foreground">Upload your exam syllabus and track your mastery.</p>
            </div>

            {topics.length === 0 ? (
                <Card>
                    <CardHeader>
                        <CardTitle>Upload Official Syllabus (PDF)</CardTitle>
                        <CardDescription>We will extract the topics so you can track them.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="flex gap-4 items-center">
                            <Input name="file" type="file" accept=".pdf" required className="cursor-pointer" />
                            <Button type="submit" disabled={loading}>
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
                                <span>Progress: {Math.round(progress)}%</span>
                                <span>{completedCount}/{topics.length} Topics</span>
                            </div>
                            <Progress value={progress} className="h-4" />
                        </CardContent>
                    </Card>

                    <div className="grid gap-2">
                        {topics.map((topic, i) => (
                            <div
                                key={i}
                                className={`flex items-center gap-3 p-3 rounded-lg border transition-colors cursor-pointer ${checkedItems[topic] ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-900' : 'bg-card hover:bg-muted'}`}
                                onClick={() => toggleItem(topic)}
                            >
                                <div className={`w-5 h-5 rounded border flex items-center justify-center ${checkedItems[topic] ? 'bg-green-600 border-green-600 text-white' : 'border-muted-foreground'}`}>
                                    {checkedItems[topic] && <CheckSquare className="w-3.5 h-3.5" />}
                                </div>
                                <span className={checkedItems[topic] ? 'text-muted-foreground line-through' : ''}>
                                    {topic}
                                </span>
                            </div>
                        ))}
                    </div>

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
