'use server';

import { aiEngine } from '@/lib/ai/engine';

export async function getJarvisResponse(query: string) {
    try {
        const prompt = `
        You are J.A.R.V.I.S, a highly advanced AI assistant.
        User said: "${query}"

        Response Guidelines:
        1. Be concise and crisp (suitable for Text-to-Speech).
        2. Be helpful but slightly witty/formal like Jarvis.
        3. Do not use markdown formatting (asterisks, etc.) as it will be spoken.
        4. Keep it under 2-3 sentences unless asked for a detailed explanation.

        Reply with just the text.
        `;

        const result = await aiEngine.generateText(prompt, {
            maxTokens: 512,
            preferredProvider: 'google' // fast
        });

        return { success: true, text: result.text };
    } catch (error: any) {
        console.error("Jarvis Error:", error);
        return { success: false, error: "I am unable to process that request." };
    }
}
