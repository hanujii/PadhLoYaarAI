import { describe, it, expect } from 'vitest';
import { cn } from '../utils';

describe('cn utility function', () => {
    it('should merge class names correctly', () => {
        const result = cn('px-4', 'py-2');
        expect(result).toBe('px-4 py-2');
    });

    it('should handle conditional classes', () => {
        const isActive = true;
        const result = cn('btn', isActive && 'btn-active');
        expect(result).toBe('btn btn-active');
    });

    it('should handle falsy values', () => {
        const result = cn('btn', false, null, undefined, 'btn-primary');
        expect(result).toBe('btn btn-primary');
    });

    it('should merge conflicting Tailwind classes', () => {
        const result = cn('px-4', 'px-8');
        expect(result).toBe('px-8');
    });

    it('should handle empty input', () => {
        const result = cn();
        expect(result).toBe('');
    });

    it('should handle array of classes', () => {
        const result = cn(['flex', 'items-center']);
        expect(result).toBe('flex items-center');
    });
});
