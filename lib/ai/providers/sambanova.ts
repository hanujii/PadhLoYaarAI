import OpenAI from 'openai';
import { AIProvider, GenerationOptions, ModelDTO, ProviderId } from '../types';
import { generateObject } from 'ai';
import { createOpenAI } from '@ai-sdk/openai';
import { z } from 'zod';

export class SambaNovaProvider implements AIProvider {
    id: ProviderId = 'sambanova';
    name = 'SambaNova';
    private client: OpenAI | null = null;
    private sdkOpenAI: ReturnType<typeof createOpenAI> | null = null;

    constructor() {
        const apiKey = process.env.SAMBANOVA_API_KEY;
        const baseURL = "https://api.sambanova.ai/v1";

        if (apiKey && apiKey.length > 1) {
            this.client = new OpenAI({
                apiKey: apiKey,
                baseURL: baseURL,
            });
            this.sdkOpenAI = createOpenAI({
                apiKey: apiKey,
                baseURL: baseURL,
            });
        }
    }

    isConfigured(): boolean {
        return !!this.client;
    }

    async generateText(modelName: string, prompt: string, options?: GenerationOptions): Promise<string> {
        if (!this.client) throw new Error('SambaNova Provider not configured');

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
            response_format: options?.jsonMode ? { type: 'json_object' } : undefined,
        });

        return completion.choices[0].message.content || "";
    }

    async generateObject<T>(modelName: string, prompt: string, schema: z.ZodSchema<T>, options?: GenerationOptions): Promise<T> {
        if (!this.sdkOpenAI) throw new Error('SambaNova Provider not configured');

        const { object } = await generateObject({
            model: this.sdkOpenAI(modelName),
            schema: schema,
            prompt: prompt,
            system: options?.systemPrompt,
        });

        return object;
    }

    getModels(): ModelDTO[] {
        return [
            { id: 'Meta-Llama-3.1-8B-Instruct', name: 'Llama 3.1 8B (SambaNova)', provider: 'sambanova', isPro: false, contextWindow: 131072 },
            { id: 'Meta-Llama-3.1-70B-Instruct', name: 'Llama 3.1 70B (SambaNova)', provider: 'sambanova', isPro: true, contextWindow: 131072 },
            { id: 'Meta-Llama-3.1-405B-Instruct', name: 'Llama 3.1 405B (SambaNova)', provider: 'sambanova', isPro: true, contextWindow: 131072 },
        ];
    }

    getModelInstance(modelId: string): any {
        if (!this.sdkOpenAI) throw new Error('SambaNova Provider not configured');
        return this.sdkOpenAI(modelId);
    }
}
