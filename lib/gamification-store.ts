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
            },

            sync: async (userId: string) => {
                try {
                    const { xp, level, streak } = get();
                    const { supabase } = await import('@/lib/supabase/client'); // Dynamic import to avoid cycles/server issues if any

                    const { error } = await supabase
                        .from('profiles')
                        .upsert({
                            id: userId,
                            xp: xp,
                            level: level,
                            streak: streak,
                            updated_at: new Date().toISOString(),
                        });

                    if (error) throw error;
                    console.log("Gamification synced to cloud.");
                } catch (e) {
                    console.error("Failed to sync gamification:", e);
                }
            },

            loadFromCloud: async (userId: string) => {
                try {
                    const { supabase } = await import('@/lib/supabase/client');


                    const { data, error } = await supabase
                        .from('profiles')
                        .select('xp, level, streak')
                        .eq('id', userId)
                        .single();

                    if (error) {
                        // if error is 'PGRST116' (no rows), it's fine, new user
                        if (error.code !== 'PGRST116') console.error("Error loading gamification:", error);
                        return;
                    }

                    if (data) {
                        // Merge strategy: Max of local vs cloud? Or trust cloud? 
                        // Usually cloud is source of truth if logging in.
                        set({
                            xp: data.xp || 0,
                            level: data.level || 1,
                            streak: data.streak || 0
                        });
                        console.log("Gamification loaded from cloud.");
                    }
                } catch (e) {
                    console.error("Failed to load gamification:", e);
                }
            }
        }),
        {
            name: 'gamification-storage',
        }
    )
);
