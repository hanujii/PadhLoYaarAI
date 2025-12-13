import { create } from 'zustand';

interface TimerState {
    timeLeft: number; // in seconds
    isActive: boolean;
    duration: number; // Current set duration in seconds
    mode: 'study' | 'shortBreak' | 'longBreak';
    startTimer: () => void;
    stopTimer: () => void;
    resetTimer: () => void;
    setDuration: (minutes: number) => void;
    tick: () => void;
}

interface MusicState {
    isPlaying: boolean;
    volume: number;
    genre: string;
    togglePlay: () => void;
    setVolume: (vol: number) => void;
    setGenre: (genre: string) => void;
}

interface GlobalStore extends TimerState, MusicState { }

export const useStore = create<GlobalStore>((set) => ({
    // Timer defaults
    timeLeft: 25 * 60,
    duration: 25 * 60,
    isActive: false,
    mode: 'study',
    startTimer: () => set({ isActive: true }),
    stopTimer: () => set({ isActive: false }),
    resetTimer: () => set((state) => ({
        isActive: false,
        timeLeft: state.duration
    })),
    setDuration: (minutes) => set({
        duration: minutes * 60,
        timeLeft: minutes * 60,
        isActive: false
    }),
    tick: () => set((state) => {
        if (state.timeLeft <= 0) {
            return { isActive: false };
        }
        return { timeLeft: state.timeLeft - 1 };
    }),

    // Music defaults
    isPlaying: false,
    volume: 0.5,
    genre: 'lofi',
    togglePlay: () => set((state) => ({ isPlaying: !state.isPlaying })),
    setVolume: (volume) => set({ volume }),
    setGenre: (genre) => set({ genre, isPlaying: true }), // Auto play when genre changes
}));
