import { PodcastStudio } from '@/components/podcast/PodcastStudio';
import { ToolBackButton } from '@/components/global/ToolBackButton';

export default function PodcastPage() {
    return (
        <div className="min-h-screen pt-24 pb-12">
            <ToolBackButton />
            <PodcastStudio />
        </div>
    );
}
