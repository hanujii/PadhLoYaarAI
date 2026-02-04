import { usePostHog } from 'posthog-js/react';

/**
 * Custom hook for tracking events in PostHog
 * Usage: const { trackEvent } = useAnalytics();
 */
export function useAnalytics() {
    const posthog = usePostHog();

    const trackEvent = (eventName: string, properties?: Record<string, any>) => {
        if (posthog) {
            posthog.capture(eventName, properties);
        }
    };

    const identifyUser = (userId: string, properties?: Record<string, any>) => {
        if (posthog) {
            posthog.identify(userId, properties);
        }
    };

    const trackToolUsage = (tool: string, query: string, success: boolean) => {
        trackEvent('tool_used', {
            tool,
            query_length: query.length,
            success,
        });
    };

    const trackSubscription = (planId: string, action: 'upgraded' | 'downgraded' | 'canceled') => {
        trackEvent('subscription_changed', {
            plan_id: planId,
            action,
        });
    };

    const trackFeature = (feature: string, action: 'viewed' | 'used' | 'clicked') => {
        trackEvent('feature_interaction', {
            feature,
            action,
        });
    };

    return {
        trackEvent,
        identifyUser,
        trackToolUsage,
        trackSubscription,
        trackFeature,
    };
}
