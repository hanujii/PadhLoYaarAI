'use server';

import { aiEngine } from '@/lib/ai/engine';
import { z } from 'zod';

export type PodcastScriptItem = {
    speaker: 'Host' | 'Guest';
    text: string;
};

export type PodcastResponse = {
    title: string;
    script: PodcastScriptItem[];
};

export async function generatePodcastScript(topic: string, persona: string) {
    try {
        const prompt = `
        Create a 2-person podcast script about: "${topic}".
        Style/Persona: ${persona}.
        
        The characters are:
        - Host: Enthusiastic, asks questions, guides the conversation.
        - Guest: Expert, explains concepts, uses analogies (or specific to persona).

        Generate a JSON object with:
        1. "title": A catchy title for this episode.
        2. "script": An array of objects, where each has "speaker" ("Host" or "Guest") and "text".

        Keep the conversation natural, engaging, and educational. Total length: about 8-12 exchanges.
        Use "Host" and "Guest" keys strictly.
        `;

        const { object } = await aiEngine.generateObject(prompt, z.object({
            title: z.string(),
            script: z.array(z.object({
                speaker: z.enum(['Host', 'Guest']),
                text: z.string()
            }))
        }));

        return { success: true, data: object };
    } catch (error: any) {
        console.error("Podcast Gen Error:", error);
        return { success: false, error: error.message || "Failed to generate script." };
    }
}
