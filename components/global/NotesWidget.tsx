'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { StickyNote, Save } from 'lucide-react';
import { useHistoryStore } from '@/lib/history-store';

export function NotesWidget() {
    const { notes, updateNotes } = useHistoryStore();
    const [isOpen, setIsOpen] = useState(false);
    // Local state to handle input before debounced save or direct binding
    const [localNotes, setLocalNotes] = useState(notes);

    // Sync local state with store on mount
    useEffect(() => {
        setLocalNotes(notes);
    }, [notes]);

    const handleNotesChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const newValue = e.target.value;
        setLocalNotes(newValue);
        updateNotes(newValue);
    };

    return (
        <div className="fixed bottom-6 right-6 z-50">
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
                <SheetTrigger asChild>
                    <Button
                        size="icon"
                        className="h-14 w-14 rounded-full shadow-lg hover:shadow-xl transition-all bg-yellow-400 hover:bg-yellow-500 text-yellow-950"
                    >
                        <StickyNote className="h-6 w-6" />
                    </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-[400px] sm:w-[540px] flex flex-col">
                    <SheetHeader>
                        <SheetTitle className="flex items-center gap-2">
                            <StickyNote className="w-5 h-5" />
                            My Scratchpad
                        </SheetTitle>
                    </SheetHeader>
                    <div className="flex-1 mt-4 flex flex-col gap-2">
                        <div className="text-sm text-muted-foreground">
                            Notes are saved automatically to your device.
                        </div>
                        <Textarea
                            value={localNotes}
                            onChange={handleNotesChange}
                            placeholder="Type your quick notes here..."
                            className="flex-1 resize-none bg-yellow-50/50 border-yellow-200 focus-visible:ring-yellow-400 p-4 text-base leading-relaxed"
                        />
                    </div>
                </SheetContent>
            </Sheet>
        </div>
    );
}
