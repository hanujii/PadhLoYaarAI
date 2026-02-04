'use client';

import { useState, useEffect } from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Logo } from '@/components/global/Logo';
import { Sparkles, BookOpen, Brain, Zap, ChevronRight, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const WELCOME_STEPS = [
    {
        title: 'Welcome to PadhLoYaarAI! 🎉',
        description: 'Your AI-powered study companion with 21+ tools to help you master any subject.',
        icon: Sparkles,
        color: 'from-purple-500 to-pink-500',
    },
    {
        title: 'Powerful AI Tools',
        description: 'From flashcards to exam prep, tutor chats to code learning - we\'ve got everything you need.',
        icon: Brain,
        color: 'from-blue-500 to-cyan-500',
    },
    {
        title: 'Learn Your Way',
        description: 'Use the command center or pick any tool from the dashboard. Track your progress with XP and streaks!',
        icon: BookOpen,
        color: 'from-green-500 to-emerald-500',
    },
    {
        title: 'Ready to Start?',
        description: 'Try asking anything in the command center, or explore our most popular tools below.',
        icon: Zap,
        color: 'from-orange-500 to-yellow-500',
    },
];

const POPULAR_TOOLS = [
    { name: 'AI Tutor', href: '/tutor', emoji: '🎓' },
    { name: 'Flashcards', href: '/flashcard-generator', emoji: '📚' },
    { name: 'Exam Prep', href: '/exam-prep', emoji: '✍️' },
    { name: 'Summarizer', href: '/summarizer', emoji: '📝' },
];

export function WelcomeModal() {
    const [isOpen, setIsOpen] = useState(false);
    const [step, setStep] = useState(0);

    useEffect(() => {
        // Check if user has seen welcome modal
        const hasSeenWelcome = localStorage.getItem('padhloyaar-welcome-seen');
        if (!hasSeenWelcome) {
            // Delay to allow page to load
            const timer = setTimeout(() => setIsOpen(true), 1000);
            return () => clearTimeout(timer);
        }
    }, []);

    const handleComplete = () => {
        localStorage.setItem('padhloyaar-welcome-seen', 'true');
        setIsOpen(false);
    };

    const handleNext = () => {
        if (step < WELCOME_STEPS.length - 1) {
            setStep(step + 1);
        } else {
            handleComplete();
        }
    };

    const handleSkip = () => {
        handleComplete();
    };

    const currentStep = WELCOME_STEPS[step];
    const Icon = currentStep.icon;
    const isLastStep = step === WELCOME_STEPS.length - 1;

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogContent className="sm:max-w-lg overflow-hidden p-0">
                {/* Header with gradient */}
                <div className={`bg-gradient-to-r ${currentStep.color} p-6 text-white`}>
                    <div className="flex items-center gap-3 mb-4">
                        <Logo className="w-10 h-10" />
                        <span className="text-xl font-bold">PadhLoYaarAI</span>
                    </div>

                    {/* Step indicator */}
                    <div className="flex gap-2">
                        {WELCOME_STEPS.map((_, i) => (
                            <div
                                key={i}
                                className={`h-1 flex-1 rounded-full transition-all ${i <= step ? 'bg-white' : 'bg-white/30'
                                    }`}
                            />
                        ))}
                    </div>
                </div>

                {/* Content */}
                <div className="p-6">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={step}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.3 }}
                        >
                            <div className="flex items-center gap-3 mb-4">
                                <div className={`p-3 rounded-xl bg-gradient-to-r ${currentStep.color}`}>
                                    <Icon className="w-6 h-6 text-white" />
                                </div>
                                <DialogHeader className="text-left">
                                    <DialogTitle className="text-xl">{currentStep.title}</DialogTitle>
                                </DialogHeader>
                            </div>

                            <DialogDescription className="text-base mb-6">
                                {currentStep.description}
                            </DialogDescription>

                            {/* Popular tools on last step */}
                            {isLastStep && (
                                <div className="grid grid-cols-2 gap-3 mb-6">
                                    {POPULAR_TOOLS.map((tool) => (
                                        <a
                                            key={tool.href}
                                            href={tool.href}
                                            onClick={handleComplete}
                                            className="flex items-center gap-2 p-3 rounded-lg border hover:bg-muted transition-colors"
                                        >
                                            <span className="text-2xl">{tool.emoji}</span>
                                            <span className="font-medium">{tool.name}</span>
                                        </a>
                                    ))}
                                </div>
                            )}
                        </motion.div>
                    </AnimatePresence>

                    {/* Actions */}
                    <div className="flex items-center justify-between">
                        <Button variant="ghost" onClick={handleSkip} className="text-muted-foreground">
                            Skip tour
                        </Button>

                        <Button onClick={handleNext} className={`bg-gradient-to-r ${currentStep.color}`}>
                            {isLastStep ? (
                                <>
                                    <Check className="w-4 h-4 mr-2" />
                                    Get Started
                                </>
                            ) : (
                                <>
                                    Next
                                    <ChevronRight className="w-4 h-4 ml-2" />
                                </>
                            )}
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
