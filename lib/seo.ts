import { Metadata } from 'next';
import { TOOLS } from './tools-data';

/**
 * Generates dynamic metadata for tool pages.
 * Use this in tool page files to ensure consistent SEO across all tools.
 * 
 * @example
 * // In a tool page (e.g., app/tools/tutor/page.tsx)
 * export const metadata = generateToolMetadata('tutor');
 */
export function generateToolMetadata(toolValue: string): Metadata {
    const tool = TOOLS.find(t => t.value === toolValue);

    if (!tool) {
        return {
            title: 'Tool Not Found',
            description: 'The requested tool could not be found.',
        };
    }

    const title = tool.title;
    const description = `${tool.description} - Free AI-powered study tool by PadhLoYaarAI.`;

    return {
        title,
        description,
        keywords: [
            ...tool.keywords,
            'AI',
            'study',
            'learning',
            'PadhLoYaarAI',
            'free',
            'education',
        ],
        openGraph: {
            title: `${title} | PadhLoYaarAI`,
            description,
            type: 'website',
            url: `https://plyai.vercel.app${tool.href}`,
            siteName: 'PadhLoYaarAI',
            images: [
                {
                    url: '/og-image.png',
                    width: 1200,
                    height: 630,
                    alt: `${title} - PadhLoYaarAI`,
                },
            ],
        },
        twitter: {
            card: 'summary_large_image',
            title: `${title} | PadhLoYaarAI`,
            description,
            images: ['/og-image.png'],
        },
    };
}

/**
 * Get a tool by its value/slug.
 */
export function getToolByValue(value: string) {
    return TOOLS.find(t => t.value === value);
}
