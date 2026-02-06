'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { chatWithPDF, summarizePDF } from './actions';
import { Loader2, Upload, FileText, Send } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { DownloadPDFButton } from '@/components/global/DownloadPDFButton';
import { ToolBackButton } from '@/components/global/ToolBackButton';
import { toast } from 'sonner';

// Use CDN for worker to avoid build hassles
// pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

interface Message {
    role: 'user' | 'assistant';
    content: string;
}

export default function PDFExplainerPage() {
    const [loading, setLoading] = useState(false);
    const [pdfText, setPdfText] = useState<string | null>(null);
    const [fileName, setFileName] = useState<string | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [summary, setSummary] = useState<string | null>(null);
    const bottomRef = useRef<HTMLDivElement>(null);
    const chatRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validate file type
        if (file.type !== 'application/pdf' && !file.name.toLowerCase().endsWith('.pdf')) {
            toast.error('Please upload a PDF file.');
            return;
        }

        // Validate file size (50MB limit)
        if (file.size > 50 * 1024 * 1024) {
            toast.error('PDF file size exceeds 50MB limit. Please choose a smaller file.');
            return;
        }

        setLoading(true);
        setFileName(file.name);
        setMessages([]);
        setSummary(null);

        try {
            if (process.env.NODE_ENV === 'development') {
                console.log("Loading PDF.js...");
            }
            const pdfjsLib = await import('pdfjs-dist');
            // Force HTTPS and ensure version match
            pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

            if (process.env.NODE_ENV === 'development') {
                console.log("Reading file buffer...");
            }
            const arrayBuffer = await file.arrayBuffer();

            if (process.env.NODE_ENV === 'development') {
                console.log("Parsing PDF document...");
            }
            const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
            let fullText = '';

            if (process.env.NODE_ENV === 'development') {
                console.log(`PDF loaded. Pages: ${pdf.numPages}`);
            }
            for (let i = 1; i <= pdf.numPages; i++) {
                const page = await pdf.getPage(i);
                const textContent = await page.getTextContent();
                const pageText = textContent.items.map((item: { str?: string }) => item.str || '').join(' ');
                fullText += pageText + '\n\n';
            }

            if (process.env.NODE_ENV === 'development') {
                console.log("Text extraction complete. Length:", fullText.length);
            }
            setPdfText(fullText);

            // Generate initial summary
            if (process.env.NODE_ENV === 'development') {
                console.log("Generating summary...");
            }
            const summaryResult = await summarizePDF(fullText);
            if (summaryResult.success && summaryResult.data) {
                setSummary(summaryResult.data);
                setMessages([{ role: 'assistant', content: "I've analyzed your PDF. Here is a summary. Ask me anything about it!" }]);
            } else {
                if (process.env.NODE_ENV === 'development') {
                    console.error("Summary failed:", summaryResult.error);
                }
                toast.error(summaryResult.error || 'Failed to generate summary');
            }

        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            if (process.env.NODE_ENV === 'development') {
                console.error("PDF Parse/Process Error", error);
            }
            toast.error(`Failed to parse PDF: ${errorMessage}`);
        } finally {
            setLoading(false);
        }
    };

    const handleSend = async () => {
        if (!input.trim() || !pdfText || loading) return;

        const userMsg: Message = { role: 'user', content: input.trim() };
        setMessages(prev => [...prev, userMsg]);
        const currentInput = input.trim();
        setInput('');
        setLoading(true);

        try {
            const result = await chatWithPDF(currentInput, pdfText, messages);

            if (result.success && result.data) {
                setMessages(prev => [...prev, { role: 'assistant', content: result.data }]);
            } else {
                const errorMessage = result.error || 'Sorry, I encountered an error.';
                setMessages(prev => [...prev, { role: 'assistant', content: `**Error:** ${errorMessage}` }]);
                toast.error(errorMessage);
            }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
            setMessages(prev => [...prev, { role: 'assistant', content: `**Error:** ${errorMessage}` }]);
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-[calc(100vh-8rem)] flex flex-col gap-4 sm:gap-6 pb-8">
            <div className="w-full">
                <ToolBackButton />
            </div>
            <div className="flex-1 flex flex-col lg:flex-row gap-4 sm:gap-6 min-h-0">
                {/* Sidebar: Upload & Summary */}
                <div className="lg:w-1/3 flex flex-col gap-4 h-auto lg:h-full">
                    <Card>
                        <CardHeader className="pb-3 sm:pb-4">
                            <CardTitle className="text-lg sm:text-xl">Document</CardTitle>
                            <CardDescription>Upload a PDF to analyze</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center justify-center w-full">
                                <label className="flex flex-col items-center justify-center w-full h-28 sm:h-32 border-2 border-dashed rounded-lg cursor-pointer hover:bg-muted/50">
                                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                        <Upload className="w-7 h-7 sm:w-8 sm:h-8 mb-2 text-muted-foreground" />
                                        <p className="text-sm text-muted-foreground"><span className="font-semibold">Click to upload</span> PDF</p>
                                    </div>
                                    <input type="file" className="hidden" accept=".pdf" onChange={handleFileUpload} />
                                </label>
                            </div>
                            {fileName && (
                                <div className="mt-4 flex items-center gap-2 p-2 bg-muted rounded text-sm">
                                    <FileText className="w-4 h-4" />
                                    <span className="truncate flex-1">{fileName}</span>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {summary && (
                        <Card className="flex-1 overflow-hidden flex flex-col">
                            <CardHeader className="pb-3 sm:pb-4">
                                <CardTitle className="text-lg sm:text-xl">Summary</CardTitle>
                            </CardHeader>
                            <CardContent className="flex-1 overflow-y-auto prose dark:prose-invert text-sm">
                                <ReactMarkdown>{summary}</ReactMarkdown>
                            </CardContent>
                        </Card>
                    )}
                </div>

                {/* Main Chat Area */}
                <Card className="flex-1 flex flex-col shadow-lg border-2 min-h-[400px] lg:min-h-0">
                    <CardHeader className="border-b flex flex-col sm:flex-row sm:items-center pb-3 sm:pb-4 gap-3 sm:gap-0 justify-between">
                        <CardTitle className="text-lg sm:text-xl">Chat with Document</CardTitle>
                        {messages.length > 0 && <DownloadPDFButton targetRef={chatRef} filename="pdf-chat-session.pdf" />}
                    </CardHeader>
                    <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
                        <div ref={chatRef} className="space-y-4">
                            {messages.length === 0 && !loading && (
                                <div className="h-full flex items-center justify-center text-muted-foreground">
                                    Upload a PDF to start chatting.
                                </div>
                            )}

                            {messages.map((m, i) => (
                                <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                    <div className={`max-w-[80%] p-3 rounded-lg ${m.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                                        <ReactMarkdown>{m.content}</ReactMarkdown>
                                    </div>
                                </div>
                            ))}
                        </div>
                        {/* ... existing loading and scroll ref */}
                        {loading && (
                            <div className="flex justify-start">
                                <div className="bg-muted p-3 rounded-lg">
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                </div>
                            </div>
                        )}
                        <div ref={bottomRef} />
                    </CardContent>
                    <div className="p-3 sm:p-4 border-t flex gap-2">
                        <Input
                            value={input}
                            onChange={e => setInput(e.target.value)}
                            placeholder="Ask a question..."
                            onKeyDown={e => e.key === 'Enter' && handleSend()}
                            disabled={!pdfText || loading}
                            className="h-10 sm:h-11"
                        />
                        <Button onClick={handleSend} disabled={!pdfText || loading} size="icon" className="h-10 w-10 sm:h-11 sm:w-11 touch-target">
                            <Send className="w-4 h-4" />
                        </Button>
                    </div>
                </Card>
            </div>
        </div>
    );
}
