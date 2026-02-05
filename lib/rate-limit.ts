import { createClient } from '@/lib/supabase/server';
import { headers } from 'next/headers';

/**
 * Checks if the current user/IP has exceeded their daily rate limit.
 * Logs the request if allowed.
 * Throws an error if limit exceeded.
 */
export async function checkRateLimit(toolName: string) {
    const supabase = await createClient();

    // Get current user
    const { data: { user } } = await supabase.auth.getUser();

    // Get IP address for anonymous rate limiting
    const headersList = await headers();
    const ip = headersList.get('x-forwarded-for') || 'anonymous';

    // Default Limits
    let limit = 10; // 10 per day for anonymous (tight limit)
    let isPro = false;

    if (user) {
        // Fetch User Tier
        const { data: profile } = await supabase
            .from('profiles')
            .select('subscription_tier')
            .eq('id', user.id)
            .single();

        const tier = profile?.subscription_tier || 'free';

        if (tier === 'free') {
            limit = 100; // 100 per day for free users
        } else {
            limit = 10000; // Unlimited (effectively) for Pro/Team
            isPro = true;
        }
    }

    // Determine identifier (User ID or IP)
    const identifier = user ? user.id : ip;
    const idColumn = user ? 'user_id' : 'ip_address';

    // Calculate start of day (UTC? or Local? UTC is safer for consistency)
    const startOfDay = new Date();
    startOfDay.setUTCHours(0, 0, 0, 0);

    // Count usage today
    const { count, error } = await supabase
        .from('usage_logs')
        .select('*', { count: 'exact', head: true })
        .eq(idColumn, identifier)
        .gte('created_at', startOfDay.toISOString());

    if (error) {
        console.error('Rate limit check error:', error);
        // Fail open (allow request) if DB error, to avoid blocking legit users during outage
        return;
    }

    const currentUsage = count || 0;

    if (currentUsage >= limit) {
        if (!user) {
            throw new Error('Daily limit reached. Please sign in for more credits.');
        }
        throw new Error(`Daily limit of ${limit} requests reached. Upgrade to Pro for unlimited access.`);
    }

    // Log this request
    // We log "intent to use". Even if generation fails later, it counts against quota 
    // to prevent spamming expensive endpoints with bad inputs.
    await supabase.from('usage_logs').insert({
        user_id: user?.id || null,
        ip_address: !user ? ip : null,
        tool: toolName,
        model_used: 'auto', // We don't know the exact model yet, but that's fine for simple rate limiting
        created_at: new Date().toISOString()
    });

    return { success: true, remaining: limit - currentUsage - 1 };
}
