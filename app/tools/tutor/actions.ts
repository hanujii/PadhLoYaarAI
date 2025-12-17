'use server';

import { aiEngine } from '@/lib/ai/engine';
import { ProviderId } from '@/lib/ai/types';
import { generateObject } from 'ai';
import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { z } from 'zod';



export type ChatMessage = {
    role: 'user' | 'assistant';
    content: string;
};

export type ChatResponse = {
    answer: string;
    suggestions: string[];
};

/**
 * Generates an educational explanation using the AI model.
 * Adapts the persona based on the selected 'mode'.
 */
export async function getTutorResponse(formData: FormData) {
    const topic = formData.get('topic') as string;
    const mode = formData.get('mode') as string;
    const instructions = formData.get('instructions') as string;
    const provider = formData.get('provider') as string; // 'google', 'openrouter', etc.

    if (!topic) return { error: 'Topic is required' };

    // Construct a specialized system prompt based on the user's learning style
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
        const result = await aiEngine.generateText(prompt, {
            preferredProvider: provider as ProviderId,
            maxTokens: 4096, // Give enough space for detailed explanations
        });
        return { success: true, data: result.text };
    } catch (error: any) {
        console.error("Tutor Error:", error);
        return { success: false, error: error.message || 'Failed to generate response.' };
    }
}

/**
 * Handles multi-turn chat with history and suggestions.
 * Uses lib/gemini.ts for robust provider fallback.
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

        Return valid JSON in this format ONLY. Do not use markdown code blocks.
        Ensure all strings are properly escaped. Do not use unescaped newlines inside strings.
        {
            "answer": "markdown string of the answer",
            "suggestions": ["suggestion 1", "suggestion 2", "suggestion 3"]
        }
        `;

        // Use the robust aiEngine utility
        const result = await aiEngine.generateText(prompt, {
            preferredProvider: 'google', // Chat uses simple JSON, Google is good. Or auto.
            maxTokens: 1024
        });
        let responseText = result.text;

        // 1. Strip Markdown Code Blocks (if any remain)
        responseText = responseText.replace(/```json/g, '').replace(/```/g, '').trim();

        // 2. Escape newlines inside the JSON string to prevent parsing errors
        // This is a naive fix but handles the common case where AI puts actual newlines in value strings
        // We assume valid JSON structure otherwise.
        // A better approach if this fails is to ask for distinct separators, but let's try strict prompt first.

        try {
            const data = JSON.parse(responseText);
            return { success: true, data: data };
        } catch (jsonError) {
            console.error("JSON Parse Failed:", responseText);
            // Fallback: If JSON fails, just return the text as a simple answer
            return {
                success: true,
                data: {
                    answer: responseText,
                    suggestions: ["Tell me more", "Explain simply", "Quiz me"]
                }
            };
        }
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
