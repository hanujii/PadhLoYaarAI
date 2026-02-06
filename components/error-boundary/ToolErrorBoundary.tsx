'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import Link from 'next/link';

interface Props {
    children: ReactNode;
    toolName?: string;
    fallback?: ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
    errorInfo: ErrorInfo | null;
}

export class ToolErrorBoundary extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            hasError: false,
            error: null,
            errorInfo: null,
        };
    }

    static getDerivedStateFromError(error: Error): Partial<State> {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        // Log to error tracking service (Sentry, etc.)
        if (process.env.NODE_ENV === 'development') {
            console.error('ToolErrorBoundary caught an error:', error, errorInfo);
        }

        this.setState({
            error,
            errorInfo,
        });

        // In production, send to error tracking service
        // Example: Sentry.captureException(error, { contexts: { react: { componentStack: errorInfo.componentStack } } });
    }

    handleReset = () => {
        this.setState({
            hasError: false,
            error: null,
            errorInfo: null,
        });
    };

    render() {
        if (this.state.hasError) {
            // Custom fallback UI
            if (this.props.fallback) {
                return this.props.fallback;
            }

            // Default error UI
            return (
                <div className="min-h-[60vh] flex flex-col items-center justify-center px-4 py-12">
                    <div className="glass-card p-8 max-w-md w-full space-y-6 text-center">
                        {/* Icon */}
                        <div className="mx-auto w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center">
                            <AlertTriangle className="w-8 h-8 text-destructive" />
                        </div>

                        {/* Heading */}
                        <div className="space-y-2">
                            <h2 className="text-2xl font-bold">
                                {this.props.toolName ? `${this.props.toolName} Error` : 'Something went wrong'}
                            </h2>
                            <p className="text-muted-foreground text-sm">
                                An error occurred while using this tool. Our team has been notified.
                            </p>
                        </div>

                        {/* Error Details (Development only) */}
                        {process.env.NODE_ENV === 'development' && this.state.error && (
                            <div className="bg-destructive/5 border border-destructive/20 rounded-lg p-4 text-left">
                                <p className="text-xs font-mono text-destructive/80 break-all">
                                    {this.state.error.message}
                                </p>
                                {this.state.errorInfo && (
                                    <details className="mt-2">
                                        <summary className="text-xs text-muted-foreground cursor-pointer">
                                            Component Stack
                                        </summary>
                                        <pre className="text-xs text-muted-foreground mt-2 overflow-auto max-h-40">
                                            {this.state.errorInfo.componentStack}
                                        </pre>
                                    </details>
                                )}
                            </div>
                        )}

                        {/* Actions */}
                        <div className="flex flex-col sm:flex-row gap-3 justify-center">
                            <Button onClick={this.handleReset} variant="default" className="gap-2">
                                <RefreshCw className="w-4 h-4" />
                                Try Again
                            </Button>
                            <Button variant="outline" asChild className="gap-2">
                                <Link href="/tools">
                                    <Home className="w-4 h-4" />
                                    Back to Tools
                                </Link>
                            </Button>
                        </div>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}
