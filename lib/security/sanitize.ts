/**
 * Security utilities for input sanitization and validation
 */

/**
 * Validates and sanitizes prompt text
 */
export function validatePrompt(prompt: string, maxLength: number = 10000): string {
    if (!prompt || typeof prompt !== 'string') {
        throw new Error('Prompt must be a non-empty string');
    }

    const trimmed = prompt.trim();
    
    if (trimmed.length === 0) {
        throw new Error('Prompt cannot be empty');
    }

    if (trimmed.length > maxLength) {
        throw new Error(`Prompt exceeds maximum length of ${maxLength} characters`);
    }

    // Remove potentially dangerous patterns
    return trimmed
        .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
        .replace(/javascript:/gi, '')
        .replace(/on\w+\s*=\s*["'][^"']*["']/gi, '')
        .substring(0, maxLength);
}

/**
 * Validates image data URL format
 */
export function validateImageDataUrl(dataUrl: string): boolean {
    if (!dataUrl || typeof dataUrl !== 'string') {
        return false;
    }

    // Check if it's a valid data URL
    const dataUrlPattern = /^data:image\/(jpeg|jpg|png|gif|webp);base64,[A-Za-z0-9+/=]+$/;
    
    if (!dataUrlPattern.test(dataUrl)) {
        return false;
    }

    // Check size (max 10MB base64 encoded ≈ 7.5MB actual)
    const base64Data = dataUrl.split(',')[1];
    if (!base64Data) {
        return false;
    }

    const sizeInBytes = (base64Data.length * 3) / 4;
    const maxSize = 10 * 1024 * 1024; // 10MB

    return sizeInBytes <= maxSize;
}

/**
 * Sanitizes file name to prevent directory traversal
 */
export function sanitizeFileName(fileName: string): string {
    return fileName
        .replace(/[^a-zA-Z0-9._-]/g, '_')
        .replace(/\.\./g, '_')
        .replace(/^\.+/, '') // Remove leading dots
        .substring(0, 255);
}

/**
 * Validates URL to prevent SSRF attacks
 */
export function validateUrl(url: string): boolean {
    try {
        const parsed = new URL(url);
        
        // Only allow http and https
        if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
            return false;
        }

        // Block localhost and private IPs (basic check)
        const hostname = parsed.hostname.toLowerCase();
        if (
            hostname === 'localhost' ||
            hostname === '127.0.0.1' ||
            hostname.startsWith('192.168.') ||
            hostname.startsWith('10.') ||
            hostname.startsWith('172.16.') ||
            hostname.startsWith('172.17.') ||
            hostname.startsWith('172.18.') ||
            hostname.startsWith('172.19.') ||
            hostname.startsWith('172.20.') ||
            hostname.startsWith('172.21.') ||
            hostname.startsWith('172.22.') ||
            hostname.startsWith('172.23.') ||
            hostname.startsWith('172.24.') ||
            hostname.startsWith('172.25.') ||
            hostname.startsWith('172.26.') ||
            hostname.startsWith('172.27.') ||
            hostname.startsWith('172.28.') ||
            hostname.startsWith('172.29.') ||
            hostname.startsWith('172.30.') ||
            hostname.startsWith('172.31.')
        ) {
            return false;
        }

        return true;
    } catch {
        return false;
    }
}
