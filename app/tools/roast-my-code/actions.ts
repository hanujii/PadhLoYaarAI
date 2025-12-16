'use server';

import { google } from '@ai-sdk/google';
import { generateText } from 'ai';

export async function roastCode(code: string) {
    try {
        const { text } = await generateText({
            model: google(`gemini-1.5-flash`),
            system: `You are a sarcastic, cynical senior software engineer who has seen it all. 
            Your job is to "roast" the code provided by the user. 
            Be funny, harsh, but technically accurate. Point out inefficiencies, bad practices, and weird formatting.
            Keep it under 200 words. Make them laugh but also learn.`,
            prompt: `Roast this code:\n\n${code}`,
        });

        return { success: true, data: text };
    } catch (error) {
        return { success: false, error: 'Failed to roast code.' };
    }
}
