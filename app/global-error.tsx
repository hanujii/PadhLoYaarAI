'use client';

import { useEffect } from 'react';
import { AlertOctagon, RefreshCw } from 'lucide-react';

/**
 * Global Error Boundary.
 * This is the last line of defense - catches errors in the root layout itself.
 * Must have its own <html> and <body> tags since the root layout may have crashed.
 */
export default function GlobalError({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        // Log the critical error
        console.error('CRITICAL Global Error:', error);
    }, [error]);

    return (
        <html lang="en">
            <body className="min-h-screen bg-[#0a0a0f] text-white flex items-center justify-center p-4">
                <div className="max-w-md w-full text-center space-y-6 p-8 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl">
                    {/* Icon */}
                    <div className="mx-auto w-20 h-20 rounded-full bg-red-500/10 flex items-center justify-center">
                        <AlertOctagon className="w-10 h-10 text-red-500" />
                    </div>

                    {/* Heading */}
                    <div className="space-y-2">
                        <h1 className="text-3xl font-bold">Critical Error</h1>
                        <p className="text-gray-400">
                            The application encountered a critical error and needs to be reloaded.
                        </p>
                    </div>

                    {/* Error Info */}
                    <div className="bg-red-500/5 border border-red-500/20 rounded-lg p-4 text-left">
                        <p className="text-xs font-mono text-red-400/80 break-all">
                            {error.message || 'An unknown error occurred'}
                        </p>
                        {error.digest && (
                            <p className="text-xs text-gray-500 mt-2">
                                Error ID: {error.digest}
                            </p>
                        )}
                    </div>

                    {/* Actions */}
                    <button
                        onClick={reset}
                        className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white text-black font-medium rounded-xl hover:bg-gray-200 transition-colors w-full"
                    >
                        <RefreshCw className="w-4 h-4" />
                        Reload Application
                    </button>

                    <p className="text-xs text-gray-500">
                        If this issue persists, please contact support.
                    </p>
                </div>
            </body>
        </html>
    );
}
