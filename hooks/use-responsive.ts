'use client';

import { useEffect, useState } from 'react';

type Breakpoint = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl';

const breakpoints = {
    xs: 375,
    sm: 640,
    md: 768,
    lg: 1024,
    xl: 1280,
    '2xl': 1400,
    '3xl': 1920,
};

/**
 * Hook to get the current breakpoint
 * @returns Current breakpoint name
 */
export function useBreakpoint(): Breakpoint {
    const [breakpoint, setBreakpoint] = useState<Breakpoint>('lg');

    useEffect(() => {
        const handleResize = () => {
            const width = window.innerWidth;

            if (width >= breakpoints['3xl']) setBreakpoint('3xl');
            else if (width >= breakpoints['2xl']) setBreakpoint('2xl');
            else if (width >= breakpoints.xl) setBreakpoint('xl');
            else if (width >= breakpoints.lg) setBreakpoint('lg');
            else if (width >= breakpoints.md) setBreakpoint('md');
            else if (width >= breakpoints.sm) setBreakpoint('sm');
            else setBreakpoint('xs');
        };

        handleResize(); // Initial call
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return breakpoint;
}

/**
 * Hook to detect if current viewport is mobile-sized
 * @returns true if viewport width < 768px (md breakpoint)
 */
export function useIsMobile(): boolean {
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < breakpoints.md);
        };

        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return isMobile;
}

/**
 * Hook to detect if device supports touch
 * @returns true if device has touch capabilities
 */
export function useIsTouchDevice(): boolean {
    const [isTouchDevice, setIsTouchDevice] = useState(false);

    useEffect(() => {
        const hasTouch =
            'ontouchstart' in window ||
            navigator.maxTouchPoints > 0 ||
            // @ts-ignore - For older browsers
            navigator.msMaxTouchPoints > 0;

        setIsTouchDevice(hasTouch);
    }, []);

    return isTouchDevice;
}

/**
 * Hook to check if user prefers reduced motion
 * @returns true if user prefers reduced motion
 */
export function usePrefersReducedMotion(): boolean {
    const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

    useEffect(() => {
        const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
        setPrefersReducedMotion(mediaQuery.matches);

        const handleChange = (event: MediaQueryListEvent) => {
            setPrefersReducedMotion(event.matches);
        };

        mediaQuery.addEventListener('change', handleChange);
        return () => mediaQuery.removeEventListener('change', handleChange);
    }, []);

    return prefersReducedMotion;
}

/**
 * Hook to get current viewport dimensions
 * @returns Object with width and height
 */
export function useViewportSize() {
    const [size, setSize] = useState({ width: 0, height: 0 });

    useEffect(() => {
        const handleResize = () => {
            setSize({
                width: window.innerWidth,
                height: window.innerHeight,
            });
        };

        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return size;
}
