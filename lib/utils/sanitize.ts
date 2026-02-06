/**
 * Input sanitization utilities
 * Prevents XSS attacks and malicious input
 */

/**
 * Sanitizes HTML content to prevent XSS attacks
 * Removes potentially dangerous HTML tags and attributes
 */
export function sanitizeHtml(html: string): string {
    // Remove script tags and event handlers
    return html
        .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
        .replace(/on\w+\s*=\s*["'][^"']*["']/gi, '')
        .replace(/javascript:/gi, '')
        .replace(/<iframe/gi, '<iframe sandbox="allow-same-origin"');
}

/**
 * Sanitizes user input by removing potentially dangerous characters
 */
export function sanitizeInput(input: string): string {
    return input
        .trim()
        .replace(/[<>]/g, '') // Remove angle brackets
        .replace(/javascript:/gi, '') // Remove javascript: protocol
        .replace(/on\w+\s*=/gi, ''); // Remove event handlers
}

/**
 * Validates and sanitizes URL input
 */
export function sanitizeUrl(url: string): string | null {
    try {
        const parsed = new URL(url);
        // Only allow http and https protocols
        if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
            return null;
        }
        return parsed.toString();
    } catch {
        return null;
    }
}

/**
 * Sanitizes file name to prevent directory traversal attacks
 */
export function sanitizeFileName(fileName: string): string {
    return fileName
        .replace(/[^a-zA-Z0-9._-]/g, '_')
        .replace(/\.\./g, '_')
        .substring(0, 255); // Limit length
}
