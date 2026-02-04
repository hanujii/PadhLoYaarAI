import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { getUserProfile, getUserSubscription, getUserUsageStats } from '@/lib/account-helpers';
import { ProfileCard } from '@/components/account/ProfileCard';
import { SubscriptionCard } from '@/components/account/SubscriptionCard';
import { UsageStatsCard } from '@/components/account/UsageStatsCard';
import { DangerZone } from '@/components/account/DangerZone';

export const metadata = {
    title: 'Account Settings | PadhLoYaarAI',
    description: 'Manage your account, subscription, and preferences',
};

export default async function AccountPage() {
    const supabase = await createClient();

    // Check auth
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
        redirect('/login?redirect=/account');
    }

    // Fetch all data in parallel
    const [profile, subscription, stats] = await Promise.all([
        getUserProfile(user.id),
        getUserSubscription(user.id),
        getUserUsageStats(user.id),
    ]);

    if (!profile) {
        return (
            <div className="container mx-auto py-8 px-4">
                <h1 className="text-3xl font-bold mb-6">Account Settings</h1>
                <p>Profile not found. Please contact support.</p>
            </div>
        );
    }

    return (
        <div className="container mx-auto py-8 px-4 max-w-6xl">
            <h1 className="text-3xl font-bold mb-8">Account Settings</h1>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column - Profile */}
                <div className="lg:col-span-2 space-y-6">
                    <ProfileCard profile={profile} />
                    <UsageStatsCard
                        stats={stats}
                        tier={profile.subscription_tier}
                    />
                </div>

                {/* Right Column - Subscription & Settings */}
                <div className="space-y-6">
                    <SubscriptionCard
                        subscription={subscription}
                        tier={profile.subscription_tier}
                    />
                    <DangerZone />
                </div>
            </div>
        </div>
    );
}
