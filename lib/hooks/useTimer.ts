/**
 * Custom hook for timer functionality
 * Prevents Header from re-rendering on every tick
 */

import { useEffect, useRef } from 'react';
import { useStore } from '@/lib/store';

export function useTimer() {
    const { timeLeft, isActive, startTimer, stopTimer, resetTimer, setDuration, tick } = useStore();
    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        // Clear any existing interval
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        }

        if (isActive && timeLeft > 0) {
            intervalRef.current = setInterval(() => {
                const currentState = useStore.getState();
                if (currentState.timeLeft <= 0) {
                    currentState.stopTimer();
                } else {
                    currentState.tick();
                }
            }, 1000);
        } else if (timeLeft === 0 && isActive) {
            stopTimer();
        }

        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
                intervalRef.current = null;
            }
        };
    }, [isActive, timeLeft, stopTimer]);

    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    const formattedTime = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

    return {
        formattedTime,
        isActive,
        startTimer,
        stopTimer,
        resetTimer,
        setDuration,
    };
}
