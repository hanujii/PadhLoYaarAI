import { create } from 'zustand';

/**
 * State for the Focus Timer (Pomodoro style).
 * Tracks time remaining, active state, and the user's chosen duration.
 */
interface TimerState {
    timeLeft: number; // Current seconds remaining
    isActive: boolean; // Is the timer currently ticking?
    duration: number; // The total duration set by the user (e.g., 25mins)
    mode: 'study' | 'shortBreak' | 'longBreak'; // Current timer mode
    startTimer: () => void;
    stopTimer: () => void;
    resetTimer: () => void;
    setDuration: (minutes: number) => void;
    tick: () => void; // Decrements time by 1 second
}

/**
 * State for the Background Music player.
 * Controls playback, volume, and genre selection for study ambiance.
 */
interface MusicState {
    isPlaying: boolean;
    volume: number;
    genre: string;
    togglePlay: () => void;
    setVolume: (vol: number) => void;
    setGenre: (genre: string) => void;
}

interface NotesState {
    isNotesOpen: boolean;
    setNotesOpen: (isOpen: boolean) => void;
}

// Combine all slices into one Global Store
interface GlobalStore extends TimerState, MusicState, NotesState { }

export const useStore = create<GlobalStore>((set) => ({
    // --- Timer Logic ---
    timeLeft: 25 * 60, // Default to 25 minutes
    duration: 25 * 60,
    isActive: false,
    mode: 'study',

    startTimer: () => set({ isActive: true }),
    stopTimer: () => set({ isActive: false }),

    // Resets the timer back to the original full duration
    resetTimer: () => set((state) => ({
        isActive: false,
        timeLeft: state.duration
    })),

    // Updates the duration and resets the clock immediately
    setDuration: (minutes) => set({
        duration: minutes * 60,
        timeLeft: minutes * 60,
        isActive: false
    }),

    // The 'heartbeat' of the timer, called every second by the component
    tick: () => set((state) => {
        if (state.timeLeft <= 0) {
            return { isActive: false }; // Stop when we hit zero
        }
        return { timeLeft: state.timeLeft - 1 };
    }),

    // --- Music Logic ---
    isPlaying: false,
    volume: 0.5,
    genre: 'lofi',

    togglePlay: () => set((state) => ({ isPlaying: !state.isPlaying })),
    setVolume: (volume) => set({ volume }),

    // Automatically start playing when the user picks a new genre
    setGenre: (genre) => set({ genre, isPlaying: true }),

    // --- Notes Logic ---
    isNotesOpen: false,
    setNotesOpen: (isOpen) => set({ isNotesOpen: isOpen }),
}));
