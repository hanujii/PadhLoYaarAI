'use server';

import { aiEngine } from '@/lib/ai/engine';
import { z } from 'zod';

export async function transformCode(code: string, fromLang: string, toLang: string, style: string) {
    if (!code) return { error: 'Code is required' };

    try {
        const prompt = `Convert this ${fromLang} code to ${toLang}. Style: ${style}.
        
        Return JSON with:
        - "code": The transformed code.
        - "explanation": A very brief explanation of what changed and why.
        - "changes": An array of specific changes made (e.g. "Changed var to let", "Used list comprehension").`;

        const { object } = await aiEngine.generateObject(prompt, z.object({
            code: z.string().describe("The transformed code only"),
            explanation: z.string().describe("Brief explanation of the translation logic"),
            changes: z.array(z.string()).describe("List of specific changes made")
        }));

        return { success: true, data: object };
    } catch (error) {
        console.error("Transformer Error:", error);
        return { success: false, error: 'Failed to transform code.' };
    }
}
