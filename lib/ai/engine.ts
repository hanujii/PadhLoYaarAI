import { AIProvider, GenerationOptions, ModelDTO, ProviderId } from './types';
import { GoogleProvider } from './providers/google';
import { OpenRouterProvider } from './providers/openrouter';
import { GithubProvider } from './providers/github';
import { GroqProvider } from './providers/groq';
import { z } from 'zod';

class AIEngine {
    private providers: Map<ProviderId, AIProvider> = new Map();
    // Order of preference for auto-selection
    private priorityOrder: ProviderId[] = ['google', 'openrouter', 'groq', 'github'];

    constructor() {
        this.initializeProviders();
    }

    private initializeProviders() {
        const providers = [
            new GoogleProvider(),
            new OpenRouterProvider(),
            new GroqProvider(),
            new GithubProvider()
        ];

        providers.forEach(p => {
            if (p.isConfigured()) {
                this.providers.set(p.id, p);
                console.log(`[AIEngine] Provider registered: ${p.name}`);
            } else {
                console.warn(`[AIEngine] Provider skipped (missing keys): ${p.name}`);
            }
        });
    }

    getProvider(id: ProviderId): AIProvider | undefined {
        return this.providers.get(id);
    }

    getAllModels(): ModelDTO[] {
        let models: ModelDTO[] = [];
        for (const provider of this.providers.values()) {
            models = [...models, ...provider.getModels()];
        }
        return models;
    }

    /**
     * Determines the best model/provider tuple to use based on constraints and preference.
     */
    private selectEvaluationOrder(preferredProvider?: ProviderId): AIProvider[] {
        let order = [...this.priorityOrder];

        // If user has a preference, move it to the front
        if (preferredProvider && this.providers.has(preferredProvider)) {
            order = [preferredProvider, ...order.filter(id => id !== preferredProvider)];
        }

        return order
            .map(id => this.providers.get(id))
            .filter((p): p is AIProvider => !!p);
    }

    /**
     * Helper to pick a smart default "Free" or "Pro" model for a provider
     */
    private getDefaultModelForProvider(provider: AIProvider, isPro: boolean): string {
        const models = provider.getModels();
        const candidates = models.filter(m => m.isPro === isPro);
        // Fallback to any model if exact match not found
        const model = candidates.length > 0 ? candidates[0] : models[0];
        return model?.id || "";
    }

    async generateText(prompt: string, options?: GenerationOptions & { preferredProvider?: ProviderId, forceModel?: string }): Promise<{ text: string, providerUsed: string, modelUsed: string }> {
        const providers = this.selectEvaluationOrder(options?.preferredProvider);
        const isPro = false; // Default to efficient models unless specified (future arg)

        const errors: string[] = [];

        for (const provider of providers) {
            try {
                // Determine model: Force > Preferred > Default
                const model = options?.forceModel || this.getDefaultModelForProvider(provider, isPro);
                if (!model) continue;

                console.log(`[AIEngine] Attempting generation with ${provider.name} (${model})...`);
                const text = await provider.generateText(model, prompt, options);
                return { text, providerUsed: provider.name, modelUsed: model };

            } catch (err: any) {
                console.warn(`[AIEngine] ${provider.name} failed:`, err.message);
                errors.push(`${provider.name}: ${err.message}`);
                // Continue to next provider
            }
        }

        throw new Error(`All AI providers failed. Details:\n${errors.join('\n')}`);
    }

    async generateObject<T>(prompt: string, schema: z.ZodSchema<T>, options?: GenerationOptions & { preferredProvider?: ProviderId, forceModel?: string }): Promise<{ object: T, providerUsed: string }> {
        const providers = this.selectEvaluationOrder(options?.preferredProvider);

        // Structure generation usually requires smarter models
        const isPro = false;

        const errors: string[] = [];

        for (const provider of providers) {
            try {
                const model = options?.forceModel || this.getDefaultModelForProvider(provider, isPro);
                if (!model) continue;

                console.log(`[AIEngine] Attempting structured generation with ${provider.name} (${model})...`);
                const object = await provider.generateObject(model, prompt, schema, options);
                return { object, providerUsed: provider.name };

            } catch (err: any) {
                console.warn(`[AIEngine] ${provider.name} strucutred generation failed:`, err.message);
                errors.push(`${provider.name}: ${err.message}`);
            }
        }

        throw new Error(`All AI providers failed to generate object. Details:\n${errors.join('\n')}`);
    }

    /**
     * Gets the Vercel AI SDK Model instance for a specific model ID.
     * Searches all providers to find who owns this model.
     */
    getModelInstance(modelId: string): any {
        for (const provider of this.providers.values()) {
            const models = provider.getModels();
            if (models.some(m => m.id === modelId)) {
                return provider.getModelInstance(modelId);
            }
        }

        // Fallback: If model ID specifically looks like a provider's format, try that provider directly
        // Or default to preferred order (likely OpenRouter for broad support)
        if (modelId.startsWith('google/')) return this.providers.get('google')?.getModelInstance(modelId.replace('google/', ''));

        // If "auto" or unknown, verify providers
        const defaultProvider = this.providers.get('google');
        if (defaultProvider && defaultProvider.isConfigured()) {
            // Try to return a default model instance?
            return defaultProvider.getModelInstance('gemini-1.5-flash');
        }

        throw new Error(`Model '${modelId}' not found in any configured provider.`);
    }
}

// Singleton Instance
export const aiEngine = new AIEngine();
