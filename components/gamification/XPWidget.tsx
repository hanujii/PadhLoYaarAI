'use client';

import React, { useEffect } from 'react';
import { useGamificationStore } from '@/lib/gamification-store';
import { Progress } from '@/components/ui/progress';
import { Flame, Trophy } from 'lucide-react';
import { motion } from 'framer-motion';

export const XPWidget = () => {
    const { xp, level, streak, checkStreak } = useGamificationStore();

    useEffect(() => {
        checkStreak();
    }, []);

    const nextLevelXp = level * 100;
    const progress = (xp / nextLevelXp) * 100;

    return (
        <div className="flex items-center gap-3 bg-black/20 backdrop-blur-md rounded-full px-3 py-1 border border-white/5">
            {/* Level Badge */}
            <div className="flex items-center gap-1">
                <div className="bg-yellow-500/20 p-1 rounded-full">
                    <Trophy className="w-3 h-3 text-yellow-500" />
                </div>
                <span className="text-xs font-bold text-yellow-500">Lvl {level}</span>
            </div>

            {/* XP Bar */}
            <div className="w-16 hidden sm:block">
                <Progress value={progress} className="h-2 bg-white/10" />
            </div>

            {/* Streak */}
            <div className="flex items-center gap-1 text-xs font-medium text-orange-500">
                <Flame className="w-3 h-3 fill-orange-500 animate-pulse" />
                <span>{streak}</span>
            </div>
        </div>
    );
};
