import OpenAI from 'openai';
import { AIProvider, GenerationOptions, ModelDTO, ProviderId } from '../types';
import { generateObject } from 'ai';
import { createOpenAI } from '@ai-sdk/openai';
import { z } from 'zod';

export class OpenRouterProvider implements AIProvider {
    id: ProviderId = 'openrouter';
    name = 'OpenRouter';
    private client: OpenAI | null = null;
    private sdkOpenAI: ReturnType<typeof createOpenAI> | null = null;

    constructor() {
        const apiKey = process.env.OPENROUTER_API_KEY;
        if (apiKey) {
            this.client = new OpenAI({
                apiKey: apiKey,
                baseURL: 'https://openrouter.ai/api/v1',
            });
            this.sdkOpenAI = createOpenAI({
                apiKey: apiKey,
                baseURL: 'https://openrouter.ai/api/v1',
            });
        }
    }

    isConfigured(): boolean {
        return !!this.client;
    }

    async generateText(modelName: string, prompt: string, options?: GenerationOptions): Promise<string> {
        if (!this.client) throw new Error('OpenRouter Provider not configured');

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
        if (!this.sdkOpenAI) throw new Error('OpenRouter Provider not configured');

        // Note: Vercel AI SDK 'generateObject' is generally more robust than raw OpenAI JSON mode
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
            { id: 'openai/gpt-4o-mini', name: 'GPT-4o Mini', provider: 'openrouter', isPro: false, contextWindow: 128000 },
            { id: 'openai/gpt-4o', name: 'GPT-4o', provider: 'openrouter', isPro: true, contextWindow: 128000 },
            { id: 'meta-llama/llama-3.1-8b-instruct:free', name: 'Llama 3.1 8B (Free)', provider: 'openrouter', isPro: false, contextWindow: 128000 },
            { id: 'google/gemini-2.0-flash-exp:free', name: 'Gemini 2.0 Flash (Free)', provider: 'openrouter', isPro: false, contextWindow: 1000000 },
            // Add user specific models requested
            { id: 'openai/gpt-oss-120b', name: 'GPT OSS 120b', provider: 'openrouter', isPro: true, contextWindow: 32000 }, // Assuming this exists or is alias
        ];
    }
}
