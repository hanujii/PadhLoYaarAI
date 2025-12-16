'use client';

import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { GlassCard } from '@/components/ui/glass-card';
import { transformCode } from './actions';
import { Loader2, ArrowRight } from 'lucide-react';
import Editor from '@monaco-editor/react';
import { motion } from 'framer-motion';

import { DownloadPDFButton } from '@/components/global/DownloadPDFButton';
import { useHistoryStore } from '@/lib/history-store';
import { ShareResult } from '@/components/global/ShareResult';

export default function CodeTransformerPage() {
    const [loading, setLoading] = useState(false);
    const [inputCode, setInputCode] = useState('// Type your code here...');
    const [outputCode, setOutputCode] = useState('// Result will appear here...');
    const [fromLang, setFromLang] = useState('javascript');
    const [toLang, setToLang] = useState('python');
    const [style, setStyle] = useState('standard');
    const outputRef = useRef<HTMLDivElement>(null);
    const { addToHistory } = useHistoryStore();

    const languages = ['javascript', 'typescript', 'python', 'java', 'csharp', 'cpp', 'go', 'rust', 'php'];

    async function handleTransform() {
        setLoading(true);
        const result = await transformCode(inputCode, fromLang, toLang, style);
        if (result.success && result.data) {
            setOutputCode(result.data);
            addToHistory({
                tool: 'code-transformer',
                query: `Convert ${fromLang} to ${toLang}: \n${inputCode.substring(0, 100)}...`,
                result: result.data
            });
        } else {
            setOutputCode('// Error: ' + result.error);
        }
        setLoading(false);
    }

    return (
        <div className="h-[calc(100vh-8rem)] flex flex-col space-y-4">
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center justify-between px-2"
            >
                <h1 className="text-2xl font-bold flex items-center gap-2">
                    <span className="text-green-500">{'{'}</span>
                    Code Transformer
                    <span className="text-green-500">{'}'}</span>
                </h1>
                <div className="flex items-center gap-2">
                    <Select value={style} onValueChange={setStyle}>
                        <SelectTrigger className="w-[150px] bg-background/50 border-white/10 backdrop-blur-sm">
                            <SelectValue placeholder="Style" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="standard">Standard</SelectItem>
                            <SelectItem value="clean">Clean & Minimal</SelectItem>
                            <SelectItem value="documented">Heavily Commented</SelectItem>
                            <SelectItem value="efficient">Highly Efficient</SelectItem>
                        </SelectContent>
                    </Select>
                    <Button
                        onClick={handleTransform}
                        disabled={loading}
                        className="bg-green-600 hover:bg-green-700 shadow-lg shadow-green-500/20"
                    >
                        {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <ArrowRight className="w-4 h-4 mr-2" />}
                        Convert
                    </Button>
                </div>
            </motion.div>

            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4 min-h-0">
                {/* Input Editor */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 }}
                    className="flex flex-col h-full"
                >
                    <GlassCard className="flex flex-col gap-2 p-1 h-full border-green-500/10 bg-green-950/5" enableTilt={false}>
                        <div className="flex items-center justify-between px-2 py-1 bg-white/5 rounded-t-lg border-b border-white/5">
                            <span className="text-sm font-medium text-muted-foreground">Input</span>
                            <Select value={fromLang} onValueChange={setFromLang}>
                                <SelectTrigger className="w-[120px] h-8 bg-transparent border-none focus:ring-0">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {languages.map(l => <SelectItem key={l} value={l}>{l}</SelectItem>)}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="flex-1 rounded-b-lg overflow-hidden relative">
                            <div className="absolute inset-0">
                                <Editor
                                    height="100%"
                                    defaultLanguage={fromLang}
                                    language={fromLang}
                                    value={inputCode}
                                    onChange={(val) => setInputCode(val || '')}
                                    theme="vs-dark"
                                    options={{
                                        minimap: { enabled: false },
                                        fontSize: 14,
                                        padding: { top: 16 },
                                        scrollBeyondLastLine: false,
                                    }}
                                    className="bg-transparent"
                                />
                            </div>
                        </div>
                    </GlassCard>
                </motion.div>

                {/* Output Editor */}
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                    className="flex flex-col h-full"
                    ref={outputRef}
                >
                    <GlassCard className="flex flex-col gap-2 p-1 h-full border-blue-500/10 bg-blue-950/5" enableTilt={false}>
                        <div className="flex items-center justify-between px-2 py-1 bg-white/5 rounded-t-lg border-b border-white/5">
                            <span className="text-sm font-medium text-muted-foreground">Output</span>
                            <div className="flex items-center gap-2">
                                <ShareResult targetRef={outputRef as React.RefObject<HTMLElement>} fileName="code-transform.png" title="Code Translation" text="Check out this code translation I made with PadhLoYaarAI!" />
                                <DownloadPDFButton targetRef={outputRef} filename="code-transformation.pdf" size="icon" variant="ghost" className="h-8 w-8 hover:bg-white/10" />
                                <Select value={toLang} onValueChange={setToLang}>
                                    <SelectTrigger className="w-[120px] h-8 bg-transparent border-none focus:ring-0">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {languages.map(l => <SelectItem key={l} value={l}>{l}</SelectItem>)}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <div className="flex-1 rounded-b-lg overflow-hidden relative">
                            <div className="absolute inset-0">
                                <Editor
                                    height="100%"
                                    defaultLanguage={toLang}
                                    language={toLang}
                                    value={outputCode}
                                    theme="vs-dark"
                                    options={{
                                        minimap: { enabled: false },
                                        fontSize: 14,
                                        readOnly: true,
                                        padding: { top: 16 },
                                        scrollBeyondLastLine: false
                                    }}
                                />
                            </div>
                        </div>
                    </GlassCard>
                </motion.div>
            </div>
        </div>
    );
}
