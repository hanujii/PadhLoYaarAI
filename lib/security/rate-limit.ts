/**
 * Rate limiting for API routes
 * Prevents abuse and DoS attacks
 */

interface RateLimitConfig {
    windowMs: number;
    maxRequests: number;
    message?: string;
}

interface RateLimitRecord {
    count: number;
    resetTime: number;
}

// In-memory store (use Redis in production)
const store = new Map<string, RateLimitRecord>();

// Cleanup expired entries periodically
setInterval(() => {
    const now = Date.now();
    for (const [key, record] of store.entries()) {
        if (record.resetTime < now) {
            store.delete(key);
        }
    }
}, 60000); // Clean up every minute

export interface RateLimitResult {
    allowed: boolean;
    remaining: number;
    resetTime: number;
}

/**
 * Check rate limit for a client
 */
export function checkRateLimit(
    identifier: string,
    config: RateLimitConfig
): RateLimitResult {
    const now = Date.now();
    const record = store.get(identifier);

    if (!record || record.resetTime < now) {
        // New window or expired
        const newRecord: RateLimitRecord = {
            count: 1,
            resetTime: now + config.windowMs,
        };
        store.set(identifier, newRecord);
        return {
            allowed: true,
            remaining: config.maxRequests - 1,
            resetTime: newRecord.resetTime,
        };
    }

    if (record.count >= config.maxRequests) {
        return {
            allowed: false,
            remaining: 0,
            resetTime: record.resetTime,
        };
    }

    record.count++;
    return {
        allowed: true,
        remaining: config.maxRequests - record.count,
        resetTime: record.resetTime,
    };
}

/**
 * Get client identifier from request
 */
export function getClientIdentifier(req: Request): string {
    // Try to get IP from headers (Vercel, Cloudflare, etc.)
    const forwarded = req.headers.get('x-forwarded-for');
    const realIp = req.headers.get('x-real-ip');
    const ip = forwarded?.split(',')[0]?.trim() || realIp || 'unknown';
    
    // In production, combine with user ID if authenticated
    return ip;
}

/**
 * Predefined rate limit configurations
 */
export const RATE_LIMITS = {
    // Strict for AI generation (expensive)
    aiGeneration: {
        windowMs: 60 * 1000, // 1 minute
        maxRequests: 10,
        message: 'Too many AI requests. Please wait a moment.',
    },
    
    // Moderate for general API
    api: {
        windowMs: 60 * 1000, // 1 minute
        maxRequests: 60,
        message: 'Too many requests. Please slow down.',
    },
    
    // Lenient for auth
    auth: {
        windowMs: 15 * 60 * 1000, // 15 minutes
        maxRequests: 5,
        message: 'Too many authentication attempts. Please try again later.',
    },
} as const satisfies Record<string, RateLimitConfig>;
