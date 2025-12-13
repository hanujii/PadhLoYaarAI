'use server';

import { generateText } from '@/lib/gemini';
import { parseAIJSON } from '@/lib/utils';

export async function generateMeme(formData: FormData) {
    const topic = formData.get('topic') as string;

    if (!topic) {
        return { success: false, error: 'Topic is required' };
    }

    try {
        const prompt = `
        You are a Gen-Z Meme Lord and Educator.
        Topic: "${topic}"
        
        Generate a hilarious but educational meme concept.
        
        Return STRICTLY a JSON object with:
        - "top_text": string (Setup)
        - "bottom_text": string (Punchline regarding the topic)
        - "image_description": string (Describe the visual template, e.g. "Distracted Boyfriend", "Drake Hotline Bling")
        - "roast": string (A one-line roast of anyone who doesn't understand this topic)
        
        No markdown.
        `;

        const text = await generateText('flash', prompt);
        const data = parseAIJSON(text);

        return { success: true, data };
    } catch (error) {
        console.error('Meme Gen Error:', error);
        return { success: false, error: 'Failed to generate meme.' };
    }
}
