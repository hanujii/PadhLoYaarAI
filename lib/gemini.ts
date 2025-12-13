import OpenAI from 'openai';
import { GoogleGenerativeAI } from '@google/generative-ai';

const openRouterKey = process.env.OPENROUTER_API_KEY;
const googleKey = process.env.GEMINI_API_KEY;
const sambanovaKey = process.env.SAMBANOVA_API_KEY;

const openai = openRouterKey ? new OpenAI({
    apiKey: openRouterKey,
    baseURL: 'https://openrouter.ai/api/v1',
}) : null;

const sambanova = sambanovaKey ? new OpenAI({
    apiKey: sambanovaKey,
    baseURL: 'https://api.sambanova.ai/v1',
}) : null;

const genAI = googleKey ? new GoogleGenerativeAI(googleKey) : null;

// Map to OpenRouter's specifically free models and Google's models
const MODEL_MAP = {
    flash: {
        openrouter: 'google/gemini-2.0-flash-exp:free', // Use 2.0 Flash Exp (High Rate Limit)
        google: 'gemini-1.5-flash', // Stable Flash
        sambanova: 'Meta-Llama-3.1-8B-Instruct',
    },
    pro: {
        // "Pro" tasks will now aggressively try to use high-capacity free models
        // effectively making "Pro" == "Best Free Smart Model"
        openrouter: 'google/gemini-2.0-flash-thinking-exp:free', // Experimental thinking model (very smart, free)
        google: 'gemini-1.5-flash', // Fallback to Flash if Pro isn't available/paid
        sambanova: 'Meta-Llama-3.1-70B-Instruct',
    },
    nano: { // Fallback
        openrouter: 'google/gemini-2.0-flash-exp:free',
        google: 'gemini-1.5-flash',
        sambanova: 'Meta-Llama-3.1-8B-Instruct',
    }
};

export async function generateText(modelType: 'flash' | 'pro' | 'nano', prompt: string) {
    // 1. Try Google AI First (Most reliable if key works)
    if (genAI) {
        try {
            console.log(`[GoogleAI] Generating text with model: ${modelType}`);
            const model = genAI.getGenerativeModel({ model: MODEL_MAP[modelType].google });
            const result = await model.generateContent(prompt);
            return result.response.text();
        } catch (error) {
            console.error("[GoogleAI] Error generating text, trying fallbacks...", error);
        }
    }

    // 2. Try OpenRouter Second
    if (openai) {
        try {
            console.log(`[OpenRouter] Generating text with model: ${modelType}`);
            const completion = await openai.chat.completions.create({
                model: MODEL_MAP[modelType].openrouter,
                messages: [{ role: 'user', content: prompt }],
            });
            return completion.choices[0].message.content || "";
        } catch (error) {
            console.warn("[OpenRouter] Failed, trying fallback to Sambanova...", error);
        }
    }

    // 3. Fallback to Sambanova
    if (sambanova) {
        try {
            console.log(`[Sambanova] Generating text with model: ${modelType}`);
            const completion = await sambanova.chat.completions.create({
                model: MODEL_MAP[modelType].sambanova,
                messages: [{ role: 'user', content: prompt }],
            });
            return completion.choices[0].message.content || "";
        } catch (error) {
            console.warn("[Sambanova] Failed (Final Fallback)...", error);
        }
    }

    throw new Error("All AI providers failed. Please check your API keys.");
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function generateVision(modelType: 'flash' | 'pro', prompt: string, imageParts: any[]) {
    // 1. Try Google AI First (Best native vision support)
    if (genAI) {
        try {
            console.log(`[GoogleAI] Generating vision with model: ${modelType}`);
            // Force use of 1.5 Flash for vision as it is very good and stable
            const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
            const result = await model.generateContent([prompt, ...imageParts]);
            return result.response.text();
        } catch (error) {
            console.error("[GoogleAI] Vision Error, trying fallbacks:", error);
        }
    }

    // 2. Try OpenRouter
    if (openai) {
        try {
            console.log(`[OpenRouter] Generating vision with model: ${modelType}`);
            const formattedContent: any[] = [
                { type: "text", text: prompt }
            ];

            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            imageParts.forEach((part: any) => {
                if (part.inlineData) {
                    formattedContent.push({
                        type: "image_url",
                        image_url: {
                            url: `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`
                        }
                    });
                }
            });

            // Use free vision model on OR
            const completion = await openai.chat.completions.create({
                model: 'google/gemini-2.0-flash-exp:free',
                messages: [{ role: 'user', content: formattedContent }],
            });

            return completion.choices[0].message.content || "";
        } catch (error) {
            console.warn("[OpenRouter] Vision failed, trying fallback to Sambanova...", error);
        }
    }

    // 3. Fallback to Sambanova (Vision)
    if (sambanova) {
        try {
            console.log(`[Sambanova] Generating vision with model: ${modelType}`);
            const formattedContent: any[] = [
                { type: "text", text: prompt }
            ];

            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            imageParts.forEach((part: any) => {
                if (part.inlineData) {
                    formattedContent.push({
                        type: "image_url",
                        image_url: {
                            url: `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`
                        }
                    });
                }
            });

            const completion = await sambanova.chat.completions.create({
                model: 'Llama-3.2-11B-Vision-Instruct',
                messages: [{ role: 'user', content: formattedContent }],
            });
            return completion.choices[0].message.content || "";

        } catch (error) {
            console.warn("[Sambanova] Vision failed (Final Fallback)...", error);
        }
    }

    throw new Error("No available AI providers configured for Vision.");
}
