'use client';

import dynamic from 'next/dynamic';
import { Loader2 } from 'lucide-react';

// Code split zen station component
const ZenStation = dynamic(
    () => import('@/components/zen/ZenStation').then(mod => ({ default: mod.ZenStation })),
    {
        ssr: false,
        loading: () => (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center space-y-4">
                    <Loader2 className="w-12 h-12 animate-spin mx-auto text-primary" />
                    <p className="text-muted-foreground">Loading Zen Station...</p>
                </div>
            </div>
        ),
    }
);

export default function ZenStationPage() {
    return <ZenStation />;
}
