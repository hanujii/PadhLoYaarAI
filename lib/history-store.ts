import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface HistoryItem {
    id: string;
    type: 'chat' | 'generation';
    tool: string; // e.g., 'tutor', 'code-transformer'
    query: string;
    result: string;
    timestamp: number;
}

export interface SavedItem {
    id: string;
    type: 'note' | 'result';
    title: string;
    content: string;
    timestamp: number;
}

interface HistoryState {
    notes: string;
    history: HistoryItem[];
    savedItems: SavedItem[];

    // Actions
    updateNotes: (content: string) => void;
    addToHistory: (item: Omit<HistoryItem, 'id' | 'timestamp'>) => void;
    saveItem: (item: Omit<SavedItem, 'id' | 'timestamp'>) => void;
    removeFromHistory: (id: string) => void;
    removeFromSaved: (id: string) => void;
    clearHistory: () => void;
}

export const useHistoryStore = create<HistoryState>()(
    persist(
        (set) => ({
            notes: '',
            history: [],
            savedItems: [],

            updateNotes: (content) => set({ notes: content }),

            addToHistory: (item) => set((state) => ({
                history: [
                    {
                        ...item,
                        id: crypto.randomUUID(),
                        timestamp: Date.now(),
                    },
                    ...state.history
                ].slice(0, 50) // Keep last 50 items
            })),

            saveItem: (item) => set((state) => ({
                savedItems: [
                    {
                        ...item,
                        id: crypto.randomUUID(),
                        timestamp: Date.now(),
                    },
                    ...state.savedItems
                ]
            })),

            removeFromHistory: (id) => set((state) => ({
                history: state.history.filter((i) => i.id !== id)
            })),

            removeFromSaved: (id) => set((state) => ({
                savedItems: state.savedItems.filter((i) => i.id !== id)
            })),

            clearHistory: () => set({ history: [] }),
        }),
        {
            name: 'padh-lo-yaar-history',
        }
    )
);
