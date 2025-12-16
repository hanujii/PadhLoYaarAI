'use client';

import useSound from 'use-sound';

// Note: In a real app, you would have actual sound files in /public/sounds/
// For now, we will assume these files exist or use a simplified approach without errors if missing.
// To make this robust without assets, we'll wrap it safely.

export function useSoundEffects() {
    // Placeholder paths - user would need to add these files
    const [playClick] = useSound('/sounds/click.mp3', { volume: 0.5, interrupt: true });
    const [playHover] = useSound('/sounds/hover.mp3', { volume: 0.1, interrupt: true });
    const [playSuccess] = useSound('/sounds/success.mp3', { volume: 0.5 });
    const [playError] = useSound('/sounds/error.mp3', { volume: 0.5 });

    const play = (type: 'click' | 'hover' | 'success' | 'error') => {
        try {
            if (type === 'click') playClick();
            if (type === 'hover') playHover();
            if (type === 'success') playSuccess();
            if (type === 'error') playError();
        } catch (e) {
            // Ignore errors if sounds are missing
        }
    };

    return { play };
}
