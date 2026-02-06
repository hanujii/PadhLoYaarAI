'use client';

import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Download, FileJson, FileText } from 'lucide-react';
import { useState } from 'react';
import { HistoryItem, SavedItem } from '@/lib/history-store';

interface ExportDialogProps {
    items: HistoryItem[] | SavedItem[];
    type: 'history' | 'saved';
}

export function ExportDialog({ items, type }: ExportDialogProps) {
    const [format, setFormat] = useState<'json' | 'markdown'>('json');
    const [isOpen, setIsOpen] = useState(false);

    const handleExport = () => {
        if (items.length === 0) return;

        let content: string;
        let filename: string;
        let mimeType: string;

        if (format === 'json') {
            content = JSON.stringify(items, null, 2);
            filename = `padhloyaar-${type}-${Date.now()}.json`;
            mimeType = 'application/json';
        } else {
            // Markdown format
            content = items.map((item, index) => {
                const date = new Date(item.timestamp).toLocaleString();
                if (type === 'history') {
                    const historyItem = item as HistoryItem;
                    return `# ${index + 1}. ${historyItem.tool}\n\n**Query:** ${historyItem.query}\n\n**Result:**\n${historyItem.result}\n\n**Date:** ${date}\n\n---\n\n`;
                } else {
                    const savedItem = item as SavedItem;
                    return `# ${index + 1}. ${savedItem.title}\n\n**Type:** ${savedItem.type}\n\n**Content:**\n${savedItem.content}\n\n**Date:** ${date}\n\n---\n\n`;
                }
            }).join('\n');
            filename = `padhloyaar-${type}-${Date.now()}.md`;
            mimeType = 'text/markdown';
        }

        // Create and trigger download
        const blob = new Blob([content], { type: mimeType });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        a.style.display = 'none';
        document.body.appendChild(a);
        a.click();
        
        // Cleanup after a short delay to ensure download starts
        setTimeout(() => {
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        }, 100);

        setIsOpen(false);
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                    <Download className="mr-2 h-4 w-4" />
                    Export All
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Export {type === 'history' ? 'History' : 'Saved Items'}</DialogTitle>
                    <DialogDescription>
                        Export all your {type === 'history' ? 'history' : 'saved items'} ({items.length} items) in your preferred format.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 py-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Export Format</label>
                        <Select value={format} onValueChange={(value: 'json' | 'markdown') => setFormat(value)}>
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="json">
                                    <div className="flex items-center gap-2">
                                        <FileJson className="h-4 w-4" />
                                        JSON (Structured Data)
                                    </div>
                                </SelectItem>
                                <SelectItem value="markdown">
                                    <div className="flex items-center gap-2">
                                        <FileText className="h-4 w-4" />
                                        Markdown (Readable Format)
                                    </div>
                                </SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="rounded-lg bg-muted p-4 text-sm">
                        <p className="font-medium mb-1">Preview:</p>
                        <p className="text-muted-foreground">
                            {format === 'json'
                                ? 'Structured data in JSON format, ideal for backup or data processing.'
                                : 'Human-readable markdown format, great for documentation or sharing.'
                            }
                        </p>
                    </div>
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={() => setIsOpen(false)}>
                        Cancel
                    </Button>
                    <Button onClick={handleExport} disabled={items.length === 0}>
                        <Download className="mr-2 h-4 w-4" />
                        Export {items.length} Items
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
