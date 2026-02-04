import { MetadataRoute } from 'next';
import { TOOLS } from '@/lib/tools-data';

/**
 * Dynamic sitemap for PadhLoYaarAI
 * Helps search engines discover all pages and tools
 */
export default function sitemap(): MetadataRoute.Sitemap {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://padhloyaar-ai.vercel.app';
    const lastModified = new Date();

    // Core pages
    const corePages: MetadataRoute.Sitemap = [
        {
            url: baseUrl,
            lastModified,
            changeFrequency: 'weekly',
            priority: 1.0,
        },
        {
            url: `${baseUrl}/pricing`,
            lastModified,
            changeFrequency: 'monthly',
            priority: 0.9,
        },
        {
            url: `${baseUrl}/login`,
            lastModified,
            changeFrequency: 'yearly',
            priority: 0.5,
        },
        {
            url: `${baseUrl}/privacy`,
            lastModified,
            changeFrequency: 'yearly',
            priority: 0.3,
        },
        {
            url: `${baseUrl}/terms`,
            lastModified,
            changeFrequency: 'yearly',
            priority: 0.3,
        },
    ];

    // Tool pages - dynamically generated from TOOLS array
    const toolPages: MetadataRoute.Sitemap = TOOLS.map((tool) => ({
        url: `${baseUrl}${tool.href}`,
        lastModified,
        changeFrequency: 'weekly' as const,
        priority: 0.8,
    }));

    return [...corePages, ...toolPages];
}
