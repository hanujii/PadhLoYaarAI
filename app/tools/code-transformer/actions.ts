'use server';

import { generateText } from '@/lib/gemini';

export async function transformCode(code: string, fromLang: string, toLang: string, style: string) {
    if (!code) return { error: 'Code is required' };

    let prompt = `You are an expert Code Transformer. Convert the following code from ${fromLang} to ${toLang}.`;

    if (style !== 'standard') {
        prompt += ` Style: ${style} (optimize, clean, add comments if needed).`;
    }

    prompt += `\n\nReturn ONLY the code. No markdown backticks, no explanation.`;
    prompt += `\n\nInput Code:\n${code}`;

    try {
        // Pro model for better code reasoning
        const text = await generateText('pro', prompt);
        // Strip backticks if the model ignores the instruction
        const cleanText = text.replace(/^```[\w]*\n?/, '').replace(/\n?```$/, '');
        return { success: true, data: cleanText };
    } catch (error) {
        console.error("Transformer Error:", error);
        return { success: false, error: 'Failed to transform code.' };
    }
}
