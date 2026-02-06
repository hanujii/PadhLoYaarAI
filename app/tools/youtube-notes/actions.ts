'use server';

import { aiEngine } from '@/lib/ai/engine';
import { z } from 'zod';

const YouTubeNotesSchema = z.object({
    summary: z.string().describe("Full markdown study notes (Headings, Bullet points, etc.)"),
    quiz: z.array(z.object({
        question: z.string(),
        options: z.array(z.string()),
        answer: z.string(),
        clarification: z.string(),
    })).describe("Quiz questions based on the video"),
});

// eslint-disable-next-line @typescript-eslint/no-require-imports
const { YoutubeTranscript } = require('youtube-transcript');

import { checkRateLimit } from '@/lib/rate-limit';

export async function getQuiz(formData: FormData) {
    // ... (Quiz doesn't need strict limit? Or yes?)
}

export async function getYouTubeNotes(formData: FormData) {
    try {
        await checkRateLimit('youtube-notes');
    } catch (error: any) {
        return { success: false, error: error.message };
    }

    const url = formData.get('url') as string;

    if (!url) {
        return { success: false, error: 'URL is required' };
    }

    try {
        if (process.env.NODE_ENV === 'development') {
            console.log("Fetching transcript for:", url);
        }

        // Validate and sanitize URL
        let videoId = '';
        try {
            const urlObj = new URL(url);
            
            // Only allow YouTube domains
            if (!urlObj.hostname.includes('youtube.com') && !urlObj.hostname.includes('youtu.be')) {
                return { success: false, error: 'Invalid URL. Please provide a valid YouTube URL.' };
            }

            if (urlObj.hostname.includes('youtube.com')) {
                videoId = urlObj.searchParams.get('v') || '';
            } else if (urlObj.hostname.includes('youtu.be')) {
                videoId = urlObj.pathname.slice(1);
            }
        } catch (e) {
            return { success: false, error: 'Invalid URL format' };
        }

        if (!videoId) return { success: false, error: 'Could not extract Video ID' };

        // Fetch Transcript
        interface TranscriptItem {
            text: string;
            offset?: number;
            duration?: number;
        }

        const transcriptItems = await YoutubeTranscript.fetchTranscript(videoId).catch((err: unknown) => {
            const errorMessage = err instanceof Error ? err.message : 'Unknown error';
            if (process.env.NODE_ENV === 'development') {
                console.error("Transcript fetch failed:", err);
            }
            throw new Error("Could not fetch subtitles. Video might not have captions enabled.");
        }) as TranscriptItem[];

        const fullTranscript = transcriptItems.map((item: TranscriptItem) => item.text).join(' ');

        // Truncate if too long (100k chars is plenty for a summary)
        const truncatedText = fullTranscript.slice(0, 100000);

        const prompt = `
        You are an expert note-taker. I will provide a transcript of a video. 
        Your task is to create structured, readable notes AND a short quiz.
        
        Create comprehensive study notes with headings, bullet points, and key takeaways.
        Also generate 3-5 quiz questions based on the content.
        
        TRANSCRIPT:
        ${truncatedText}
        `;

        const { object } = await aiEngine.generateObject(
            prompt,
            YouTubeNotesSchema,
            { temperature: 0.7 }
        );

        return { success: true, data: object };

    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to generate notes.';
        if (process.env.NODE_ENV === 'development') {
            console.error('YouTube Notes error:', error);
        }
        return { success: false, error: errorMessage };
    }
}
