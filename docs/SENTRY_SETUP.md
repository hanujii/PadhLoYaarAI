# Sentry Setup Guide

## What is Sentry?
Sentry is an error tracking and performance monitoring platform that helps you:
- Catch errors in production before users report them
- Get detailed error context (stack traces, user info, browser details)
- Monitor application performance
- Track error trends over time

## Setup Steps

### 1. Create Sentry Account (Free)
1. Go to [sentry.io](https://sentry.io/signup/)
2. Sign up for free account (generous free tier: 5,000 errors/month)
3. Choose "Next.js" as your platform

### 2. Create a New Project
1. In Sentry dashboard, click **"Create Project"**
2. Select **Next.js** as the platform
3. Name it `padhloyaarai` (or your preferred name)
4. Click **Create Project**

### 3. Get Your DSN
After creating the project, you'll see a **DSN (Data Source Name)** that looks like:
```
https://abc123@o123456.ingest.sentry.io/7891011
```

Copy this value.

### 4. Add to Environment Variables
Add to your `.env.local`:

```bash
# Sentry Error Tracking
SENTRY_DSN=https://your-dsn-here@sentry.io/your-project-id

# Optional: For stricter organization
SENTRY_ORG=your-org-slug
SENTRY_PROJECT=padhloyaarai
```

> **Note**: The DSN is public and safe to expose on the client. It's write-only.

### 5. Verify Installation

The Sentry package should now be installed. Verify with:
```bash
npm list @sentry/nextjs
```

Configuration files are already created:
- ✅ `sentry.client.config.ts` - Browser errors
- ✅ `sentry.server.config.ts` - API route errors  
- ✅ `sentry.edge.config.ts` - Middleware errors

### 6. Test It Works

Add this to any page to test:
```typescript
import * as Sentry from '@sentry/nextjs';

// Trigger a test error
Sentry.captureMessage('Testing Sentry integration!');
```

Then check your Sentry dashboard - you should see the message appear within seconds.

## Features Enabled

### Error Tracking ✅
- Automatic error capture on client and server
- Stack traces with source maps
- User context (when authenticated)

### Session Replay ✅
- Records user sessions when errors occur
- 10% random sampling for behavior insights
- Privacy: All text masked, all media blocked

### Performance Monitoring
Currently disabled to save quota. To enable, update `sentry.*.config.ts`:
```typescript
tracesSampleRate: 0.1, // Track 10% of transactions
```

## Production Deployment

### Vercel
Sentry works automatically on Vercel. Add environment variables in:
**Vercel Dashboard > Your Project > Settings > Environment Variables**

Add:
- `SENTRY_DSN`
- `SENTRY_ORG` (optional)
- `SENTRY_PROJECT` (optional)

### Source Maps (Optional)
For better stack traces in production, add to `next.config.ts`:

```typescript
import { withSentryConfig } from '@sentry/nextjs';

const nextConfig = {
  // ... your config
};

export default withSentryConfig(nextConfig, {
  silent: true,
  org: process.env.SENTRY_ORG,
  project: process.env.SENTRY_PROJECT,
});
```

Then add to `.env.local`:
```bash
SENTRY_AUTH_TOKEN=your_auth_token_here
```

Get auth token from: **Sentry Settings > Auth Tokens**

## Cost & Limits

**Free Tier:**
- 5,000 errors/month
- 500 replays/month
- 10,000 performance units/month
- 7-day data retention

**Paid Plans:** Start at $26/month if you exceed free tier

## Alternatives (If You Skip Sentry)

If you don't want to set up Sentry now:
1. Errors will still be logged to console
2. Check Vercel logs for production errors
3. You can add Sentry later without code changes

The app **will work without Sentry** - it's optional for production monitoring.

## Troubleshooting

### "Sentry not capturing errors"
- Check DSN is correct in `.env.local`
- Restart dev server after adding DSN
- Verify Sentry package installed: `npm list @sentry/nextjs`

### "Source maps not working"
- Add `SENTRY_AUTH_TOKEN`
- Enable `withSentryConfig` in `next.config.ts`
- Rebuild: `npm run build`

### "Too many events"
- Reduce `tracesSampleRate` (default: 1.0 = 100%)
- Reduce `replaysSessionSampleRate` (default: 0.1 = 10%)
- Add more filters in `beforeSend` function

## Resources

- [Sentry Next.js Docs](https://docs.sentry.io/platforms/javascript/guides/nextjs/)
- [Sentry Dashboard](https://sentry.io/)
- Your project: `https://sentry.io/organizations/YOUR_ORG/projects/padhloyaarai/`
