import { UniversalChat } from '@/components/tools/UniversalChat';
import { TOOLS } from '@/lib/tools-data';
import { notFound } from 'next/navigation';

export async function generateStaticParams() {
    return TOOLS.map((tool) => ({
        tool: tool.value,
    }));
}

export default function DynamicToolPage({ params }: { params: { tool: string } }) {
    const tool = TOOLS.find(t => t.value === params.tool);

    if (!tool) {
        return notFound();
    }

    return <UniversalChat tool={tool} />;
}
