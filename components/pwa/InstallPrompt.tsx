'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Download, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export function InstallPrompt() {
    const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const handler = (e: any) => {
            e.preventDefault();
            setDeferredPrompt(e);
            setIsVisible(true);
        };
        window.addEventListener('beforeinstallprompt', handler);
        return () => window.removeEventListener('beforeinstallprompt', handler);
    }, []);

    const handleInstall = async () => {
        if (!deferredPrompt) return;
        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        if (outcome === 'accepted') {
            setDeferredPrompt(null);
            setIsVisible(false);
        }
    };

    if (!isVisible) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0, y: 100 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 100 }}
                className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-96 z-50 pointer-events-none"
            >
                <div className="bg-background/80 backdrop-blur-lg border rounded-lg shadow-lg p-4 pointer-events-auto flex items-center justify-between gap-4">
                    <div className="flex-1">
                        <h3 className="font-semibold text-sm">Install App</h3>
                        <p className="text-xs text-muted-foreground">
                            Add PadhLoYaarAI to your home screen for faster access.
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button size="sm" variant="ghost" className="h-8 w-8 p-0" onClick={() => setIsVisible(false)}>
                            <X className="h-4 w-4" />
                        </Button>
                        <Button size="sm" onClick={handleInstall} className="gap-2">
                            <Download className="h-4 w-4" />
                            Install
                        </Button>
                    </div>
                </div>
            </motion.div>
        </AnimatePresence>
    );
}
