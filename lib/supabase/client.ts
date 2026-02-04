'use client';

import { createClient as createSupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
    console.warn('Supabase credentials missing. Creating a dummy client for development.');
}

// Legacy export (singleton instance)
export const supabase = createSupabaseClient(
    supabaseUrl || 'https://placeholder.supabase.co',
    supabaseAnonKey || 'placeholder'
);

// New export (function to create new instances)
export function createClient() {
    return createSupabaseClient(
        supabaseUrl || 'https://placeholder.supabase.co',
        supabaseAnonKey || 'placeholder'
    );
}
