'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { AlertTriangle } from 'lucide-react';

export default function GlobalError({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error('Global Error:', error);
    }, [error]);

    return (
        <html lang="en">
            <body className="bg-black text-white min-h-screen flex items-center justify-center p-4">
                <div className="text-center space-y-4 max-w-md mx-auto">
                    <div className="flex justify-center mb-6">
                        <div className="p-4 bg-red-500/10 rounded-full border border-red-500/20">
                            <AlertTriangle className="w-12 h-12 text-red-500" />
                        </div>
                    </div>
                    <h2 className="text-2xl font-bold">Critical Application Error</h2>
                    <p className="text-gray-400">
                        A critical error occurred that prevented the application from loading.
                    </p>
                    <div className="bg-zinc-900 border border-zinc-800 p-4 rounded-lg font-mono text-xs text-left overflow-auto max-h-40">
                        {error.message || 'Unknown error occurred'}
                    </div>
                    <Button onClick={() => reset()} className="w-full">
                        Try Again
                    </Button>
                </div>
            </body>
        </html>
    );
}
