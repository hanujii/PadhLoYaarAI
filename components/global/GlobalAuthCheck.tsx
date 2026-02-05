'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { LoginRequiredModal } from '@/components/auth/LoginRequiredModal';
import { getAnonymousUsageCount, hasExceededAnonymousLimit, incrementAnonymousUsage } from '@/lib/anonymous-limit';
import { createClient } from '@/lib/supabase/client';

export function GlobalAuthCheck() {
    const [showModal, setShowModal] = useState(false);
    const [usageCount, setUsageCount] = useState(0);
    const [isAnonymous, setIsAnonymous] = useState(false);
    const pathname = usePathname();
    const supabase = createClient();

    useEffect(() => {
        // Check if user is anonymous
        const checkAuth = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            setIsAnonymous(!session);

            // Sync usage count
            setUsageCount(getAnonymousUsageCount());
        };

        checkAuth();

        // Listen for auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
            setIsAnonymous(!session);
        });

        return () => subscription.unsubscribe();
    }, []);

    useEffect(() => {
        // Expose a global function for tools to call
        // @ts-ignore
        window.incrementToolUsage = () => {
            if (!isAnonymous) return true; // Logged in users have no limit (or handled solely by server rate limits)

            if (hasExceededAnonymousLimit()) {
                setUsageCount(getAnonymousUsageCount()); // Update count logic
                setShowModal(true);
                return false; // Stop action
            }

            const newCount = incrementAnonymousUsage();
            setUsageCount(newCount);

            if (newCount > 5) { // Double check
                setShowModal(true);
                return false;
            }
            return true; // Allow action
        };

        // Also listen for button clicks that might be "tools"? 
        // No, that's too risky. Better to have manual invocation.

    }, [isAnonymous]);

    return (
        <LoginRequiredModal
            isOpen={showModal}
            onClose={() => setShowModal(false)}
            attemptCount={usageCount}
        />
    );
}

// Add type definition to window
declare global {
    interface Window {
        incrementToolUsage: () => boolean;
    }
}
