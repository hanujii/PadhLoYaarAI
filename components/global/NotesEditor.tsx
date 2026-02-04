'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { Button } from '@/components/ui/button';
import {
    Bold,
    Italic,
    Strikethrough,
    Heading1,
    Heading2,
    Heading3,
    List,
    ListOrdered,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useEffect } from 'react';

interface NotesEditorProps {
    content: string;
    onChange: (content: string) => void;
}

export function NotesEditor({ content, onChange }: NotesEditorProps) {
    const editor = useEditor({
        extensions: [
            StarterKit,
        ],
        content: content,
        immediatelyRender: false,
        onUpdate: ({ editor }) => {
            onChange(editor.getHTML());
        },
        editorProps: {
            attributes: {
                class: 'prose prose-sm dark:prose-invert max-w-none focus:outline-none min-h-[400px] p-4',
            },
        },
    });

    // Sync content updates from outside (if needed, e.g. initial load)
    useEffect(() => {
        if (editor && content && editor.getHTML() !== content) {
            if (editor.getText() === '' && content !== '<p></p>') {
                editor.commands.setContent(content);
            }
        }
    }, [content, editor]);

    if (!editor) {
        return null;
    }

    return (
        <div className="flex flex-col h-full border rounded-md overflow-hidden bg-background">
            {/* Toolbar */}
            <div className="flex items-center gap-1 p-1 border-b bg-muted/20 flex-wrap">
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => editor.chain().focus().toggleBold().run()}
                    className={cn("h-8 w-8", editor.isActive('bold') && "bg-muted text-foreground")}
                    title="Bold"
                >
                    <Bold className="h-4 w-4" />
                </Button>
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => editor.chain().focus().toggleItalic().run()}
                    className={cn("h-8 w-8", editor.isActive('italic') && "bg-muted text-foreground")}
                    title="Italic"
                >
                    <Italic className="h-4 w-4" />
                </Button>
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => editor.chain().focus().toggleStrike().run()}
                    className={cn("h-8 w-8", editor.isActive('strike') && "bg-muted text-foreground")}
                    title="Strikethrough"
                >
                    <Strikethrough className="h-4 w-4" />
                </Button>

                <div className="w-px h-6 bg-border mx-1" />

                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                    className={cn("h-8 w-8", editor.isActive('heading', { level: 1 }) && "bg-muted text-foreground")}
                    title="Heading 1"
                >
                    <Heading1 className="h-4 w-4" />
                </Button>
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                    className={cn("h-8 w-8", editor.isActive('heading', { level: 2 }) && "bg-muted text-foreground")}
                    title="Heading 2"
                >
                    <Heading2 className="h-4 w-4" />
                </Button>
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
                    className={cn("h-8 w-8", editor.isActive('heading', { level: 3 }) && "bg-muted text-foreground")}
                    title="Heading 3"
                >
                    <Heading3 className="h-4 w-4" />
                </Button>

                <div className="w-px h-6 bg-border mx-1" />

                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => editor.chain().focus().toggleBulletList().run()}
                    className={cn("h-8 w-8", editor.isActive('bulletList') && "bg-muted text-foreground")}
                    title="Bullet List"
                >
                    <List className="h-4 w-4" />
                </Button>
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => editor.chain().focus().toggleOrderedList().run()}
                    className={cn("h-8 w-8", editor.isActive('orderedList') && "bg-muted text-foreground")}
                    title="Ordered List"
                >
                    <ListOrdered className="h-4 w-4" />
                </Button>
            </div>

            {/* Editor Area */}
            <div className="flex-1 overflow-y-auto cursor-text">
                <EditorContent editor={editor} className="h-full" />
            </div>
        </div>
    );
}
