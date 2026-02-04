import { AIProvider, GenerationOptions, ModelDTO, ProviderId } from '../types';
import { generateObject, generateText } from 'ai';
import { createOpenAI } from '@ai-sdk/openai';
import { z } from 'zod';

export class OpenAIProvider implements AIProvider {
    id: ProviderId = 'openai';
    name = 'OpenAI';
    private sdkOpenAI: ReturnType<typeof createOpenAI> | null = null;
    private apiKey: string | null = null;

    constructor() {
        const apiKey = process.env.OPENAI_API_KEY;
        if (apiKey) {
            this.apiKey = apiKey;
            this.sdkOpenAI = createOpenAI({
                apiKey: apiKey,
            });
        }
    }

    isConfigured(): boolean {
        return !!this.sdkOpenAI;
    }

    async generateText(modelName: string, prompt: string, options?: GenerationOptions): Promise<string> {
        if (!this.sdkOpenAI) throw new Error('OpenAI Provider not configured');

        const finalPrompt = options?.systemPrompt
            ? `System: ${options.systemPrompt}\n\nUser: ${prompt}`
            : prompt;

        const settings: any = {
            model: this.sdkOpenAI(modelName),
            prompt: finalPrompt,
            maxTokens: options?.maxTokens,
            temperature: options?.temperature,
            topP: options?.topP,
        };

        const { text } = await generateText(settings);

        return text;
    }

    async generateObject<T>(modelName: string, prompt: string, schema: z.ZodSchema<T>, options?: GenerationOptions): Promise<T> {
        if (!this.sdkOpenAI) throw new Error('OpenAI Provider not configured');

        const finalPrompt = options?.systemPrompt
            ? `System: ${options.systemPrompt}\n\nUser: ${prompt}`
            : prompt;

        const { object } = await generateObject({
            model: this.sdkOpenAI(modelName),
            schema: schema,
            prompt: finalPrompt,
            mode: options?.jsonMode ? 'json' : 'auto',
        });

        return object;
    }

    getModels(): ModelDTO[] {
        return [
            { id: 'gpt-4o', name: 'GPT-4o', provider: 'openai', isPro: true, contextWindow: 128000 },
            { id: 'gpt-4o-mini', name: 'GPT-4o Mini', provider: 'openai', isPro: false, contextWindow: 128000 },
            { id: 'gpt-4-turbo', name: 'GPT-4 Turbo', provider: 'openai', isPro: true, contextWindow: 128000 },
            { id: 'gpt-3.5-turbo', name: 'GPT-3.5 Turbo', provider: 'openai', isPro: false, contextWindow: 16000 },
        ];
    }

    getModelInstance(modelId: string): any {
        if (!this.sdkOpenAI) throw new Error('OpenAI Provider not configured');
        return this.sdkOpenAI(modelId);
    }
}
