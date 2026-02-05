import { createClient } from '@/lib/supabase/server';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, CreditCard, Activity, Crown } from 'lucide-react';

export default async function AdminDashboard() {
    const supabase = await createClient();

    // Fetch stats in parallel
    const [
        { count: totalUsers },
        { count: activeSubs },
        { count: proUsers }
    ] = await Promise.all([
        supabase.from('profiles').select('*', { count: 'exact', head: true }),
        supabase.from('subscriptions').select('*', { count: 'exact', head: true }).eq('status', 'active'),
        supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('subscription_tier', 'pro'),
    ]);

    const stats = [
        {
            title: 'Total Users',
            value: totalUsers || 0,
            icon: Users,
            description: 'All registered users',
        },
        {
            title: 'Active Subscriptions',
            value: activeSubs || 0,
            icon: CreditCard,
            description: 'Stripe active subs',
        },
        {
            title: 'Pro Users',
            value: proUsers || 0,
            icon: Crown,
            description: 'Pro tier members',
        },
        {
            title: 'Health',
            value: '99.9%',
            icon: Activity,
            description: 'System uptime',
        },
    ];

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Dashboard Overview</h1>
                <p className="text-muted-foreground mt-2">Welcome back, Admin.</p>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {stats.map((stat) => {
                    const Icon = stat.icon;
                    return (
                        <Card key={stat.title}>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">
                                    {stat.title}
                                </CardTitle>
                                <Icon className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{stat.value}</div>
                                <p className="text-xs text-muted-foreground">
                                    {stat.description}
                                </p>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <Card className="col-span-4">
                    <CardHeader>
                        <CardTitle>Recent Activity</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-sm text-muted-foreground text-center py-10">
                            No recent log activity found.
                        </div>
                    </CardContent>
                </Card>
                <Card className="col-span-3">
                    <CardHeader>
                        <CardTitle>Quick Actions</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-sm text-muted-foreground text-center py-10">
                            User management tools coming soon.
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
