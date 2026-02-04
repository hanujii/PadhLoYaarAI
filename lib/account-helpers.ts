import { createClient } from '@/lib/supabase/client';

/**
 * Get current user's profile data
 */
export async function getUserProfile(userId: string) {
    const supabase = createClient();

    const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

    if (error) throw error;
    return data;
}

/**
 * Get current user's subscription data
 */
export async function getUserSubscription(userId: string) {
    const supabase = createClient();

    const { data, error } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

    return data; // Returns null if no subscription
}

/**
 * Get user's usage statistics
 */
export async function getUserUsageStats(userId: string) {
    const supabase = createClient();

    // Get today's usage
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const { count: todayCount } = await supabase
        .from('usage_logs')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId)
        .gte('created_at', startOfDay.toISOString());

    // Get total usage
    const { count: totalCount } = await supabase
        .from('usage_logs')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId);

    // Get most used tools
    const { data: toolUsage } = await supabase
        .from('usage_logs')
        .select('tool')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(100);

    // Count tool frequency
    const toolCounts: Record<string, number> = {};
    toolUsage?.forEach((log) => {
        toolCounts[log.tool] = (toolCounts[log.tool] || 0) + 1;
    });

    const topTools = Object.entries(toolCounts)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 5)
        .map(([tool, count]) => ({ tool, count }));

    return {
        todayCount: todayCount || 0,
        totalCount: totalCount || 0,
        topTools,
    };
}

/**
 * Update user profile
 */
export async function updateUserProfile(
    userId: string,
    updates: {
        full_name?: string;
        email?: string;
    }
) {
    const supabase = createClient();

    const { data, error } = await supabase
        .from('profiles')
        .update({
            ...updates,
            updated_at: new Date().toISOString(),
        })
        .eq('id', userId)
        .select()
        .single();

    if (error) throw error;
    return data;
}
