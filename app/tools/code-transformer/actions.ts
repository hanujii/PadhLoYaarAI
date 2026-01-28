'use server';

import { aiEngine } from '@/lib/ai/engine';
import { z } from 'zod';

export async function transformCode(code: string, fromLang: string, toLang: string, style: string) {
    if (!code) return { error: 'Code is required' };

    try {
        const prompt = `Convert this ${fromLang} code to ${toLang}. Style: ${style}.
        
        CODE TO CONVERT:
        \`\`\`${fromLang}
        ${code}
        \`\`\`
        
        Transform the code and explain the changes made.`;

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
