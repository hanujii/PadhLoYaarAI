'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Logo } from '@/components/global/Logo';
import { Lock, Sparkles, Clock, BookOpen, Zap } from 'lucide-react';
import { motion } from 'framer-motion';
import { ANONYMOUS_LIMIT } from '@/lib/anonymous-limit';

const BENEFITS = [
    { icon: Sparkles, text: '100 AI requests per day (vs 5)', color: 'text-purple-500' },
    { icon: Clock, text: 'Save your study history', color: 'text-blue-500' },
    { icon: BookOpen, text: 'Access all 21+ tools', color: 'text-green-500' },
    { icon: Zap, text: 'Sync across devices', color: 'text-orange-500' },
];

interface LoginRequiredModalProps {
    isOpen: boolean;
    onClose: () => void;
    attemptCount?: number;
}

export function LoginRequiredModal({ isOpen, onClose, attemptCount }: LoginRequiredModalProps) {
    const router = useRouter();

    const handleLogin = () => {
        router.push('/login');
        onClose();
    };

    const handleSignUp = () => {
        router.push('/login?mode=signup');
        onClose();
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-md overflow-hidden p-0">
                {/* Header with gradient */}
                <div className="bg-gradient-to-r from-primary to-purple-600 p-6 text-white">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="p-2 bg-white/20 rounded-xl">
                            <Lock className="w-6 h-6" />
                        </div>
                        <div>
                            <DialogHeader>
                                <DialogTitle className="text-xl text-white">Free Trial Limit Reached</DialogTitle>
                            </DialogHeader>
                        </div>
                    </div>
                    <DialogDescription className="text-white/80">
                        You've used {attemptCount || ANONYMOUS_LIMIT} of {ANONYMOUS_LIMIT} free AI requests.
                        Sign up to continue learning!
                    </DialogDescription>
                </div>

                {/* Content */}
                <div className="p-6">
                    {/* Benefits */}
                    <div className="space-y-3 mb-6">
                        <p className="text-sm font-medium text-muted-foreground">
                            Create a free account to unlock:
                        </p>
                        {BENEFITS.map((benefit, index) => {
                            const Icon = benefit.icon;
                            return (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    className="flex items-center gap-3"
                                >
                                    <div className={`p-1.5 rounded-lg bg-secondary ${benefit.color}`}>
                                        <Icon className="w-4 h-4" />
                                    </div>
                                    <span className="text-sm">{benefit.text}</span>
                                </motion.div>
                            );
                        })}
                    </div>

                    {/* Actions */}
                    <div className="space-y-3">
                        <Button
                            onClick={handleSignUp}
                            className="w-full bg-gradient-to-r from-primary to-purple-600 hover:opacity-90"
                            size="lg"
                        >
                            <Sparkles className="w-4 h-4 mr-2" />
                            Create Free Account
                        </Button>
                        <Button
                            onClick={handleLogin}
                            variant="outline"
                            className="w-full"
                            size="lg"
                        >
                            Already have an account? Sign In
                        </Button>
                    </div>

                    {/* Footer */}
                    <p className="text-xs text-center text-muted-foreground mt-4">
                        No credit card required • Free forever tier available
                    </p>
                </div>
            </DialogContent>
        </Dialog>
    );
}
