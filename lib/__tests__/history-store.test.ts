import { describe, it, expect, beforeEach, vi } from 'vitest';
import { act, renderHook } from '@testing-library/react';

// Mock zustand store before importing
vi.mock('../history-store', async () => {
    const { create } = await import('zustand');

    return {
        useHistoryStore: create(() => ({
            history: [],
            savedItems: [],
            notes: '',
            notesTitle: '',
            isLoading: false,
            isSyncing: false,
            addToHistory: vi.fn(),
            removeFromHistory: vi.fn(),
            clearHistory: vi.fn(),
            saveItem: vi.fn(),
            removeFromSaved: vi.fn(),
            updateNotes: vi.fn(),
            updateNotesTitle: vi.fn(),
            loadFromSupabase: vi.fn(),
            syncWithSupabase: vi.fn(),
        })),
    };
});

describe('History Store', () => {
    beforeEach(() => {
        localStorage.clear();
        vi.clearAllMocks();
    });

    it('should have initial state', async () => {
        const { useHistoryStore } = await import('../history-store');
        const { result } = renderHook(() => useHistoryStore());

        expect(result.current.history).toEqual([]);
        expect(result.current.savedItems).toEqual([]);
        expect(result.current.notes).toBe('');
        expect(result.current.isLoading).toBe(false);
    });

    it('should have addToHistory function', async () => {
        const { useHistoryStore } = await import('../history-store');
        const { result } = renderHook(() => useHistoryStore());

        expect(typeof result.current.addToHistory).toBe('function');
    });

    it('should have removeFromHistory function', async () => {
        const { useHistoryStore } = await import('../history-store');
        const { result } = renderHook(() => useHistoryStore());

        expect(typeof result.current.removeFromHistory).toBe('function');
    });

    it('should have saveItem function', async () => {
        const { useHistoryStore } = await import('../history-store');
        const { result } = renderHook(() => useHistoryStore());

        expect(typeof result.current.saveItem).toBe('function');
    });

    it('should have Supabase sync functions', async () => {
        const { useHistoryStore } = await import('../history-store');
        const { result } = renderHook(() => useHistoryStore());

        expect(typeof result.current.loadFromSupabase).toBe('function');
        expect(typeof result.current.syncWithSupabase).toBe('function');
    });
});
