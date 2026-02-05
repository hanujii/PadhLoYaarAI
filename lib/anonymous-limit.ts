'use client';

const STORAGE_KEY = 'ply-anonymous-usage';
const MAX_ANONYMOUS_ATTEMPTS = 5;

interface AnonymousUsage {
    count: number;
    lastReset: string; // ISO date string
}

/**
 * Get or initialize anonymous usage data from localStorage
 */
function getUsageData(): AnonymousUsage {
    if (typeof window === 'undefined') {
        return { count: 0, lastReset: new Date().toISOString() };
    }

    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
        const initial: AnonymousUsage = {
            count: 0,
            lastReset: new Date().toISOString(),
        };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(initial));
        return initial;
    }

    try {
        const data = JSON.parse(stored) as AnonymousUsage;

        // Reset if it's a new day (UTC)
        const lastResetDate = new Date(data.lastReset).toDateString();
        const todayDate = new Date().toDateString();

        if (lastResetDate !== todayDate) {
            const reset: AnonymousUsage = {
                count: 0,
                lastReset: new Date().toISOString(),
            };
            localStorage.setItem(STORAGE_KEY, JSON.stringify(reset));
            return reset;
        }

        return data;
    } catch {
        return { count: 0, lastReset: new Date().toISOString() };
    }
}

/**
 * Increment anonymous usage count
 * Returns the new count
 */
export function incrementAnonymousUsage(): number {
    const data = getUsageData();
    data.count += 1;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    return data.count;
}

/**
 * Get current anonymous usage count
 */
export function getAnonymousUsageCount(): number {
    return getUsageData().count;
}

/**
 * Check if anonymous user has exceeded the limit
 */
export function hasExceededAnonymousLimit(): boolean {
    return getUsageData().count >= MAX_ANONYMOUS_ATTEMPTS;
}

/**
 * Get remaining anonymous attempts
 */
export function getRemainingAttempts(): number {
    const used = getUsageData().count;
    return Math.max(0, MAX_ANONYMOUS_ATTEMPTS - used);
}

/**
 * Reset anonymous usage (called after login)
 */
export function resetAnonymousUsage(): void {
    localStorage.removeItem(STORAGE_KEY);
}

/**
 * Export constants
 */
export const ANONYMOUS_LIMIT = MAX_ANONYMOUS_ATTEMPTS;
