import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createServerClient } from '@supabase/ssr';

/**
 * Middleware to protect routes that require authentication.
 * Uses Supabase SSR client to check for valid session cookies.
 */
export async function proxy(request: NextRequest) {
    const response = NextResponse.next({
        request: {
            headers: request.headers,
        },
    });

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    // If Supabase is not configured, allow all requests (dev mode)
    if (!supabaseUrl || !supabaseAnonKey) {
        return response;
    }

    const supabase = createServerClient(
        supabaseUrl,
        supabaseAnonKey,
        {
            cookies: {
                get(name: string) {
                    return request.cookies.get(name)?.value;
                },
                set(name: string, value: string, options: any) {
                    response.cookies.set({ name, value, ...options });
                },
                remove(name: string, options: any) {
                    response.cookies.set({ name, value: '', ...options });
                },
            },
        }
    );

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

    return response;
}

// Apply middleware to specific routes
export const config = {
    matcher: [
        '/history/:path*',
        '/settings/:path*',
        '/login',
    ],
};
