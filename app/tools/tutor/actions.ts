'use server';

import { generateText } from '@/lib/gemini';

export async function getTutorResponse(formData: FormData) {
    const topic = formData.get('topic') as string;
    const mode = formData.get('mode') as string;
    const instructions = formData.get('instructions') as string;

    if (!topic) return { error: 'Topic is required' };

    let prompt = `You are an expert AI Tutor. Explain the topic: "${topic}".`;

    if (mode === 'detailed') {
        prompt += ` Provide a detailed, deep-dive explanation with examples, history, and advanced concepts.`;
    } else if (mode === 'eli5') {
        prompt += ` Explain it like I'm 5 years old. Use simple analogies and simple language.`;
    } else {
        prompt += ` Provide a clear, concise step-by-step explanation.`;
    }

    if (instructions) {
        prompt += `\n\nAdditional Instructions: ${instructions}`;
    }

    prompt += `\n\nFormat your response in clean Markdown.`;

    try {
        console.log("[Tutor Action] Sending request to Gemini...");
        const text = await generateText('flash', prompt);
        console.log("[Tutor Action] Received response length:", text.length);
        return { success: true, data: text };
    } catch (error) {
        console.error("Tutor Error:", error);
        return { success: false, error: 'Failed to generate response. Check Server Logs.' };
    }
}
