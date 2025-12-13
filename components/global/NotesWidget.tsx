'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from '@/components/ui/sheet';
import { StickyNote, Save } from 'lucide-react';
import { useHistoryStore } from '@/lib/history-store';

export function NotesWidget() {
    const { notes, notesTitle, updateNotes, updateNotesTitle } = useHistoryStore();
    const [isOpen, setIsOpen] = useState(false);

    // Local state for immediate feedback
    const [localNotes, setLocalNotes] = useState(notes);
    const [localTitle, setLocalTitle] = useState(notesTitle);

    // Sync on mount
    useEffect(() => {
        // eslint-disable-next-line react-hooks/exhaustive-deps
        setLocalNotes(notes);
        setLocalTitle(notesTitle);
    }, [notes, notesTitle]);

    const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        setLocalTitle(val);
        updateNotesTitle(val);
    };

    const handleNotesChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const val = e.target.value;
        setLocalNotes(val);
        updateNotes(val);
    };

    return (
        <div className="fixed bottom-6 right-6 z-50">
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
                <SheetTrigger asChild>
                    <Button
                        size="icon"
                        className="h-14 w-14 rounded-full shadow-lg hover:shadow-xl transition-all bg-background border hover:bg-muted text-foreground"
                        title="Scratch Pad"
                    >
                        <StickyNote className="h-6 w-6" />
                    </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-[400px] sm:w-[540px] flex flex-col p-0 sm:max-w-md border-l">
                    <SheetTitle className="sr-only">Scratch Pad</SheetTitle>
                    <div className="flex-1 flex flex-col bg-background">
                        {/* Notion-like Header (Minimal) */}
                        <div className="pt-12 px-8 pb-4">
                            {/* Icon or Cover could go here */}
                            <div className="text-4xl mb-4">📝</div>
                            <input
                                type="text"
                                value={localTitle}
                                onChange={handleTitleChange}
                                placeholder="Untitled"
                                className="w-full text-4xl font-bold bg-transparent border-none focus:outline-none focus:ring-0 placeholder:text-muted-foreground/50 text-foreground"
                            />
                        </div>

                        {/* Body */}
                        <div className="flex-1 px-8 pb-8 overflow-y-auto">
                            <Textarea
                                value={localNotes}
                                onChange={handleNotesChange}
                                placeholder="Type something..." // 'Press '/' for commands' is too ambitious for now
                                className="w-full h-full min-h-[500px] resize-none bg-transparent border-none focus-visible:ring-0 p-0 text-base leading-relaxed selection:bg-primary/20"
                            />
                        </div>

                        {/* Footer / Status */}
                        <div className="px-4 py-2 text-xs text-muted-foreground border-t bg-muted/20 flex justify-between items-center">
                            <span>Markdown supported</span>
                            <span>{localNotes.length} chars</span>
                        </div>
                    </div>
                </SheetContent>
            </Sheet>
        </div>
    );
}
