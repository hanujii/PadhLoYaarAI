import * as Sentry from '@sentry/nextjs';

/**
 * Sentry Server Configuration
 * Tracks errors on the server (Node.js/Next.js API routes) side
 */

const SENTRY_DSN = process.env.SENTRY_DSN;

Sentry.init({
    dsn: SENTRY_DSN,

    // Adjust this value in production, or use tracesSampler for greater control
    tracesSampleRate: 1.0,

    // Setting this option to true will print useful information to the console while you're setting up Sentry.
    debug: false,

    // Don't send errors if Sentry is not configured
    enabled: !!SENTRY_DSN,
});
