import { aiEngine } from '@/lib/ai/engine';

export async function GET() {
    const geminiKey = process.env.GEMINI_API_KEY;
    const googleKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;
    const groqKey = process.env.GROQ_API_KEY;

    // Force reload to be sure
    aiEngine.reloadProviders();
    const models = aiEngine.getAllModels();
    const googleProvider = aiEngine.getProvider('google');
    const groqProvider = aiEngine.getProvider('groq');

    return new Response(JSON.stringify({
        env_gemini_present: !!geminiKey,
        env_google_present: !!googleKey,
        env_gemini_length: geminiKey ? geminiKey.length : 0,
        provider_google_configured: googleProvider?.isConfigured(),

        env_groq_present: !!groqKey,
        provider_groq_configured: groqProvider?.isConfigured(),

        total_models: models.length,
        models: models.map(m => `${m.provider}:${m.id}`),
        timestamp: new Date().toISOString()
    }, null, 2), {
        headers: { 'Content-Type': 'application/json' }
    });
}
