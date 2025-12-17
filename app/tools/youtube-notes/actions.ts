'use server';

// eslint-disable-next-line @typescript-eslint/no-require-imports
const { YoutubeTranscript } = require('youtube-transcript');
import { generateText } from '@/lib/gemini';
import { parseAIJSON } from '@/lib/utils';

export async function getYouTubeNotes(formData: FormData) {
    const url = formData.get('url') as string;

    if (!url) {
        return { success: false, error: 'URL is required' };
    }

    try {
        console.log("Fetching transcript for:", url);

        // Extract Video ID to validation
        let videoId = '';
        try {
            const urlObj = new URL(url);
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
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const transcriptItems = await YoutubeTranscript.fetchTranscript(videoId).catch((err: any) => {
            console.error("Transcript fetch failed:", err);
            throw new Error("Could not fetch subtitles. Video might not have captions enabled.");
        });

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const fullTranscript = transcriptItems.map((item: any) => item.text).join(' ');

        // Truncate if too long (Gemini Flash has ~1M context, but let's be safe and efficient)
        // 100k chars is plenty for a summary
        const truncatedText = fullTranscript.slice(0, 100000);

        const prompt = `
        You are an expert note-taker. I will provide a transcript of a video. 
        Your task is to create structured, readable notes AND a short quiz.
        
        Return STRICTLY a JSON object with this schema:
        {
            "summary": "Full markdown study notes (Headings, Bullet points, etc.)",
            "quiz": [
                {
                    "question": "Question text?",
                    "options": ["A", "B", "C", "D"],
                    "answer": "Correct Option Text",
                    "clarification": "Why this is correct"
                }
            ]
        }
        
        TRANSCRIPT:
        ${truncatedText}
        `;

        const resultText = await generateText('flash', prompt);
        const data = parseAIJSON(resultText);

        return { success: true, data: data };

        const summary = await generateText('flash', prompt);

        return { success: true, data: summary };

    } catch (error) {
        console.error('YouTube Notes error:', error);
        return { success: false, error: error instanceof Error ? error.message : 'Failed to generate notes.' };
    }
}
