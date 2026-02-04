'use client';

import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Activity, Zap, TrendingUp } from 'lucide-react';

interface UsageStatsCardProps {
    stats: {
        todayCount: number;
        totalCount: number;
        topTools: Array<{ tool: string; count: number }>;
    };
    tier: string;
}

export function UsageStatsCard({ stats, tier }: UsageStatsCardProps) {
    const dailyLimit = tier === 'free' ? 100 : Infinity;
    const usagePercentage = tier === 'free'
        ? Math.min((stats.todayCount / dailyLimit) * 100, 100)
        : 0;

    const remaining = tier === 'free' ? Math.max(0, dailyLimit - stats.todayCount) : Infinity;

    return (
        <Card className="p-6">
            <div className="flex items-center gap-2 mb-6">
                <Activity className="h-5 w-5 text-primary" />
                <h3 className="font-semibold text-lg">Usage Statistics</h3>
            </div>

            {/* Today's Usage */}
            <div className="mb-6">
                <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium">Today's Requests</span>
                    <span className="text-sm text-muted-foreground">
                        {stats.todayCount} / {tier === 'free' ? dailyLimit : '∞'}
                    </span>
                </div>

                {tier === 'free' && (
                    <>
                        <Progress value={usagePercentage} className="h-2" />
                        <p className="text-xs text-muted-foreground mt-1">
                            {remaining} requests remaining today
                        </p>
                    </>
                )}

                {tier !== 'free' && (
                    <div className="flex items-center gap-2 text-sm text-green-600">
                        <Zap className="h-4 w-4" />
                        <span>Unlimited requests with {tier.charAt(0).toUpperCase() + tier.slice(1)} plan</span>
                    </div>
                )}
            </div>

            {/* Total Usage */}
            <div className="mb-6 p-4 bg-secondary rounded-lg">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-sm text-muted-foreground">Total Requests</p>
                        <p className="text-2xl font-bold">{stats.totalCount.toLocaleString()}</p>
                    </div>
                    <TrendingUp className="h-8 w-8 text-primary opacity-50" />
                </div>
            </div>

            {/* Top Tools */}
            {stats.topTools.length > 0 && (
                <div>
                    <h4 className="text-sm font-medium mb-3">Most Used Tools</h4>
                    <div className="space-y-2">
                        {stats.topTools.map((tool, index) => (
                            <div key={tool.tool} className="flex items-center justify-between text-sm">
                                <span className="text-muted-foreground">
                                    {index + 1}. {tool.tool}
                                </span>
                                <span className="font-medium">{tool.count}×</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </Card>
    );
}
