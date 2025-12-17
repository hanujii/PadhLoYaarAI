'use server';

import { aiEngine } from '@/lib/ai/engine';
import { z } from 'zod';

export async function generateMeme(formData: FormData) {
    const topic = formData.get('topic') as string;
    if (!topic) return { success: false, error: 'Topic is required' };

    try {
        const prompt = `Topic: "${topic}".
        Generate a hilarious but educational meme concept suitable for Gen-Z students.
        Include a cheeky roast.`;

        const { object } = await aiEngine.generateObject(prompt, z.object({
            top_text: z.string().describe("The setup text for the meme"),
            bottom_text: z.string().describe("The punchline related to the topic"),
            image_description: z.string().describe("Visual description of the meme template (e.g. 'Distracted Boyfriend')"),
            roast: z.string().describe("A witty one-line roast of someone who doesn't understand the concept")
        }));

        return { success: true, data: object };
    } catch (error) {
        console.error('Meme Gen Error:', error);
        return { success: false, error: 'Failed to generate meme.' };
    }
}
