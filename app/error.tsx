'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { RefreshCw, Home, AlertTriangle } from 'lucide-react';
import Link from 'next/link';

/**
 * Page-level Error Boundary.
 * Catches errors in page components and displays a user-friendly error UI.
 */
export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        // Log the error to an error reporting service (e.g., Sentry)
        console.error('Page Error:', error);
    }, [error]);

    return (
        <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 text-center">
            <div className="glass-card p-8 sm:p-12 max-w-md w-full space-y-6">
                {/* Icon */}
                <div className="mx-auto w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center">
                    <AlertTriangle className="w-8 h-8 text-destructive" />
                </div>

                {/* Heading */}
                <div className="space-y-2">
                    <h2 className="text-2xl font-bold">Something went wrong</h2>
                    <p className="text-muted-foreground text-sm">
                        We encountered an unexpected error. Our team has been notified.
                    </p>
                </div>

                {/* Error Details (Development only) */}
                {process.env.NODE_ENV === 'development' && (
                    <div className="bg-destructive/5 border border-destructive/20 rounded-lg p-4 text-left">
                        <p className="text-xs font-mono text-destructive/80 break-all">
                            {error.message}
                        </p>
                        {error.digest && (
                            <p className="text-xs text-muted-foreground mt-2">
                                Digest: {error.digest}
                            </p>
                        )}
                    </div>
                )}

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <Button onClick={reset} variant="default" className="gap-2">
                        <RefreshCw className="w-4 h-4" />
                        Try Again
                    </Button>
                    <Button variant="outline" asChild className="gap-2">
                        <Link href="/">
                            <Home className="w-4 h-4" />
                            Go Home
                        </Link>
                    </Button>
                </div>
            </div>
        </div>
    );
}
