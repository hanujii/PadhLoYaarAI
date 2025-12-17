'use server';

import { aiEngine } from '@/lib/ai/engine';
import { ProviderId } from '@/lib/ai/types';
import { generateObject, generateText } from 'ai';
import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { z } from 'zod';



// Removed streamTutorResponse - moved to API route for better streaming support

export type ChatResponse = {
    answer: string;
    suggestions: string[];
};

export type ChatMessage = {
    role: 'user' | 'assistant';
    content: string;
};


/**
 * Generates an educational explanation using the AI model.
 * Adapts the persona based on the selected 'mode'.
 */
export async function getTutorResponse(formData: FormData) {
    const topic = formData.get('topic') as string;
    const mode = formData.get('mode') as string;
    const instructions = formData.get('instructions') as string;
    const provider = formData.get('provider') as string;
    const imageFile = formData.get('image') as File | null;

    if (!topic && !imageFile) return { error: 'Topic or Image is required' };

    let systemPrompt = `You are an expert AI Tutor.`;
    if (mode === 'detailed') systemPrompt += ` Provide detailed, deep-dive explanations.`;
    else if (mode === 'eli5') systemPrompt += ` Explain like I'm 5.`;
    else systemPrompt += ` Provide clear, concise explanations.`;

    let userContent: any[] = [{ type: 'text', text: `Topic/Question: "${topic}"` }];

    if (instructions) {
        userContent.push({ type: 'text', text: `\nInstructions: ${instructions}` });
    }

    // Handle Image
    if (imageFile && imageFile.size > 0) {
        const arrayBuffer = await imageFile.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        // Optimize: Convert to base64 data URI for standard AI SDK usage if needed, 
        // OR pass buffer if provider supports it. Google provider supports 'image' part with buffer/base64.
        const base64 = buffer.toString('base64');
        userContent.push({
            type: 'image',
            image: base64, // Vercel AI SDK expects base64 or buffer usually
        });
        systemPrompt += `\n\nAnalyze the attached image and answer the user's question about it.`;
    }

    systemPrompt += `\n\nFormat your response in clean Markdown.`;

    try {
        const { text } = await generateText({
            model: createGoogleGenerativeAI({
                apiKey: process.env.NEXT_PUBLIC_GEMINI_API_KEY || process.env.GOOGLE_GENERATIVE_AI_API_KEY
            })('gemini-2.0-flash-exp'),
            messages: [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: userContent as any }
            ]
        });

        return { success: true, data: text };

    } catch (error: any) {
        console.error("Tutor Error:", error);
        return { success: false, error: error.message || 'Failed to generate response.' };
    }
}

/**
 * Handles multi-turn chat with history and suggestions.
 * Uses lib/gemini.ts for robust provider fallback.
 */
/**
 * Handles multi-turn chat with history and suggestions.
 * Uses aiEngine.generateObject for robust JSON parsing.
 */
export async function getChatResponse(messages: ChatMessage[]) {
    try {
        const historyText = messages.slice(0, -1).map(m => `${m.role}: ${m.content}`).join('\n');
        const lastMessage = messages[messages.length - 1];

        const prompt = `
        You are PadhLoYaar AI, a friendly and expert tutor.
        
        Session History:
        ${historyText}

        User's New Question: ${lastMessage.content}

        Your Goal:
        1. Answer the user's question clearly and concisely. Use Markdown formatting.
        2. Suggest 3 short, relevant follow-up questions the user might want to ask next.
        `;

        const { object } = await aiEngine.generateObject(prompt, z.object({
            answer: z.string().describe("Markdown answer string"),
            suggestions: z.array(z.string()).length(3).describe("3 Short follow-up questions")
        }));

        return { success: true, data: object };

    } catch (error: any) {
        console.error("Chat Error:", error);
        return { success: false, error: error.message || 'Failed to get chat response.' };
    }
}

export async function checkUnderstanding(originalTopic: string, userExplanation: string) {
    try {
        const prompt = `
        The user was learning about "${originalTopic}".
        They just explained it back to you: "${userExplanation}".
        
        Assess their understanding.
        1. Is it correct? (true/false)
        2. Provide feedback (keep it encouraging but correct any misconceptions).
        
        Return JSON: { "isCorrect": boolean, "feedback": string }
        `;

        const { object, providerUsed } = await aiEngine.generateObject(prompt, z.object({
            isCorrect: z.boolean(),
            feedback: z.string(),
        }), {
            // "Pro" logic can be handled by engine if needed, but for simple JSON, Flash/Mini is fine.
            // aiEngine handles defaults.
            maxTokens: 1024,
        });

        console.log(`[CheckUnderstanding] Used provider: ${providerUsed}`);
        return object;
    } catch (error) {
        console.error("Check Understanding Error:", error);
        return { isCorrect: false, feedback: "Sorry, I couldn't assess your answer right now." };
    }
}
