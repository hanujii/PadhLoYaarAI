import { z } from 'zod';

/**
 * Validates that a string is a valid URL and checks against SSRF attacks.
 * Allowed protocols: http, https
 * disallowed hosts: localhost, 127.0.0.1, private IPs, metadata services
 */
export function isValidUrl(url: string, allowLocalhost: boolean = false): boolean {
    try {
        const parsedUrl = new URL(url);

        // 1. Protocol check
        if (!['http:', 'https:'].includes(parsedUrl.protocol)) {
            return false;
        }

        // 2. Hostname check
        const hostname = parsedUrl.hostname;

        if (!allowLocalhost) {
            // Block localhost
            if (hostname === 'localhost' || hostname === '127.0.0.1' || hostname === '[::1]') {
                return false;
            }

            // Block private IP ranges (simple regex check)
            // 10.x.x.x
            // 172.16.x.x - 172.31.x.x
            // 192.168.x.x
            const privateIpRegex = /^(10\.|172\.(1[6-9]|2[0-9]|3[0-1])\.|192\.168\.)/;
            if (privateIpRegex.test(hostname)) {
                return false;
            }
        }

        // Block AWS metadata service
        if (hostname === '169.254.169.254') {
            return false;
        }

        return true;
    } catch {
        return false;
    }
}

/**
 * sanitizes a URL string
 */
export function sanitizeUrl(url: string): string | null {
    if (!isValidUrl(url)) return null;
    return url;
}
