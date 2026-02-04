import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

/**
 * Export all user data (GDPR Right to Access)
 * Returns a JSON file with all user information
 */
export async function GET(request: NextRequest) {
    try {
        const supabase = await createClient();

        // Get current user
        const { data: { user }, error: authError } = await supabase.auth.getUser();
        if (authError || !user) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        // Fetch all user data
        const [profile, subscriptions, history, usage] = await Promise.all([
            supabase.from('profiles').select('*').eq('id', user.id).maybeSingle(),
            supabase.from('subscriptions').select('*').eq('user_id', user.id),
            supabase.from('user_history').select('*').eq('user_id', user.id),
            supabase.from('usage_logs').select('*').eq('user_id', user.id).order('created_at', { ascending: false }).limit(1000),
        ]);

        // Compile export data
        const exportData = {
            export_info: {
                exported_at: new Date().toISOString(),
                user_id: user.id,
                email: user.email,
                format_version: '1.0',
            },
            profile: profile.data,
            subscriptions: subscriptions.data,
            history: {
                total_items: history.data?.length || 0,
                items: history.data,
            },
            usage_statistics: {
                total_requests: usage.data?.length || 0,
                recent_usage: usage.data,
            },
        };

        // Return as downloadable JSON
        const filename = `padhloyaar-data-${user.id.substring(0, 8)}-${Date.now()}.json`;

        return new Response(JSON.stringify(exportData, null, 2), {
            headers: {
                'Content-Type': 'application/json',
                'Content-Disposition': `attachment; filename="${filename}"`,
            },
        });
    } catch (error) {
        console.error('Error exporting user data:', error);
        return NextResponse.json(
            { error: 'Failed to export data' },
            { status: 500 }
        );
    }
}
