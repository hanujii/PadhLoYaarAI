'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { transformCode } from './actions';
import { Loader2, ArrowRight } from 'lucide-react';
import Editor from '@monaco-editor/react';

export default function CodeTransformerPage() {
    const [loading, setLoading] = useState(false);
    const [inputCode, setInputCode] = useState('// Type your code here...');
    const [outputCode, setOutputCode] = useState('// Result will appear here...');
    const [fromLang, setFromLang] = useState('javascript');
    const [toLang, setToLang] = useState('python');
    const [style, setStyle] = useState('standard');

    const languages = ['javascript', 'typescript', 'python', 'java', 'csharp', 'cpp', 'go', 'rust', 'php'];

    async function handleTransform() {
        setLoading(true);
        const result = await transformCode(inputCode, fromLang, toLang, style);
        if (result.success && result.data) {
            setOutputCode(result.data);
        } else {
            setOutputCode('// Error: ' + result.error);
        }
        setLoading(false);
    }

    return (
        <div className="h-[calc(100vh-8rem)] flex flex-col space-y-4">
            <div className="flex items-center justify-between px-2">
                <h1 className="text-2xl font-bold">Code Transformer</h1>
                <div className="flex items-center gap-2">
                    <Select value={style} onValueChange={setStyle}>
                        <SelectTrigger className="w-[150px]">
                            <SelectValue placeholder="Style" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="standard">Standard</SelectItem>
                            <SelectItem value="clean">Clean & Minimal</SelectItem>
                            <SelectItem value="documented">Heavily Commented</SelectItem>
                            <SelectItem value="efficient">Highly Efficient</SelectItem>
                        </SelectContent>
                    </Select>
                    <Button onClick={handleTransform} disabled={loading}>
                        {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <ArrowRight className="w-4 h-4 mr-2" />}
                        Convert
                    </Button>
                </div>
            </div>

            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Input Editor */}
                <div className="flex flex-col gap-2 rounded-lg border p-1 bg-card">
                    <div className="flex items-center justify-between px-2 py-1 bg-muted/50 rounded">
                        <span className="text-sm font-medium">Input</span>
                        <Select value={fromLang} onValueChange={setFromLang}>
                            <SelectTrigger className="w-[120px] h-8">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                {languages.map(l => <SelectItem key={l} value={l}>{l}</SelectItem>)}
                            </SelectContent>
                        </Select>
                    </div>
                    <Editor
                        height="100%"
                        defaultLanguage={fromLang}
                        language={fromLang}
                        value={inputCode}
                        onChange={(val) => setInputCode(val || '')}
                        theme="vs-dark"
                        options={{ minimap: { enabled: false }, fontSize: 14 }}
                    />
                </div>

                {/* Output Editor */}
                <div className="flex flex-col gap-2 rounded-lg border p-1 bg-card">
                    <div className="flex items-center justify-between px-2 py-1 bg-muted/50 rounded">
                        <span className="text-sm font-medium">Output</span>
                        <Select value={toLang} onValueChange={setToLang}>
                            <SelectTrigger className="w-[120px] h-8">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                {languages.map(l => <SelectItem key={l} value={l}>{l}</SelectItem>)}
                            </SelectContent>
                        </Select>
                    </div>
                    <Editor
                        height="100%"
                        defaultLanguage={toLang}
                        language={toLang}
                        value={outputCode}
                        theme="vs-dark"
                        options={{ minimap: { enabled: false }, fontSize: 14, readOnly: true }}
                    />
                </div>
            </div>
        </div>
    );
}
