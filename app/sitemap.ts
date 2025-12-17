import { MetadataRoute } from 'next';
import { TOOLS } from '@/lib/tools-data';

export default function sitemap(): MetadataRoute.Sitemap {
    const baseUrl = 'https://padhloyaar.ai';

    const toolUrls = TOOLS.map((tool) => ({
        url: `${baseUrl}${tool.href}`,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.8,
    }));

    return [
        {
            url: baseUrl,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 1,
        },
        ...toolUrls,
    ];
}
