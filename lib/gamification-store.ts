import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { toast } from 'sonner';

interface GamificationState {
    xp: number;
    level: number;
    streak: number;
    lastActiveDate: string | null;

    addXp: (amount: number) => void;
    checkStreak: () => void;
    sync: (userId: string) => Promise<void>;
    loadFromCloud: (userId: string) => Promise<void>;
}

export const useGamificationStore = create<GamificationState>()(
    persist(
        (set, get) => ({
            xp: 0,
            level: 1,
            streak: 0,
            lastActiveDate: null,

            addXp: (amount) => {
                const { xp, level } = get();
                const newXp = xp + amount;
                const nextLevelXp = level * 100; // Simple linear curve: 100, 200, 300...

                if (newXp >= nextLevelXp) {
                    set({ xp: newXp - nextLevelXp, level: level + 1 });
                    toast.success(`🎉 Level Up! You are now Level ${level + 1}!`);
                    // Here we could trigger a confetti component via a separate store or event
                } else {
                    set({ xp: newXp });
                }
            },

            checkStreak: () => {
                const { lastActiveDate, streak } = get();
                const today = new Date().toDateString();

                if (lastActiveDate === today) return; // Already checked today

                const yesterday = new Date();
                yesterday.setDate(yesterday.getDate() - 1);

                if (lastActiveDate === yesterday.toDateString()) {
                    set({ streak: streak + 1, lastActiveDate: today });
                    toast.message(`🔥 Streak increased! ${streak + 1} days!`);
                } else {
                    // Missed a day or first time
                    set({ streak: 1, lastActiveDate: today });
                    if (streak > 0) toast.message("Streak reset. Let's build it back up!");
                }
            }
        }),
        {
            name: 'gamification-storage',
        }
    )
);
