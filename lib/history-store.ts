import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { createClient } from '@/lib/supabase/client';

export interface HistoryItem {
    id: string;
    tool: string;
    type?: string;
    query: string;
    result: string;
    timestamp: number;
    metadata?: Record<string, unknown>;
}

export interface SavedItem {
    id: string;
    type: 'result' | 'note';
    title: string;
    content: string;
    timestamp: number;
}

interface HistoryState {
    history: HistoryItem[];
    savedItems: SavedItem[];
    notes: string;
    notesTitle: string;
    isLoading: boolean;
    isSyncing: boolean;

    // Existing functions
    addToHistory: (item: Omit<HistoryItem, 'id' | 'timestamp'>) => void;
    removeFromHistory: (id: string) => Promise<void>;
    clearHistory: () => Promise<void>;
    saveItem: (item: Omit<SavedItem, 'id' | 'timestamp'>) => void;
    removeFromSaved: (id: string) => void;
    updateNotes: (content: string) => void;
    updateNotesTitle: (title: string) => void;

    // New Supabase sync functions
    syncWithSupabase: (userId: string) => Promise<void>;
    loadFromSupabase: (userId: string) => Promise<void>;
}

export const useHistoryStore = create<HistoryState>()(
    persist(
        (set, get) => ({
            history: [],
            savedItems: [],
            notes: '',
            notesTitle: '',
            isLoading: false,
            isSyncing: false,

            addToHistory: (item) => {
                const newItem = {
                    ...item,
                    id: crypto.randomUUID(),
                    timestamp: Date.now()
                };

                set((state) => ({
                    history: [newItem, ...state.history].slice(0, 50)
                }));

                // Async save to Supabase with proper error handling
                const saveToSupabase = async () => {
                    try {
                        const supabase = createClient();
                        const { data: { user }, error: authError } = await supabase.auth.getUser();

                        if (authError) {
                            if (process.env.NODE_ENV === 'development') {
                                console.error('Auth error in history sync:', authError);
                            }
                            return; // Silently fail if not authenticated
                        }

                        if (user) {
                            const { error: insertError } = await supabase.from('user_history').insert({
                                user_id: user.id,
                                tool: item.tool,
                                query: item.query,
                                result: { content: item.result }, // Store as JSONB
                                metadata: item.metadata || {},
                            });

                            if (insertError) {
                                // Only log in development, don't spam production logs
                                if (process.env.NODE_ENV === 'development') {
                                    console.error('Failed to sync history to Supabase:', insertError);
                                }
                                // Could optionally show a toast here, but might be too noisy
                            }
                        }
                    } catch (error) {
                        // Unexpected errors - log in development only
                        if (process.env.NODE_ENV === 'development') {
                            console.error('Unexpected error syncing history:', error);
                        }
                    }
                };

                // Debounce: Only save if not already syncing
                const state = get();
                if (!state.isSyncing) {
                    saveToSupabase();
                }
            },

            removeFromHistory: async (id) => {
                set((state) => ({
                    history: state.history.filter((i) => i.id !== id)
                }));

                // Remove from Supabase
                try {
                    const supabase = createClient();
                    const { data: { user } } = await supabase.auth.getUser();

                    if (user) {
                        await supabase
                            .from('user_history')
                            .delete()
                            .eq('id', id)
                            .eq('user_id', user.id);
                    }
                } catch (error) {
                    console.error('Failed to delete from Supabase:', error);
                }
            },

            clearHistory: async () => {
                set({ history: [] });

                // Clear from Supabase
                try {
                    const supabase = createClient();
                    const { data: { user } } = await supabase.auth.getUser();

                    if (user) {
                        await supabase
                            .from('user_history')
                            .delete()
                            .eq('user_id', user.id);
                    }
                } catch (error) {
                    console.error('Failed to clear Supabase history:', error);
                }
            },

            saveItem: (item) => set((state) => ({
                savedItems: [
                    { ...item, id: crypto.randomUUID(), timestamp: Date.now() },
                    ...state.savedItems
                ]
            })),

            removeFromSaved: (id) => set((state) => ({
                savedItems: state.savedItems.filter((i) => i.id !== id)
            })),

            updateNotes: (content) => set({ notes: content }),
            updateNotesTitle: (title) => set({ notesTitle: title }),

            // Load history from Supabase
            loadFromSupabase: async (userId: string) => {
                set({ isLoading: true });

                try {
                    const supabase = createClient();
                    const { data, error } = await supabase
                        .from('user_history')
                        .select('*')
                        .eq('user_id', userId)
                        .order('created_at', { ascending: false })
                        .limit(50);

                    if (error) throw error;

                    if (data) {
                        const historyItems: HistoryItem[] = data.map((item) => ({
                            id: item.id,
                            tool: item.tool,
                            query: item.query || '',
                            result: typeof item.result === 'object' ? item.result.content : item.result,
                            timestamp: new Date(item.created_at).getTime(),
                            metadata: item.metadata || {},
                        }));

                        set({ history: historyItems });
                    }
                } catch (error) {
                    console.error('Failed to load history from Supabase:', error);
                } finally {
                    set({ isLoading: false });
                }
            },

            // Sync local history to Supabase (one-time migration)
            syncWithSupabase: async (userId: string) => {
                const state = get();
                if (state.isSyncing || state.history.length === 0) return;

                set({ isSyncing: true });

                try {
                    const supabase = createClient();

                    // Upload local history to Supabase
                    const uploads = state.history.map((item) => ({
                        user_id: userId,
                        tool: item.tool,
                        query: item.query,
                        result: { content: item.result },
                        metadata: item.metadata || {},
                        created_at: new Date(item.timestamp).toISOString(),
                    }));

                    const { error } = await supabase
                        .from('user_history')
                        .insert(uploads);

                    if (error) throw error;

                    console.log('Successfully synced history to Supabase');
                } catch (error) {
                    console.error('Failed to sync with Supabase:', error);
                } finally {
                    set({ isSyncing: false });
                }
            },
        }),
        {
            name: 'padhloyaar-history-storage',
            storage: createJSONStorage(() => localStorage),
            partialize: (state) => ({
                // Only persist these fields to localStorage
                savedItems: state.savedItems,
                notes: state.notes,
                notesTitle: state.notesTitle,
                // Don't persist history - it comes from Supabase
            }),
        }
    )
);
