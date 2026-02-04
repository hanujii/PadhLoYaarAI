'use client';

import { Card } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { CalendarDays, Mail, TrendingUp } from 'lucide-react';

interface ProfileCardProps {
    profile: {
        full_name: string | null;
        email: string | null;
        subscription_tier: string;
        xp: number;
        level: number;
        streak: number;
        created_at: string;
    };
}

export function ProfileCard({ profile }: ProfileCardProps) {
    const tierColors = {
        free: 'bg-gray-500',
        pro: 'bg-gradient-to-r from-purple-500 to-pink-500',
        team: 'bg-gradient-to-r from-blue-500 to-cyan-500',
    };

    const tierColor = tierColors[profile.subscription_tier as keyof typeof tierColors] || tierColors.free;

    const initials = profile.full_name
        ? profile.full_name.split(' ').map(n => n[0]).join('').toUpperCase()
        : profile.email?.charAt(0).toUpperCase() || '?';

    const joinedDate = new Date(profile.created_at).toLocaleDateString('en-US', {
        month: 'long',
        year: 'numeric'
    });

    return (
        <Card className="p-6">
            <div className="flex items-start gap-4">
                <Avatar className="h-20 w-20">
                    <AvatarFallback className={`${tierColor} text-white text-2xl`}>
                        {initials}
                    </AvatarFallback>
                </Avatar>

                <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                        <h2 className="text-2xl font-bold">
                            {profile.full_name || 'Anonymous User'}
                        </h2>
                        <Badge className={tierColor}>
                            {profile.subscription_tier.toUpperCase()}
                        </Badge>
                    </div>

                    <div className="flex items-center gap-2 text-muted-foreground mb-4">
                        <Mail className="h-4 w-4" />
                        <span>{profile.email}</span>
                    </div>

                    <div className="flex items-center gap-6">
                        <div className="flex items-center gap-2">
                            <CalendarDays className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm text-muted-foreground">
                                Joined {joinedDate}
                            </span>
                        </div>

                        <div className="flex items-center gap-2">
                            <TrendingUp className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm text-muted-foreground">
                                {profile.streak} day streak 🔥
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* XP Progress Bar */}
            <div className="mt-6">
                <div className="flex justify-between text-sm mb-2">
                    <span className="font-medium">Level {profile.level}</span>
                    <span className="text-muted-foreground">{profile.xp} XP</span>
                </div>
                <div className="h-3 bg-secondary rounded-full overflow-hidden">
                    <div
                        className={`h-full ${tierColor} transition-all duration-500`}
                        style={{ width: `${Math.min((profile.xp % 1000) / 10, 100)}%` }}
                    />
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                    {1000 - (profile.xp % 1000)} XP to level {profile.level + 1}
                </p>
            </div>
        </Card>
    );
}
