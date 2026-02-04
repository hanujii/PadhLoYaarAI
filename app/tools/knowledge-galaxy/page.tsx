import { GalaxyViewer } from '@/components/galaxy/GalaxyViewer';
import { ToolBackButton } from '@/components/global/ToolBackButton';

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
