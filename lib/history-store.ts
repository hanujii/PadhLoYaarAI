import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export interface HistoryItem {
    id: string;
    tool: string;
    type?: string;
    query: string;
    result: string;
    timestamp: number;
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
    addToHistory: (item: Omit<HistoryItem, 'id' | 'timestamp'>) => void;
    removeFromHistory: (id: string) => void;
    clearHistory: () => void;
    saveItem: (item: Omit<SavedItem, 'id' | 'timestamp'>) => void;
    removeFromSaved: (id: string) => void;
    updateNotes: (content: string) => void;
    updateNotesTitle: (title: string) => void;
}

export const useHistoryStore = create<HistoryState>()(
    persist(
        (set) => ({
            history: [],
            savedItems: [],
            notes: '',
            notesTitle: '',
            addToHistory: (item) => set((state) => ({
                history: [
                    { ...item, id: crypto.randomUUID(), timestamp: Date.now() },
                    ...state.history
                ].slice(0, 50) // Keep last 50 items
            })),
            removeFromHistory: (id) => set((state) => ({
                history: state.history.filter((i) => i.id !== id)
            })),
            clearHistory: () => set({ history: [] }),
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
        }),
        {
            name: 'padhloyaar-history-storage',
            storage: createJSONStorage(() => localStorage),
        }
    )
);
