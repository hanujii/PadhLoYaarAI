import * as Sentry from '@sentry/nextjs';

/**
 * Sentry Edge Configuration
 * Tracks errors in Edge Runtime (middleware, edge functions)
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
