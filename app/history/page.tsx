'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { useHistoryStore } from '@/lib/history-store';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Trash2, Copy, Bookmark, Clock, Check, Maximize2, Loader2 } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from '@/components/ui/dialog';

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { DownloadPDFButton } from '@/components/global/DownloadPDFButton';
import { motion, AnimatePresence } from 'framer-motion';
import { SearchBar } from '@/components/history/SearchBar';
import { FilterPanel } from '@/components/history/FilterPanel';
import { ExportDialog } from '@/components/history/ExportDialog';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';

export default function HistoryPage() {
    const router = useRouter();
    const [isAuthChecking, setIsAuthChecking] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    const {
        history,
        savedItems,
        removeFromHistory,
        removeFromSaved,
        saveItem,
        isLoading,
        loadFromSupabase,
    } = useHistoryStore();

    const [copiedId, setCopiedId] = React.useState<string | null>(null);
    const [selectedItem, setSelectedItem] = React.useState<any>(null);
    const contentRef = React.useRef<HTMLDivElement>(null);

    // Search and filter state
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedTools, setSelectedTools] = useState<Set<string>>(new Set());

    // Auth check and load history
    useEffect(() => {
        const checkAuthAndLoad = async () => {
            const supabase = createClient();
            const { data: { session } } = await supabase.auth.getSession();

            if (!session) {
                router.push('/login?redirect=/history');
                return;
            }

            setIsAuthenticated(true);
            setIsAuthChecking(false);

            // Load history for authenticated user
            await loadFromSupabase(session.user.id);
        };

        checkAuthAndLoad();
    }, [router, loadFromSupabase]);

    const handleCopy = (text: string, id: string) => {
        navigator.clipboard.writeText(text);
        setCopiedId(id);
        setTimeout(() => setCopiedId(null), 2000);
    };

    const handleSaveFromHistory = (item: any) => {
        const content = item.tool === 'code-transformer' || item.tool === 'cheat-sheet' || item.tool === 'exam-generator'
            ? item.result
            : `Query: ${item.query}\n\nResult:\n${item.result}`;
        saveItem({
            type: 'result',
            title: `Saved ${item.tool} Result`,
            content: content,
        });
    };

    // Toggle tool filter
    const handleToggleTool = (tool: string) => {
        const newFilters = new Set(selectedTools);
        if (newFilters.has(tool)) {
            newFilters.delete(tool);
        } else {
            newFilters.add(tool);
        }
        setSelectedTools(newFilters);
    };

    // Clear all filters
    const handleClearFilters = () => {
        setSelectedTools(new Set());
    };

    // Filter and search history
    const filteredHistory = useMemo(() => {
        let filtered = history;

        // Apply search filter
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            filtered = filtered.filter(item =>
                item.query.toLowerCase().includes(query) ||
                item.result.toLowerCase().includes(query) ||
                item.tool.toLowerCase().includes(query)
            );
        }

        // Apply tool filter
        if (selectedTools.size > 0) {
            filtered = filtered.filter(item => selectedTools.has(item.tool));
        }

        return filtered;
    }, [history, searchQuery, selectedTools]);

    // Show loading while checking auth
    if (isAuthChecking) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    if (!isAuthenticated) {
        return null;
    }

    return (
        <div className="container mx-auto max-w-6xl py-8 px-4">
            <div className="flex items-center justify-between mb-8">
                <h1 className="text-3xl font-bold">My Library</h1>
            </div>

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
                        Recent History ({filteredHistory.length})
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="saved" className="mt-6">
                    {/* Export button for saved items */}
                    <div className="flex justify-end mb-4">
                        <ExportDialog items={savedItems as any} type="saved" />
                    </div>

                    <AnimatePresence mode="popLayout">
                        {savedItems.length === 0 ? (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="text-center py-12 text-muted-foreground border-2 border-dashed rounded-lg"
                            >
                                <Bookmark className="w-12 h-12 mx-auto mb-3 opacity-20" />
                                <p>No saved items yet.</p>
                            </motion.div>
                        ) : (
                            <div className="space-y-4">
                                {savedItems.map((item) => (
                                    <motion.div
                                        key={item.id}
                                        layout
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.95 }}
                                        transition={{ duration: 0.2 }}
                                    >
                                        <Card>
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
                                                <div className="bg-muted/50 p-4 rounded-md text-sm max-h-96 overflow-y-auto prose dark:prose-invert max-w-none">
                                                    <ReactMarkdown remarkPlugins={[remarkGfm]}>{item.content}</ReactMarkdown>
                                                </div>
                                            </CardContent>
                                            <CardFooter className="justify-end gap-2">
                                                <Button size="sm" variant="outline" onClick={() => handleCopy(item.content, item.id)}>
                                                    {copiedId === item.id ? <Check className="w-4 h-4 mr-2" /> : <Copy className="w-4 h-4 mr-2" />}
                                                    {copiedId === item.id ? 'Copied' : 'Copy'}
                                                </Button>
                                                <Button size="sm" onClick={() => setSelectedItem({ ...item, isSaved: true })}>
                                                    <Maximize2 className="w-4 h-4 mr-2" />
                                                    Expand
                                                </Button>
                                            </CardFooter>
                                        </Card>
                                    </motion.div>
                                ))}
                            </div>
                        )}
                    </AnimatePresence>
                </TabsContent>

                <TabsContent value="history" className="mt-6">
                    {/* Search and Filter Controls */}
                    <div className="flex gap-4 mb-6">
                        <div className="flex-1">
                            <SearchBar
                                value={searchQuery}
                                onChange={setSearchQuery}
                                placeholder="Search by query, result, or tool..."
                            />
                        </div>
                        <FilterPanel
                            selectedTools={selectedTools}
                            onToggleTool={handleToggleTool}
                            onClearFilters={handleClearFilters}
                        />
                        <ExportDialog items={filteredHistory} type="history" />
                    </div>

                    {isLoading ? (
                        <div className="flex items-center justify-center py-12">
                            <Loader2 className="h-8 w-8 animate-spin text-primary" />
                            <span className="ml-3 text-muted-foreground">Loading history...</span>
                        </div>
                    ) : (
                        <AnimatePresence mode="popLayout">
                            {filteredHistory.length === 0 ? (
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="text-center py-12 text-muted-foreground border-2 border-dashed rounded-lg"
                                >
                                    <Clock className="w-12 h-12 mx-auto mb-3 opacity-20" />
                                    <p>{history.length === 0 ? 'No recent history found.' : 'No results match your search.'}</p>
                                    {(searchQuery || selectedTools.size > 0) && (
                                        <Button
                                            variant="link"
                                            className="mt-2"
                                            onClick={() => {
                                                setSearchQuery('');
                                                handleClearFilters();
                                            }}
                                        >
                                            Clear filters
                                        </Button>
                                    )}
                                </motion.div>
                            ) : (
                                <div className="space-y-4">
                                    {filteredHistory.map((item) => (
                                        <motion.div
                                            key={item.id}
                                            layout
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: 20 }}
                                            transition={{ duration: 0.2 }}
                                        >
                                            <Card>
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
                                                    <div
                                                        className="bg-muted/30 p-3 rounded text-sm text-muted-foreground line-clamp-3 cursor-pointer hover:bg-muted/50 transition-colors prose dark:prose-invert max-w-none"
                                                        onClick={() => setSelectedItem({
                                                            id: item.id,
                                                            title: `History: ${item.tool}`,
                                                            content: `Query: ${item.query}\n\nResult:\n${item.result}`,
                                                            timestamp: item.timestamp,
                                                            isSaved: false
                                                        })}
                                                    >
                                                        <ReactMarkdown remarkPlugins={[remarkGfm]}>{item.result}</ReactMarkdown>
                                                    </div>
                                                </CardContent>
                                                <CardFooter className="justify-end gap-2 pt-0">
                                                    <Button size="sm" variant="secondary" onClick={() => setSelectedItem({
                                                        id: item.id,
                                                        title: `History: ${item.tool}`,
                                                        content: `Query: ${item.query}\n\nResult:\n${item.result}`,
                                                        timestamp: item.timestamp,
                                                        isSaved: false
                                                    })}>
                                                        <Maximize2 className="w-3 h-3 mr-2" />
                                                        View Full
                                                    </Button>
                                                    <Button variant="ghost" size="sm" onClick={() => removeFromHistory(item.id)}>
                                                        <Trash2 className="w-4 h-4 text-destructive" />
                                                    </Button>
                                                    <Button variant="outline" size="sm" onClick={() => handleSaveFromHistory(item)}>
                                                        <Bookmark className="w-3 h-3 mr-2" />
                                                        Save
                                                    </Button>
                                                </CardFooter>
                                            </Card>
                                        </motion.div>
                                    ))}
                                </div>
                            )}
                        </AnimatePresence>
                    )}
                </TabsContent>
            </Tabs>

            {/* Full Content Dialog */}
            <Dialog open={!!selectedItem} onOpenChange={(open: boolean) => !open && setSelectedItem(null)}>
                <DialogContent className="max-w-4xl max-h-[85vh] flex flex-col">
                    <DialogHeader>
                        <div className="flex items-center justify-between pr-8">
                            <DialogTitle className="text-xl">{selectedItem?.title}</DialogTitle>
                            {selectedItem && (
                                <DownloadPDFButton
                                    targetRef={contentRef}
                                    filename={`${selectedItem.title.replace(/\s+/g, '-').toLowerCase()}.pdf`}
                                    size="sm"
                                    variant="outline"
                                />
                            )}
                        </div>
                        <DialogDescription>
                            {selectedItem?.timestamp && formatDistanceToNow(selectedItem.timestamp, { addSuffix: true })}
                        </DialogDescription>
                    </DialogHeader>

                    <div className="flex-1 overflow-y-auto p-6 bg-background border rounded-md">
                        <div ref={contentRef as any} className="prose dark:prose-invert max-w-none break-words whitespace-pre-wrap">
                            <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                {selectedItem?.content || ''}
                            </ReactMarkdown>
                        </div>
                    </div>

                    <DialogFooter className="gap-2 sm:justify-between w-full">
                        <div className="text-xs text-muted-foreground self-center italic hidden sm:block">
                            Formatted with Markdown
                        </div>
                        <div className="flex gap-2">
                            <Button variant="outline" onClick={() => handleCopy(selectedItem?.content || '', selectedItem?.id)}>
                                {copiedId === selectedItem?.id ? <Check className="w-4 h-4 mr-2" /> : <Copy className="w-4 h-4 mr-2" />}
                                {copiedId === selectedItem?.id ? 'Copied' : 'Copy Content'}
                            </Button>
                            <Button onClick={() => setSelectedItem(null)}>Close</Button>
                        </div>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
