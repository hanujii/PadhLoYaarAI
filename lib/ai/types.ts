import { z } from 'zod';

export type ProviderId = 'google' | 'openrouter' | 'github' | 'groq' | 'openai' | 'sambanova';

export interface ImagePart {
    inlineData: {
        data: string; // base64 encoded
        mimeType: string;
    };
}

export interface GenerationOptions {
    temperature?: number;
    maxTokens?: number;
    topP?: number;
    systemPrompt?: string;
    jsonMode?: boolean;
    images?: ImagePart[]; // For multimodal/vision support
}

export interface ModelDTO {
    id: string;
    name: string;
    provider: ProviderId;
    isPro: boolean; // "Pro" models are more expensive/smarter
    contextWindow: number;
}

export interface AIProvider {
    id: ProviderId;
    name: string;

    /**
     * Check if the provider is configured and healthy (e.g. has API key)
     */
    isConfigured(): boolean;

    /**
     * Generate plain text response
     */
    generateText(model: string, prompt: string, options?: GenerationOptions): Promise<string>;

    /**
     * Generate structured object response
     */
    generateObject<T>(model: string, prompt: string, schema: z.ZodSchema<T>, options?: GenerationOptions): Promise<T>;

    /**
     * Get list of supported models
     */
    getModels(): ModelDTO[];

    /**
     * Get the Vercel AI SDK Model instance for streaming
     */
    getModelInstance(modelId: string): any;
}
