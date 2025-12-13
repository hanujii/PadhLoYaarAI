'use client';

import React from 'react';
import { useHistoryStore } from '@/lib/history-store';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Trash2, Copy, Bookmark, Clock, Check } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

export default function HistoryPage() {
    const { history, savedItems, removeFromHistory, removeFromSaved, saveItem } = useHistoryStore();
    const [copiedId, setCopiedId] = React.useState<string | null>(null);

    const handleCopy = (text: string, id: string) => {
        navigator.clipboard.writeText(text);
        setCopiedId(id);
        setTimeout(() => setCopiedId(null), 2000);
    };

    const handleSaveFromHistory = (item: any) => {
        saveItem({
            type: 'result',
            title: `Saved ${item.tool} Result`,
            content: `Query: ${item.query}\n\nResult:\n${item.result}`,
        });
    };

    return (
        <div className="container mx-auto max-w-4xl py-8">
            <h1 className="text-3xl font-bold mb-8">My Library</h1>

            <Tabs defaultValue="saved" className="w-full">
                <TabsList className="w-full justify-start border-b rounded-none h-auto p-0 bg-transparent gap-6">
                    <TabsTrigger
                        value="saved"
                        className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-4 py-2"
                    >
                        Saved Items ({savedItems.length})
                    </TabsTrigger>
                    <TabsTrigger
                        value="history"
                        className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-4 py-2"
                    >
                        Recent History ({history.length})
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="saved" className="mt-6 space-y-4">
                    {savedItems.length === 0 ? (
                        <div className="text-center py-12 text-muted-foreground border-2 border-dashed rounded-lg">
                            <Bookmark className="w-12 h-12 mx-auto mb-3 opacity-20" />
                            <p>No saved items yet.</p>
                        </div>
                    ) : (
                        savedItems.map((item) => (
                            <Card key={item.id}>
                                <CardHeader>
                                    <CardTitle className="flex justify-between items-start text-lg">
                                        <span>{item.title}</span>
                                        <Button variant="ghost" size="icon" onClick={() => removeFromSaved(item.id)} className="text-destructive hover:text-destructive/90 hover:bg-destructive/10 -mt-2 -mr-2">
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                    </CardTitle>
                                    <CardDescription>
                                        Saved {formatDistanceToNow(item.timestamp, { addSuffix: true })}
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="bg-muted/50 p-4 rounded-md whitespace-pre-wrap text-sm font-mono max-h-60 overflow-y-auto">
                                        {item.content}
                                    </div>
                                </CardContent>
                                <CardFooter className="justify-end gap-2">
                                    <Button size="sm" variant="outline" onClick={() => handleCopy(item.content, item.id)}>
                                        {copiedId === item.id ? <Check className="w-4 h-4 mr-2" /> : <Copy className="w-4 h-4 mr-2" />}
                                        {copiedId === item.id ? 'Copied' : 'Copy Content'}
                                    </Button>
                                </CardFooter>
                            </Card>
                        ))
                    )}
                </TabsContent>

                <TabsContent value="history" className="mt-6 space-y-4">
                    {history.length === 0 ? (
                        <div className="text-center py-12 text-muted-foreground border-2 border-dashed rounded-lg">
                            <Clock className="w-12 h-12 mx-auto mb-3 opacity-20" />
                            <p>No recent history found.</p>
                        </div>
                    ) : (
                        history.map((item) => (
                            <Card key={item.id}>
                                <CardHeader>
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground bg-secondary px-2 py-1 rounded-sm mr-2">
                                                {item.tool}
                                            </span>
                                            <span className="text-sm text-foreground/80 font-medium">
                                                {item.query.length > 50 ? item.query.substring(0, 50) + '...' : item.query}
                                            </span>
                                        </div>
                                        <span className="text-xs text-muted-foreground whitespace-nowrap ml-4">
                                            {formatDistanceToNow(item.timestamp, { addSuffix: true })}
                                        </span>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div className="bg-muted/30 p-3 rounded text-sm text-muted-foreground line-clamp-3">
                                        {item.result}
                                    </div>
                                </CardContent>
                                <CardFooter className="justify-end gap-2 pt-0">
                                    <Button variant="ghost" size="sm" onClick={() => removeFromHistory(item.id)}>
                                        Delete
                                    </Button>
                                    <Button variant="outline" size="sm" onClick={() => handleSaveFromHistory(item)}>
                                        <Bookmark className="w-3 h-3 mr-2" />
                                        Save to Library
                                    </Button>
                                </CardFooter>
                            </Card>
                        ))
                    )}
                </TabsContent>
            </Tabs>
        </div>
    );
}
