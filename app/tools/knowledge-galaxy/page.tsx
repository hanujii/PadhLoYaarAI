import dynamic from 'next/dynamic';
import { ToolBackButton } from '@/components/global/ToolBackButton';
import { Loader2 } from 'lucide-react';

// Code split heavy 3D component
const GalaxyViewer = dynamic(
    () => import('@/components/galaxy/GalaxyViewer').then(mod => ({ default: mod.GalaxyViewer })),
    {
        ssr: false,
        loading: () => (
            <div className="flex items-center justify-center h-screen text-white">
                <div className="text-center space-y-4">
                    <Loader2 className="w-12 h-12 animate-spin mx-auto text-primary" />
                    <p className="text-muted-foreground">Loading Knowledge Galaxy...</p>
                </div>
            </div>
        ),
    }
);

export default function KnowledgeGalaxyPage() {
    return (
        <div className="fixed inset-0 z-40 bg-black">
            {/* Back Button Overlay */}
            <div className="absolute top-20 sm:top-24 right-4 sm:right-8 z-50">
                <ToolBackButton />
            </div>

            <GalaxyViewer />
        </div>
    );
}
