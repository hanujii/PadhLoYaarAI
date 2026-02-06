/**
 * Rate limiting middleware for API routes
 * Prevents abuse and DoS attacks
 */

interface RateLimitOptions {
    windowMs: number; // Time window in milliseconds
    maxRequests: number; // Maximum requests per window
    message?: string;
}

interface RateLimitStore {
    [key: string]: {
        count: number;
        resetTime: number;
    };
}

// In-memory store (in production, use Redis or similar)
const store: RateLimitStore = {};

/**
 * Rate limit middleware
 * Returns a function that can be used in API routes
 */
export function createRateLimiter(options: RateLimitOptions) {
    const { windowMs, maxRequests, message = 'Too many requests, please try again later.' } = options;

    return (identifier: string): { allowed: boolean; remaining: number; resetTime: number } => {
        const now = Date.now();
        const record = store[identifier];

        // Clean up expired entries periodically (every 1000 requests)
        if (Math.random() < 0.001) {
            Object.keys(store).forEach(key => {
                if (store[key].resetTime < now) {
                    delete store[key];
                }
            });
        }

        if (!record || record.resetTime < now) {
            // New window or expired
            store[identifier] = {
                count: 1,
                resetTime: now + windowMs,
            };
            return {
                allowed: true,
                remaining: maxRequests - 1,
                resetTime: now + windowMs,
            };
        }

        if (record.count >= maxRequests) {
            return {
                allowed: false,
                remaining: 0,
                resetTime: record.resetTime,
            };
        }

        record.count++;
        return {
            allowed: true,
            remaining: maxRequests - record.count,
            resetTime: record.resetTime,
        };
    };
}

/**
 * Get client identifier from request
 */
export function getClientIdentifier(req: Request): string {
    // Try to get IP from headers (Vercel, Cloudflare, etc.)
    const forwarded = req.headers.get('x-forwarded-for');
    const realIp = req.headers.get('x-real-ip');
    const ip = forwarded?.split(',')[0] || realIp || 'unknown';
    
    // In production, you might want to combine IP with user ID if authenticated
    return ip;
}

/**
 * Default rate limiters for different endpoints
 */
export const rateLimiters = {
    // Strict rate limit for AI generation (expensive operations)
    aiGeneration: createRateLimiter({
        windowMs: 60 * 1000, // 1 minute
        maxRequests: 10,
        message: 'Too many AI requests. Please wait a moment.',
    }),
    
    // Moderate rate limit for general API calls
    api: createRateLimiter({
        windowMs: 60 * 1000, // 1 minute
        maxRequests: 60,
        message: 'Too many requests. Please slow down.',
    }),
    
    // Lenient rate limit for authentication
    auth: createRateLimiter({
        windowMs: 15 * 60 * 1000, // 15 minutes
        maxRequests: 5,
        message: 'Too many authentication attempts. Please try again later.',
    }),
};
