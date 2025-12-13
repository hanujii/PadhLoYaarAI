'use server';

import { generateText } from '@/lib/gemini';
import { parseAIJSON } from '@/lib/utils';

export async function generateFlashcards(formData: FormData) {
    const topic = formData.get('topic') as string;

    if (!topic) {
        return { success: false, error: 'Topic is required' };
    }

    try {
        const prompt = `
        You are an expert teacher. Create a set of 10-15 high-quality flashcards for the topic: "${topic}".
        
        The flashcards should cover key concepts, definitions, and important details.
        
        Return STRICTLY a JSON array of objects. Each object must have exactly two keys:
        - "front": The question, term, or concept.
        - "back": The answer, definition, or explanation.
        
        Do not include any markdown formatting (like \`\`\`json) or extra text. Just the raw JSON array.
        `;

        const text = await generateText('flash', prompt);

        const flashcards = parseAIJSON(text);

        return { success: true, data: flashcards };
    } catch (error) {
        console.error('Flashcard generation error:', error);
        return { success: false, error: 'Failed to generate flashcards. Please try again.' };
    }
}
