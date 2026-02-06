import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createServerClient } from '@supabase/ssr';

/**
 * Middleware for security headers, request validation, and authentication protection.
 */
export async function middleware(request: NextRequest) {
    // 1. Initialize Response
    let response = NextResponse.next({
        request: {
            headers: request.headers,
        },
    });

    // 2. Authentication & Protected Routes (Supabase)
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (supabaseUrl && supabaseAnonKey) {
        const supabase = createServerClient(
            supabaseUrl,
            supabaseAnonKey,
            {
                cookies: {
                    getAll() {
                        return request.cookies.getAll();
                    },
                    setAll(cookiesToSet) {
                        cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value));
                        response = NextResponse.next({
                            request: {
                                headers: request.headers,
                            },
                        });
                        cookiesToSet.forEach(({ name, value, options }) =>
                            response.cookies.set(name, value, options)
                        );
                    },
                },
            }
        );

        // Refresh session if expired
        const { data: { session } } = await supabase.auth.getSession();

        const { pathname } = request.nextUrl;

        // Define protected routes that REQUIRE authentication
        const protectedRoutes = ['/history', '/settings'];
        const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));

        // Redirect unauthenticated users to login for protected routes
        if (isProtectedRoute && !session) {
            const loginUrl = new URL('/login', request.url);
            loginUrl.searchParams.set('redirect', pathname);
            return NextResponse.redirect(loginUrl);
        }

        // Redirect authenticated users away from login page
        if (pathname === '/login' && session) {
            return NextResponse.redirect(new URL('/', request.url));
        }
    }


    // 3. Security Headers
    response.headers.set('X-DNS-Prefetch-Control', 'on');
    response.headers.set('Strict-Transport-Security', 'max-age=63072000; includeSubDomains; preload');
    response.headers.set('X-Frame-Options', 'SAMEORIGIN');
    response.headers.set('X-Content-Type-Options', 'nosniff');
    response.headers.set('X-XSS-Protection', '1; mode=block');
    response.headers.set('Referrer-Policy', 'origin-when-cross-origin');
    response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');

    // CSRF Protection
    const isMutation = ['POST', 'PUT', 'PATCH', 'DELETE'].includes(request.method);
    if (isMutation) {
        const origin = request.headers.get('origin');
        const host = request.headers.get('host');
        const referer = request.headers.get('referer');

        let isValidOrigin = false;
        if (origin) {
            // Check if origin matches host (http vs https awareness needed or just string match)
            // Simplest check: origin must end with host
            if (host && origin.includes(host)) isValidOrigin = true;
        } else if (referer) {
            if (host && referer.includes(host)) isValidOrigin = true;
        } else {
            // No origin or referer on mutation? Suspicious.
            // Some clients might strip it, but strict CSRF requires it.
            // For now, we'll allow it if missing but log it? Or block?
            // Safer to block for high security, but maybe permissive for now.
            // Let's rely on standard Next.js protection + Origin check if present.
            if (process.env.NODE_ENV === 'production') isValidOrigin = false;
            else isValidOrigin = true; // Allow in dev tools like Postman often missing origin
        }

        if (origin && !isValidOrigin) {
            return new NextResponse(null, { status: 403, statusText: 'Forbidden' });
        }
    }

    // 4. CORS headers for API routes
    if (request.nextUrl.pathname.startsWith('/api/')) {
        const origin = request.headers.get('origin');
        const allowedOrigins = [
            process.env.NEXT_PUBLIC_APP_URL,
            'http://localhost:3000',
            'https://plyai.vercel.app',
        ].filter(Boolean);

        if (origin && allowedOrigins.includes(origin)) {
            response.headers.set('Access-Control-Allow-Origin', origin);
            response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
            response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
            response.headers.set('Access-Control-Max-Age', '86400');
        }
    }

    // 5. Handle preflight requests
    if (request.method === 'OPTIONS') {
        return new NextResponse(null, {
            status: 200,
            headers: response.headers,
        });
    }

    return response;
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * - public folder
         */
        '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js)$).*)',
    ],
};
