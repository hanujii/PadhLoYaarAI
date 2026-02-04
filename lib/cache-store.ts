import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface CacheEntry {
    data: any;
    timestamp: number;
}

interface CacheStore {
    cache: Record<string, CacheEntry>;
    setCache: (key: string, data: any) => void;
    getCache: (key: string, ttlSeconds?: number) => any | null;
    clearCache: () => void;
}

// 24 Hour default TTL
const DEFAULT_TTL = 24 * 60 * 60;

export const useCacheStore = create<CacheStore>()(
    persist(
        (set, get) => ({
            cache: {},
            setCache: (key, data) => {
                set((state) => ({
                    cache: {
                        ...state.cache,
                        [key]: { data, timestamp: Date.now() },
                    },
                }));
            },
            getCache: (key, ttlSeconds = DEFAULT_TTL) => {
                const state = get();
                const entry = state.cache[key];

                if (!entry) return null;

                const ageSeconds = (Date.now() - entry.timestamp) / 1000;
                if (ageSeconds > ttlSeconds) {
                    // Lazy deletion
                    const newCache = { ...state.cache };
                    delete newCache[key];
                    set({ cache: newCache });
                    return null;
                }

                return entry.data;
            },
            clearCache: () => set({ cache: {} }),
        }),
        {
            name: 'app-cache-storage',
            storage: createJSONStorage(() => localStorage),
        }
    )
);
