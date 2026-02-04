# PostHog Analytics Setup Guide

> **Product Analytics for PadhLoYaarAI**  
> Track user behavior, understand engagement, and make data-driven decisions.

---

## 🎯 What is PostHog?

PostHog is an open-source product analytics platform that helps you:
- **Track user behavior** (pageviews, clicks, form submissions)
- **Analyze feature usage** (which AI tools are most popular)
- **Monitor conversions** (free → pro upgrades)
- **Create funnels** (user journey analysis)
- **Session replays** (watch how users interact with your app)

---

## 📋 Setup Steps

### 1. Create PostHog Account

1. Visit [https://app.posthog.com/signup](https://app.posthog.com/signup)
2. Sign up (Free plan available - 1M events/month)
3. Complete onboarding

### 2. Get Your Project API Key

1. After signup, go to **Project Settings**
2. Navigate to **Project API Key** section
3. Copy your **Project API Key**
4. Note your **PostHog Host URL** (usually `https://app.posthog.com`)

### 3. Configure Environment Variables

Add to your `.env.local`:

```bash
# PostHog Analytics
NEXT_PUBLIC_POSTHOG_KEY=phc_your_project_api_key_here
NEXT_PUBLIC_POSTHOG_HOST=https://app.posthog.com
```

> ⚠️ **Note**: The `NEXT_PUBLIC_` prefix makes this available client-side (it's write-only, safe to expose)

### 4. Restart Development Server

```bash
npm run dev
```

---

## ✅ Verify Installation

### Check Browser Console

1. Open your app in the browser
2. Open Developer Tools (F12)
3. Check Console for PostHog initialization message
4. In Network tab, filter for "posthog" to see events being sent

### Check PostHog Dashboard

1. Visit [https://app.posthog.com](https://app.posthog.com)
2. Go to **Activity** → **Event Explorer**
3. You should see events like:
   - `$pageview` (automatic)
   - `$pageleave` (automatic)
   - `$autocapture` (clicks, form interactions)

---

## 📊 What's Being Tracked

### Automatic Events (No Code Required)

✅ **Pageviews** - Every route change  
✅ **Page leaves** - When users navigate away  
✅ **Clicks** - Button and link clicks  
✅ **Form interactions** - Changes and submissions

### Custom Events (Using useAnalytics Hook)

The app includes a custom hook for tracking feature-specific events:

```typescript
import { useAnalytics } from '@/lib/hooks/useAnalytics';

const { trackToolUsage, trackSubscription, trackFeature } = useAnalytics();

// Track AI tool usage
trackToolUsage('flashcard-generator', query, true);

// Track subscription changes
trackSubscription('pro', 'upgraded');

// Track feature interactions
trackFeature('export-history', 'clicked');
```

### Pre-configured Events

| Event Name | When It Fires | Properties |
|------------|---------------|------------|
| `tool_used` | AI tool query submitted | `tool`, `query_length`, `success` |
| `subscription_changed` | Plan changed | `plan_id`, `action` |
| `feature_interaction` | Feature used | `feature`, `action` |

---

## 🔧 Advanced Configuration

### Enable Session Recordings

Add to PostHog project settings:
1. Go to **Project Settings** → **Recordings**
2. Enable **Record user sessions**
3. Configure sampling rate (e.g., 10% of sessions)

### Create Dashboards

1. Go to **Dashboards** → **New Dashboard**
2. Add insights like:
   - Most used AI tools
   - Conversion funnel (visitor → signup → paid)
   - Daily/weekly active users
   - Average session duration

### Set Up Funnels

Track user journey:
1. **Insight** → **New Funnel**
2. Add steps:
   - Visited homepage
   - Used AI tool
   - Viewed pricing
   - Upgraded to Pro

---

## 🎨 Recommended Dashboards

### 1. **Product Analytics**
- Total users (daily/weekly/monthly)
- Tool usage distribution
- Feature adoption rates
- User retention cohorts

### 2. **Conversion Metrics**
- Free → Pro conversion rate
- Time to first tool use
- Upgrade funnel drop-off points
- Churn rate by plan

### 3. **Engagement**
- Average tools used per session
- Session duration
- Return visit frequency
- Feature stickiness

---

## 🔒 Privacy & GDPR

PostHog is GDPR compliant and privacy-friendly:

- ✅ Self-hostable (optional - full data control)
- ✅ Auto-anonymization of IP addresses
- ✅ Cookie consent integration available
- ✅ Data retention controls
- ✅ User data deletion on request

### Exclude Sensitive Data

Update `PostHogProvider.tsx` to exclude PII:

```typescript
posthog.init(posthogKey, {
    // ... existing config
    sanitize_properties: (properties) => {
        const { email, password, ...rest } = properties;
        return rest; // Exclude email/password from events
    },
});
```

---

## 🚀 Using Analytics in Your App

### Track Custom Events

```typescript
'use client';

import { useAnalytics } from '@/lib/hooks/useAnalytics';

export function MyComponent() {
    const { trackEvent } = useAnalytics();
    
    const handleClick = () => {
        trackEvent('button_clicked', {
            button_name: 'upgrade_cta',
            location: 'pricing_page',
        });
    };
    
    return <button onClick={handleClick}>Upgrade</button>;
}
```

### Identify Users (After Login)

```typescript
import { useAnalytics } from '@/lib/hooks/useAnalytics';
import { useEffect } from 'react';

export function Profile({ user }: { user: User }) {
    const { identifyUser } = useAnalytics();
    
    useEffect(() => {
        if (user) {
            identifyUser(user.id, {
                email: user.email,
                subscription_tier: user.subscription_tier,
                signup_date: user.created_at,
            });
        }
    }, [user]);
    
    return <div>...</div>;
}
```

---

## 📈 Key Metrics to Track

### For Product Success
- **Activation**: % of users who use at least 1 AI tool in first session
- **Engagement**: Average tools used per week
- **Retention**: % of users returning after 7 days
- **Revenue**: Free → Pro conversion rate

### For Feature Development
- Which AI tools are most popular?
- Where do users drop off in funnels?
- Which features drive upgrades?
- What do power users do differently?

---

## 🛠️ Troubleshooting

### Events Not Showing Up?

1. **Check env vars**: Ensure `NEXT_PUBLIC_POSTHOG_KEY` is set
2. **Check console**: Look for PostHog errors in browser console
3. **Ad blockers**: May block PostHog requests (expected in dev)
4. **Network issues**: Check Network tab for failed requests

### Debug Mode

Enable in development:

```typescript
// In PostHogProvider.tsx
if (process.env.NODE_ENV === 'development') {
    posthog.debug(); // Already enabled!
}
```

This will log all events to console.

---

## 🎓 Resources

- [PostHog Docs](https://posthog.com/docs)
- [Next.js Integration Guide](https://posthog.com/docs/libraries/next-js)
- [Event Tracking Best Practices](https://posthog.com/docs/product-analytics/best-practices)
- [GDPR Compliance](https://posthog.com/docs/privacy)

---

## ✨ Next Steps

After setup:

1. ✅ Verify events are being tracked
2. 📊 Create your first dashboard
3. 🎯 Set up conversion funnels
4. 📧 Configure email alerts for key metrics
5. 🎬 Enable session recordings (optional)

**You're all set!** PostHog is now tracking user behavior and helping you make data-driven decisions. 🚀
