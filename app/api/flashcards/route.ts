import { aiEngine } from '@/lib/ai/engine';
import { z } from 'zod';

export const maxDuration = 30;

const FlashcardSchema = z.object({
    flashcards: z.array(z.object({
        front: z.string().describe("The question or term on the front of the card"),
        back: z.string().describe("The answer or definition on the back of the card"),
        hint: z.string().optional().describe("Optional hint to help remember"),
    })).min(1).max(20),
});

export async function POST(req: Request) {
    try {
        const { topic, count = 10, difficulty = 'medium', model } = await req.json();

        if (!topic) {
            return new Response(JSON.stringify({ error: 'Topic is required' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        const prompt = `Generate ${count} flashcards for studying "${topic}".
        
Difficulty level: ${difficulty}

Create engaging, educational flashcards that:
- Cover key concepts, definitions, and facts
- Include a mix of recall and understanding questions
- Have clear, concise answers
- Include helpful hints where appropriate

Make the flashcards progressively build knowledge.`;

        const { object } = await aiEngine.generateObject(prompt, FlashcardSchema, {
            maxTokens: 4096,
            temperature: 0.7,
        });

        return new Response(JSON.stringify(object), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });

    } catch (error: any) {
        console.error("[FlashcardsAPI] Error:", error);

        let status = 500;
        let message = error.message || "Failed to generate flashcards";

        if (error.message?.includes("No AI configured")) {
            status = 503;
            message = "No AI provider configured. Please add an API key.";
        }

        return new Response(JSON.stringify({ error: message }), {
            status,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}
