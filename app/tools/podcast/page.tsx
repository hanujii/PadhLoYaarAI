import { PodcastStudio } from '@/components/podcast/PodcastStudio';
import { ToolBackButton } from '@/components/global/ToolBackButton';

export default function PodcastPage() {
    return (
        <div className="min-h-screen pt-20 sm:pt-24 pb-12 px-4 sm:px-6 lg:px-8">
            <ToolBackButton />
            <PodcastStudio />
        </div>
    );
}
