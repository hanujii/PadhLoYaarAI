import { createClient } from '@supabase/supabase-js';

/**
 * Rate limiting configuration per tier
 */
export const RATE_LIMITS = {
    free: {
        dailyLimit: 100,
        hourlyLimit: 20,
    },
    pro: {
        dailyLimit: Infinity,
        hourlyLimit: Infinity,
    },
    team: {
        dailyLimit: Infinity,
        hourlyLimit: Infinity,
    },
} as const;

/**
 * Get Supabase client for rate limiting (server-side only)
 */
function getSupabaseClient() {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseServiceKey) {
        return null;
    }

    return createClient(supabaseUrl, supabaseServiceKey, {
        auth: {
            autoRefreshToken: false,
            persistSession: false,
        },
    });
}

interface RateLimitResult {
    allowed: boolean;
    remaining: number;
    resetAt: Date;
    tier: string;
}

/**
 * Check rate limit for a user
 * @param userId - User ID (null for anonymous users)
 * @param tool - Tool name being accessed
 * @param ipAddress - IP address for anonymous rate limiting
 * @returns Rate limit status
 */
export async function checkRateLimit(
    userId: string | null,
    tool: string,
    ipAddress?: string
): Promise<RateLimitResult> {
    const supabase = getSupabaseClient();

    // If Supabase not configured, allow all requests (dev mode)
    if (!supabase) {
        console.warn('Supabase not configured - rate limiting disabled');
        return {
            allowed: true,
            remaining: Infinity,
            resetAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
            tier: 'free',
        };
    }

    try {
        // Get user's subscription tier
        let tier: 'free' | 'pro' | 'team' = 'free';

        if (userId) {
            const { data: profile } = await supabase
                .from('profiles')
                .select('subscription_tier')
                .eq('id', userId)
                .single();

            tier = (profile?.subscription_tier as 'free' | 'pro' | 'team') || 'free';
        }

        const limits = RATE_LIMITS[tier];

        // Pro and Team have unlimited access
        if (limits.dailyLimit === Infinity) {
            // Still log usage for analytics
            await logUsage(userId, tool, ipAddress);
            return {
                allowed: true,
                remaining: Infinity,
                resetAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
                tier,
            };
        }

        // Check daily limit for free tier
        const startOfDay = new Date();
        startOfDay.setHours(0, 0, 0, 0);

        const identifier = userId || ipAddress;
        if (!identifier) {
            throw new Error('No user ID or IP address provided for rate limiting');
        }

        // Count requests today
        let query = supabase
            .from('usage_logs')
            .select('*', { count: 'exact', head: true })
            .gte('created_at', startOfDay.toISOString());

        if (userId) {
            query = query.eq('user_id', userId);
        } else {
            query = query.eq('ip_address', ipAddress);
        }

        const { count } = await query;
        const requestsToday = count || 0;

        if (requestsToday >= limits.dailyLimit) {
            return {
                allowed: false,
                remaining: 0,
                resetAt: new Date(startOfDay.getTime() + 24 * 60 * 60 * 1000),
                tier,
            };
        }

        // Log this request
        await logUsage(userId, tool, ipAddress);

        return {
            allowed: true,
            remaining: limits.dailyLimit - requestsToday - 1,
            resetAt: new Date(startOfDay.getTime() + 24 * 60 * 60 * 1000),
            tier,
        };
    } catch (error) {
        console.error('Rate limit check failed:', error);
        // On error, allow the request but log it
        return {
            allowed: true,
            remaining: 0,
            resetAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
            tier: 'free',
        };
    }
}

/**
 * Log usage for analytics and rate limiting
 */
async function logUsage(
    userId: string | null,
    tool: string,
    ipAddress?: string,
    tokenCount?: number
) {
    const supabase = getSupabaseClient();
    if (!supabase) return;

    try {
        await supabase.from('usage_logs').insert({
            user_id: userId,
            ip_address: ipAddress || null,
            tool,
            tokens_used: tokenCount || null,
            created_at: new Date().toISOString(),
        });
    } catch (error) {
        console.error('Failed to log usage:', error);
        // Don't throw - logging failure shouldn't block the request
    }
}

/**
 * Get user's current usage stats
 */
export async function getUserUsageStats(userId: string) {
    const supabase = getSupabaseClient();
    if (!supabase) return null;

    try {
        const startOfDay = new Date();
        startOfDay.setHours(0, 0, 0, 0);

        const { count } = await supabase
            .from('usage_logs')
            .select('*', { count: 'exact', head: true })
            .eq('user_id', userId)
            .gte('created_at', startOfDay.toISOString());

        const { data: profile } = await supabase
            .from('profiles')
            .select('subscription_tier')
            .eq('id', userId)
            .single();

        const tier = (profile?.subscription_tier as 'free' | 'pro' | 'team') || 'free';
        const limits = RATE_LIMITS[tier];

        return {
            requestsToday: count || 0,
            dailyLimit: limits.dailyLimit,
            remaining: limits.dailyLimit === Infinity
                ? Infinity
                : Math.max(0, limits.dailyLimit - (count || 0)),
            tier,
        };
    } catch (error) {
        console.error('Failed to get usage stats:', error);
        return null;
    }
}
