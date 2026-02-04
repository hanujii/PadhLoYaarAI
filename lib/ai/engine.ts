import { AIProvider, GenerationOptions, ModelDTO, ProviderId } from './types';
import { GoogleProvider } from './providers/google';
import { OpenRouterProvider } from './providers/openrouter';
import { GithubProvider } from './providers/github';
import { GroqProvider } from './providers/groq';
import { OpenAIProvider } from './providers/openai';
import { SambaNovaProvider } from './providers/sambanova';
import { z } from 'zod';

class AIEngine {
    private providers: Map<ProviderId, AIProvider> = new Map();
    // Order of preference for auto-selection: Groq (Fast/Free) > SambaNova > Google > Others
    private priorityOrder: ProviderId[] = ['groq', 'sambanova', 'google', 'openai', 'openrouter', 'github'];

    constructor() {
        this.initializeProviders();
    }

    private initializeProviders() {
        // Always create new instances to pick up fresh env vars
        const providers = [
            new GroqProvider(),
            new SambaNovaProvider(),
            new GoogleProvider(),
            new OpenRouterProvider(),
            new GithubProvider(),
            new OpenAIProvider()
        ];

        this.providers.clear();

        providers.forEach(p => {
            if (p.isConfigured()) {
                this.providers.set(p.id, p);
                console.log(`[AIEngine] Provider registered: ${p.name}`);
            }
        });
    }

    // ... (reloadProviders, getProvider, getAllModels remain same) ...

    /**
     * Force reload of providers (useful if env vars change)
     */
    public reloadProviders() {
        console.log('[AIEngine] Reloading providers...');
        this.initializeProviders();
    }

    getProvider(id: ProviderId): AIProvider | undefined {
        return this.providers.get(id);
    }

    getAllModels(): ModelDTO[] {
        if (this.providers.size === 0) this.initializeProviders();
        let models: ModelDTO[] = [];
        for (const provider of this.providers.values()) {
            if (provider.isConfigured()) {
                models = [...models, ...provider.getModels()];
            }
        }
        return models;
    }

    private selectEvaluationOrder(preferredProvider?: ProviderId): AIProvider[] {
        if (this.providers.size === 0) this.initializeProviders();
        let order = [...this.priorityOrder];
        if (preferredProvider && this.providers.has(preferredProvider)) {
            order = [preferredProvider, ...order.filter(id => id !== preferredProvider)];
        }
        return order.map(id => this.providers.get(id)).filter((p): p is AIProvider => !!p);
    }

    /**
     * Helper to pick a smart default "Free" or "Pro" model for a provider
     */
    private getDefaultModelForProvider(provider: AIProvider, isPro: boolean): string {
        const models = provider.getModels();

        // Specific optimized defaults
        if (provider.id === 'groq') {
            return isPro ? 'llama-3.3-70b-versatile' : 'llama-3.1-8b-instant';
        }
        if (provider.id === 'google') {
            return isPro ? 'gemini-1.5-pro' : 'gemini-1.5-flash';
        }

        const candidates = models.filter(m => m.isPro === isPro);
        const model = candidates.length > 0 ? candidates[0] : models[0];
        return model?.id || "";
    }

    async generateText(prompt: string, options?: GenerationOptions & { preferredProvider?: ProviderId, forceModel?: string }): Promise<{ text: string, providerUsed: string, modelUsed: string }> {
        // Ensure providers are loaded
        if (this.providers.size === 0) {
            console.log('[AIEngine] No providers found, attempting initialization...');
            this.initializeProviders();
        }

        const providers = this.selectEvaluationOrder(options?.preferredProvider);
        const isPro = false; // Default to efficient models unless specified (future arg)

        if (providers.length === 0) {
            throw new Error("No AI providers configured. Please check your .env.local file and add a valid API key (e.g., GEMINI_API_KEY).");
        }

        const errors: string[] = [];

        for (const provider of providers) {
            try {
                // Determine model: Force > Preferred > Default
                const model = options?.forceModel && options.forceModel !== 'auto'
                    ? options.forceModel
                    : this.getDefaultModelForProvider(provider, isPro);

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
        // Ensure providers are loaded
        if (this.providers.size === 0) {
            this.initializeProviders();
        }

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

    /**
     * Returns a valid model ID from the highest priority configured provider.
     */
    getSmartDefaultModel(): string {
        const providers = this.selectEvaluationOrder();
        if (providers.length === 0) throw new Error("No AI configured.");

        // Try to find a "Flash/Mini" style model first (not pro)
        const firstProvider = providers[0];
        const models = firstProvider.getModels();
        const efficientModel = models.find(m => !m.isPro);
        return efficientModel?.id || models[0].id;
    }
}

// Singleton Instance
export const aiEngine = new AIEngine();
