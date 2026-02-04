'use client';

import posthog from 'posthog-js';
import { PostHogProvider as PHProvider } from 'posthog-js/react';
import { useEffect } from 'react';

export function PostHogProvider({ children }: { children: React.ReactNode }) {
    useEffect(() => {
        // Initialize PostHog
        const posthogKey = process.env.NEXT_PUBLIC_POSTHOG_KEY;
        const posthogHost = process.env.NEXT_PUBLIC_POSTHOG_HOST || 'https://app.posthog.com';

        if (posthogKey) {
            posthog.init(posthogKey, {
                api_host: posthogHost,
                loaded: (posthog) => {
                    if (process.env.NODE_ENV === 'development') {
                        posthog.debug(); // Enable debug mode in development
                    }
                },
                capture_pageview: false, // We'll manually capture pageviews
                capture_pageleave: true,
                autocapture: true, // Auto-capture clicks and form interactions
            });
        }
    }, []);

    return <PHProvider client={posthog}>{children}</PHProvider>;
}
