import { JarvisInterface } from '@/components/jarvis/JarvisInterface';
import { ToolBackButton } from '@/components/global/ToolBackButton';

export default function JarvisPage() {
    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-950 to-black overflow-hidden relative">
            {/* Background Grid */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none" />

            <div className="pt-20 sm:pt-24 pb-12 px-4 sm:px-6 lg:px-8 relative z-10">
                <ToolBackButton />
                <JarvisInterface />
            </div>
        </div>
    );
}
