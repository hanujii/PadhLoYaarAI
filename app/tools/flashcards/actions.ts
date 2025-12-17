'use server';

import { aiEngine } from '@/lib/ai/engine';
import { z } from 'zod';

export async function generateFlashcards(formData: FormData) {
    const topic = formData.get('topic') as string;

    if (!topic) {
        return { success: false, error: 'Topic is required' };
    }

    try {
        const prompt = `Create a set of 10-15 high-quality flashcards for the topic: "${topic}".
        Cover key concepts, definitions, and important details.`;

        const { object } = await aiEngine.generateObject(prompt, z.array(z.object({
            front: z.string().describe("The term, concept, or question"),
            back: z.string().describe("The definition, explanation, or answer")
        })));

        return { success: true, data: object };
    } catch (error) {
        console.error('Flashcard generation error:', error);
        return { success: false, error: 'Failed to generate flashcards. Please try again.' };
    }
}
