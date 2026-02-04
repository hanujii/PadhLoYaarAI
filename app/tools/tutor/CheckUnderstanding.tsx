'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useSpeechRecognition } from '@/hooks/use-speech-recognition';
import { useTextToSpeech } from '@/hooks/use-text-to-speech';
import { AudioVisualizer } from '@/components/global/AudioVisualizer';
import { Mic, MicOff, CheckCircle, XCircle, BrainCircuit } from 'lucide-react';
import { cn } from '@/lib/utils';
import { checkUnderstanding } from './actions';
import { toast } from 'sonner';

interface CheckUnderstandingProps {
    originalTopic: string;
}

export function CheckUnderstandingSection({ originalTopic }: CheckUnderstandingProps) {
    const [step, setStep] = useState<'idle' | 'listening' | 'assessing' | 'result'>('idle');
    const { isListening, transcript, startListening, stopListening, resetTranscript } = useSpeechRecognition();
    const { speak } = useTextToSpeech();
    const [assessment, setAssessment] = useState<{ isCorrect: boolean; feedback: string } | null>(null);

    const handleStart = () => {
        setStep('listening');
        resetTranscript();
        startListening();
    };

    const handleStop = async () => {
        stopListening();

        if (!transcript.trim()) {
            setStep('idle');
            toast.error("I didn't hear anything. Please try again.");
            return;
        }

        setStep('assessing');

        // Call server action to verify understanding
        const result = await checkUnderstanding(originalTopic, transcript);
        setAssessment(result);
        setStep('result');
        speak(result.feedback);

        if (result.isCorrect) {
            toast.success("Great explanation!");
        }
    };

    return (
        <Card className="mt-8 border-primary/20 bg-primary/5">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <BrainCircuit className="w-5 h-5 text-primary" />
                    Check My Understanding
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                {step === 'idle' && (
                    <div className="text-center py-6 space-y-4">
                        <p className="text-muted-foreground">
                            Explain what you learned in your own words. I&apos;ll listen and tell you if you got it right!
                        </p>
                        <Button onClick={handleStart} size="lg" className="rounded-full gap-2">
                            <Mic className="w-4 h-4" /> Start Speaking
                        </Button>
                    </div>
                )}

                {step === 'listening' && (
                    <div className="flex flex-col items-center py-6 space-y-4">
                        <AudioVisualizer isActive={true} color="bg-red-500" />
                        <p className="text-lg font-medium animate-pulse">Listening...</p>
                        <p className="text-sm text-muted-foreground max-w-lg text-center italic">
                            &quot;{transcript || "..."}&quot;
                        </p>
                        <Button onClick={handleStop} variant="destructive" size="lg" className="rounded-full gap-2">
                            <MicOff className="w-4 h-4" /> I&apos;m Done
                        </Button>
                    </div>
                )}

                {step === 'assessing' && (
                    <div className="text-center py-8 animate-pulse text-muted-foreground">
                        Thinking...
                    </div>
                )}

                {step === 'result' && assessment && (
                    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4">
                        <div className={cn(
                            "flex items-center justify-center p-4 rounded-full w-16 h-16 mx-auto",
                            assessment.isCorrect ? "bg-green-100 dark:bg-green-900/30 text-green-600" : "bg-red-100 dark:bg-red-900/30 text-red-600"
                        )}>
                            {assessment.isCorrect ? <CheckCircle className="w-8 h-8" /> : <XCircle className="w-8 h-8" />}
                        </div>
                        <div className="text-center space-y-2">
                            <h3 className="text-xl font-bold">{assessment.isCorrect ? "You got it!" : "Not quite..."}</h3>
                            <p className="text-muted-foreground max-w-2xl mx-auto">
                                {assessment.feedback}
                            </p>
                        </div>
                        <div className="flex justify-center pt-4">
                            <Button variant="outline" onClick={() => setStep('idle')}>Try Again</Button>
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
