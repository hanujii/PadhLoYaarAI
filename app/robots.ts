import { MetadataRoute } from 'next';

/**
 * Robots.txt configuration for PadhLoYaarAI
 * Instructs search engine crawlers on what to index
 */
export default function robots(): MetadataRoute.Robots {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://plyai.vercel.app';

    return {
        rules: [
            {
                userAgent: '*',
                allow: '/',
                disallow: [
                    '/api/',           // Don't index API routes
                    '/settings/',      // Private user settings
                    '/history/',       // Private user history
                    '/account/',       // Private user account
                    '/_next/',         // Next.js internals
                    '/admin/',         // Admin panel (if added)
                ],
            },
            {
                userAgent: 'GPTBot', // OpenAI's crawler
                disallow: '/api/', // Prevent AI training on API responses
            },
            {
                userAgent: 'ChatGPT-User',
                disallow: '/api/',
            },
        ],
        sitemap: `${baseUrl}/sitemap.xml`,
    };
}
