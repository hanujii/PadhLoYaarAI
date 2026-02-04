import * as Sentry from '@sentry/nextjs';

/**
 * Sentry Client Configuration
 * Tracks errors on the client (browser) side
 */

const SENTRY_DSN = process.env.NEXT_PUBLIC_SENTRY_DSN || process.env.SENTRY_DSN;

Sentry.init({
    dsn: SENTRY_DSN,

    // Adjust this value in production, or use tracesSampler for greater control
    tracesSampleRate: 1.0,

    // Setting this option to true will print useful information to the console while you're setting up Sentry.
    debug: false,

    // Capture Replay for 10% of all sessions,
    // plus for 100% of sessions with an error
    replaysOnErrorSampleRate: 1.0,
    replaysSessionSampleRate: 0.1,

    integrations: [
        Sentry.replayIntegration({
            maskAllText: true,
            blockAllMedia: true,
        }),
    ],

    // Filter out errors we don't care about
    beforeSend(event, hint) {
        // Don't send errors if Sentry is not configured
        if (!SENTRY_DSN) {
            return null;
        }

        // Filter out common browser errors
        const error = hint.originalException;
        if (error && typeof error === 'string') {
            // Ignore browser extension errors
            if (error.includes('chrome-extension://') || error.includes('moz-extension://')) {
                return null;
            }
        }

        return event;
    },
});
