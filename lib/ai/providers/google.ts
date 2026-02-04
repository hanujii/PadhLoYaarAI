import { GoogleGenerativeAI } from '@google/generative-ai';
import { AIProvider, GenerationOptions, ModelDTO, ProviderId } from '../types';
import { generateObject } from 'ai';
import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { z } from 'zod';

export class GoogleProvider implements AIProvider {
    id: ProviderId = 'google';
    name = 'Google AI';
    private client: GoogleGenerativeAI | null = null;
    private sdkGoogle: ReturnType<typeof createGoogleGenerativeAI> | null = null;

    constructor() {
        const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_GENERATIVE_AI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY;
        if (apiKey) {
            this.client = new GoogleGenerativeAI(apiKey);
            this.sdkGoogle = createGoogleGenerativeAI({ apiKey });
        }
    }

    isConfigured(): boolean {
        return !!this.client;
    }

    async generateText(modelName: string, prompt: string, options?: GenerationOptions): Promise<string> {
        if (!this.client) throw new Error('Google Provider not configured (Check API Key)');

        try {
            const model = this.client.getGenerativeModel({
                model: modelName,
                generationConfig: {
                    maxOutputTokens: options?.maxTokens,
                    temperature: options?.temperature,
                    topP: options?.topP,
                    responseMimeType: options?.jsonMode ? 'application/json' : 'text/plain',
                }
            });

            const finalPrompt = options?.systemPrompt
                ? `System: ${options.systemPrompt}\n\nUser: ${prompt}`
                : prompt;

            // Build content parts - supports multimodal with images
            const contentParts: any[] = [{ text: finalPrompt }];

            if (options?.images && options.images.length > 0) {
                for (const img of options.images) {
                    contentParts.push({
                        inlineData: {
                            data: img.inlineData.data,
                            mimeType: img.inlineData.mimeType,
                        }
                    });
                }
            }

            console.log(`[GoogleProvider] Generating with ${modelName}...`);
            const result = await model.generateContent(contentParts);
            const text = result.response.text();
            return text;
        } catch (error: any) {
            console.error('[GoogleProvider] Generation Failed:', error);
            throw new Error(`Google AI Error: ${error.message || error}`);
        }
    }

    async generateObject<T>(modelName: string, prompt: string, schema: z.ZodSchema<T>, options?: GenerationOptions): Promise<T> {
        if (!this.sdkGoogle) throw new Error('Google Provider not configured');

        const finalPrompt = options?.systemPrompt
            ? `System: ${options.systemPrompt}\n\nUser: ${prompt}`
            : prompt;

        const { object } = await generateObject({
            model: this.sdkGoogle(modelName),
            schema: schema,
            prompt: finalPrompt,
            mode: 'json', // Force JSON mode for better reliability
        });

        return object;
    }

    getModels(): ModelDTO[] {
        return [
            { id: 'gemini-1.5-flash', name: 'Gemini 1.5 Flash', provider: 'google', isPro: false, contextWindow: 1000000 },
            { id: 'gemini-1.5-pro', name: 'Gemini 1.5 Pro', provider: 'google', isPro: true, contextWindow: 2000000 },
            { id: 'gemini-2.0-flash-exp', name: 'Gemini 2.0 Flash (Exp)', provider: 'google', isPro: false, contextWindow: 1000000 },
        ];
    }

    getModelInstance(modelId: string): any {
        if (!this.sdkGoogle) throw new Error('Google Provider not configured');
        return this.sdkGoogle(modelId);
    }
}
