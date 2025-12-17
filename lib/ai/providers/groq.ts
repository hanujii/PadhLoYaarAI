import OpenAI from 'openai';
import { AIProvider, GenerationOptions, ModelDTO, ProviderId } from '../types';
import { generateObject } from 'ai';
import { createOpenAI } from '@ai-sdk/openai';
import { z } from 'zod';

export class GroqProvider implements AIProvider {
    id: ProviderId = 'groq';
    name = 'Groq';
    private client: OpenAI | null = null;
    private sdkOpenAI: ReturnType<typeof createOpenAI> | null = null;

    constructor() {
        const apiKey = process.env.GROQ_API_KEY;
        if (apiKey) {
            this.client = new OpenAI({
                apiKey: apiKey,
                baseURL: 'https://api.groq.com/openai/v1',
            });
            this.sdkOpenAI = createOpenAI({
                apiKey: apiKey,
                baseURL: 'https://api.groq.com/openai/v1',
            });
        }
    }

    isConfigured(): boolean {
        return !!this.client;
    }

    async generateText(modelName: string, prompt: string, options?: GenerationOptions): Promise<string> {
        if (!this.client) throw new Error('Groq Provider not configured');

        const messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [];
        if (options?.systemPrompt) {
            messages.push({ role: 'system', content: options.systemPrompt });
        }
        messages.push({ role: 'user', content: prompt });

        const completion = await this.client.chat.completions.create({
            model: modelName,
            messages: messages,
            temperature: options?.temperature,
            max_tokens: options?.maxTokens,
            top_p: options?.topP,
        });

        return completion.choices[0].message.content || "";
    }

    async generateObject<T>(modelName: string, prompt: string, schema: z.ZodSchema<T>, options?: GenerationOptions): Promise<T> {
        if (!this.sdkOpenAI) throw new Error('Groq Provider not configured');

        const { object } = await generateObject({
            model: this.sdkOpenAI(modelName),
            schema: schema,
            prompt: prompt,
            system: options?.systemPrompt,
        });

        return object;
    }

    getModels(): ModelDTO[] {
        // Groq models
        return [
            { id: 'llama3-8b-8192', name: 'Llama 3 8B (Groq)', provider: 'groq', isPro: false, contextWindow: 8192 },
            { id: 'llama3-70b-8192', name: 'Llama 3 70B (Groq)', provider: 'groq', isPro: true, contextWindow: 8192 },
            { id: 'mixtral-8x7b-32768', name: 'Mixtral 8x7B (Groq)', provider: 'groq', isPro: false, contextWindow: 32768 },
            { id: 'gemma-7b-it', name: 'Gemma 7B (Groq)', provider: 'groq', isPro: false, contextWindow: 8192 },
        ];
    }

    getModelInstance(modelId: string): any {
        if (!this.sdkOpenAI) throw new Error('Groq Provider not configured');
        return this.sdkOpenAI(modelId);
    }
}
