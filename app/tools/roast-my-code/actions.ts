'use server';

import { aiEngine } from '@/lib/ai/engine';
import { z } from 'zod';

export async function roastCode(code: string) {
    if (!code) return { success: false, error: 'Code is required' };

    try {
        const prompt = `Roast this code. Be sarcastic, funny, but technically accurate.
        Identify the worst practice and provide a burn score (0-10, where 10 is emotional damage).
        Also provide a serious "fix" suggestion at the end.`;

        const { object } = await aiEngine.generateObject(prompt, z.object({
            roast: z.string().describe("The brutal roast found in markdown"),
            burn_score: z.number().min(0).max(10),
            fix_suggestion: z.string().describe("A helpful, serious technical suggestion to fix the spaghetti")
        }));

        return { success: true, data: object };
    } catch (error) {
        console.error("Roast Error:", error);
        return { success: false, error: 'Failed to roast code.' };
    }
}
