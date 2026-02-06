/**
 * Consistent spacing scale for the application
 * Based on Tailwind's default spacing scale
 */
export const SPACING = {
    xs: '0.5rem',    // 8px
    sm: '0.75rem',   // 12px
    md: '1rem',      // 16px
    lg: '1.5rem',    // 24px
    xl: '2rem',      // 32px
    '2xl': '3rem',   // 48px
    '3xl': '4rem',   // 64px
} as const;

/**
 * Consistent padding values
 */
export const PADDING = {
    section: 'py-24',        // Section vertical padding
    sectionMobile: 'py-16',  // Section vertical padding on mobile
    card: 'p-6',             // Card padding
    cardMobile: 'p-4',       // Card padding on mobile
    button: 'px-4 py-2',     // Button padding
    input: 'px-4 py-2.5',    // Input padding
} as const;

/**
 * Consistent gap values
 */
export const GAP = {
    xs: 'gap-2',     // 8px
    sm: 'gap-4',     // 16px
    md: 'gap-6',     // 24px
    lg: 'gap-8',     // 32px
    xl: 'gap-12',    // 48px
} as const;

/**
 * Consistent border radius values
 */
export const RADIUS = {
    sm: 'rounded-md',    // 6px
    md: 'rounded-lg',   // 8px
    lg: 'rounded-xl',   // 12px
    xl: 'rounded-2xl',  // 16px
    full: 'rounded-full', // 9999px
} as const;
