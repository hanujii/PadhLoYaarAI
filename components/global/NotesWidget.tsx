'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { NotesEditor } from '@/components/global/NotesEditor';
import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetClose } from '@/components/ui/sheet';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { StickyNote, Maximize2, Minimize2, X } from 'lucide-react';
import { useHistoryStore } from '@/lib/history-store';
import { useStore } from '@/lib/store';
import dynamic from 'next/dynamic';
import { cn } from '@/lib/utils';
import { useTheme } from 'next-themes';

// Dynamically import Tldraw to avoid SSR issues
const Tldraw = dynamic(async () => (await import('tldraw')).Tldraw, {
    ssr: false,
    loading: () => <div className="w-full h-full flex items-center justify-center text-muted-foreground">Loading Canvas...</div>
});

export function NotesWidget() {
    const { notes, notesTitle, updateNotes, updateNotesTitle } = useHistoryStore();
    // Using global store for open state to coordinate with other UI elements
    const { isNotesOpen, setNotesOpen } = useStore();

    const [isExpanded, setIsExpanded] = useState(false);
    const [activeTab, setActiveTab] = useState('text');
    const { theme } = useTheme();

    // Local state for immediate feedback
    const [localNotes, setLocalNotes] = useState(notes || '');
    const [localTitle, setLocalTitle] = useState(notesTitle || '');

    // Sync on mount and when store updates
    useEffect(() => {
        setLocalNotes(notes || '');
        setLocalTitle(notesTitle || '');
    }, [notes, notesTitle]);

    // Cleanup: Save notes when component unmounts
    useEffect(() => {
        return () => {
            // Ensure notes are saved before unmount
            if (localNotes !== notes) {
                updateNotes(localNotes);
            }
            if (localTitle !== notesTitle) {
                updateNotesTitle(localTitle);
            }
        };
    }, [localNotes, localTitle, notes, notesTitle, updateNotes, updateNotesTitle]);

    const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        setLocalTitle(val);
        updateNotesTitle(val);
    };

    const handleNotesChange = (content: string) => {
        setLocalNotes(content);
        updateNotes(content);
    };

    const toggleExpand = () => {
        setIsExpanded(!isExpanded);
    };

    return (
        <div className="fixed bottom-6 right-6 z-50">
            <Sheet open={isNotesOpen} onOpenChange={setNotesOpen}>
                <SheetTrigger asChild>
                    <Button
                        size="icon"
                        className="h-14 w-14 rounded-full shadow-lg hover:shadow-xl transition-all bg-background border hover:bg-muted text-foreground"
                        aria-label="Open scratch pad"
                        title="Scratch Pad"
                    >
                        <StickyNote className="h-6 w-6" />
                    </Button>
                </SheetTrigger>
                <SheetContent
                    side="right"
                    className={cn(
                        "flex flex-col p-0 border-l transition-all duration-300",
                        isExpanded ? "w-[100vw] sm:w-[100vw] sm:max-w-none" : "w-[400px] sm:w-[540px] sm:max-w-md"
                    )}
                    // Disable default close button to use our custom consistent one
                    hideDefaultClose={true}
                >
                    <SheetTitle className="sr-only">Scratch Pad</SheetTitle>
                    <div className="flex-1 flex flex-col bg-background h-full">
                        {/* Header */}
                        <div className="pt-6 px-6 pb-2 border-b flex justify-between items-center bg-muted/10">
                            <div className="flex-1 flex items-center gap-2">
                                <div className="text-xl">📝</div>
                                <input
                                    type="text"
                                    value={localTitle}
                                    onChange={handleTitleChange}
                                    placeholder="Untitled Note"
                                    className="w-full text-lg font-bold bg-transparent border-none focus:outline-none focus:ring-0 placeholder:text-muted-foreground/50 text-foreground truncate"
                                />
                            </div>

                            {/* Window Controls - Aligned Group */}
                            <div className="flex items-center gap-1">
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={toggleExpand}
                                    title={isExpanded ? "Collapse" : "Maximize"}
                                    aria-label={isExpanded ? "Collapse scratch pad" : "Maximize scratch pad"}
                                    className="h-8 w-8 text-muted-foreground hover:text-foreground"
                                >
                                    {isExpanded ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
                                </Button>

                                <SheetClose asChild>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                                    >
                                        <X className="h-4 w-4" />
                                        <span className="sr-only">Close</span>
                                    </Button>
                                </SheetClose>
                            </div>
                        </div>

                        {/* Content */}
                        <div className="flex-1 overflow-hidden relative">
                            <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
                                <div className="px-6 py-2 bg-muted/20 border-b">
                                    <TabsList className="grid w-full grid-cols-2 max-w-[200px]">
                                        <TabsTrigger value="text">Text Note</TabsTrigger>
                                        <TabsTrigger value="canvas">Whiteboard</TabsTrigger>
                                    </TabsList>
                                </div>

                                <TabsContent value="text" className="flex-1 p-0 m-0 h-full overflow-hidden">
                                    <div className="h-full w-full px-0 py-0 overflow-hidden">
                                        <NotesEditor
                                            content={localNotes}
                                            onChange={handleNotesChange}
                                        />
                                    </div>
                                </TabsContent>

                                <TabsContent value="canvas" className="flex-1 p-0 m-0 h-full relative isolate">
                                    {/* Tldraw Whiteboard */}
                                    <div className="absolute inset-0 w-full h-full bg-white">
                                        {/* Force white background container for tldraw to ensure visibility */}
                                        <Tldraw persistenceKey="scratchpad-whiteboard" />
                                    </div>
                                </TabsContent>
                            </Tabs>
                        </div>

                        {/* Footer (Text Mode Only) */}
                        {activeTab === 'text' && (
                            <div className="px-4 py-2 text-xs text-muted-foreground border-t bg-muted/20 flex justify-between items-center">
                                <span>Markdown supported</span>
                                <span>{(localNotes || '').length} chars</span>
                            </div>
                        )}
                    </div>
                </SheetContent>
            </Sheet>
        </div>
    );
}
