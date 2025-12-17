import OpenAI from 'openai';
import { AIProvider, GenerationOptions, ModelDTO, ProviderId } from '../types';
import { generateObject } from 'ai';
import { createOpenAI } from '@ai-sdk/openai';
import { z } from 'zod';

export class GithubProvider implements AIProvider {
    id: ProviderId = 'github';
    name = 'Github Models';
    private client: OpenAI | null = null;
    private sdkOpenAI: ReturnType<typeof createOpenAI> | null = null;

    constructor() {
        // GH Token usually in GITHUB_TOKEN or GITHUB_PAT
        const apiKey = process.env.GITHUB_TOKEN || process.env.GITHUB_PAT;
        if (apiKey) {
            this.client = new OpenAI({
                apiKey: apiKey,
                baseURL: 'https://models.inference.ai.azure.com', // Github Models Endpoint
            });
            this.sdkOpenAI = createOpenAI({
                apiKey: apiKey,
                baseURL: 'https://models.inference.ai.azure.com',
            });
        }
    }

    isConfigured(): boolean {
        return !!this.client;
    }

    async generateText(modelName: string, prompt: string, options?: GenerationOptions): Promise<string> {
        if (!this.client) throw new Error('Github Provider not configured');

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
        if (!this.sdkOpenAI) throw new Error('Github Provider not configured');

        const { object } = await generateObject({
            model: this.sdkOpenAI(modelName),
            schema: schema,
            prompt: prompt,
            system: options?.systemPrompt,
        });

        return object;
    }

    getModels(): ModelDTO[] {
        // Github Models (Azure Inference) names
        return [
            { id: 'gpt-4o', name: 'GPT-4o (Github)', provider: 'github', isPro: true, contextWindow: 128000 },
            { id: 'gpt-4o-mini', name: 'GPT-4o Mini (Github)', provider: 'github', isPro: false, contextWindow: 128000 },
            { id: 'Meta-Llama-3.1-70B-Instruct', name: 'Llama 3.1 70B (Github)', provider: 'github', isPro: true, contextWindow: 128000 },
        ];
    }
}
