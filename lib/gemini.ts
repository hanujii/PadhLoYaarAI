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
        openrouter: 'google/gemini-2.0-flash-exp:free',
        google: 'gemini-2.0-flash-exp',
        sambanova: 'Meta-Llama-3.1-8B-Instruct',
    },
    pro: {
        openrouter: 'google/gemini-exp-1206:free',
        google: 'gemini-exp-1206',
        sambanova: 'Meta-Llama-3.1-70B-Instruct',
    },
    nano: { // Fallback
        openrouter: 'google/gemini-2.0-flash-exp:free',
        google: 'gemini-2.0-flash-exp',
        sambanova: 'Meta-Llama-3.1-8B-Instruct',
    }
};

export async function generateText(modelType: 'flash' | 'pro' | 'nano', prompt: string) {
    // 1. Try OpenRouter First
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

    // 2. Fallback to Sambanova
    if (sambanova) {
        try {
            console.log(`[Sambanova] Generating text with model: ${modelType}`);
            const completion = await sambanova.chat.completions.create({
                model: MODEL_MAP[modelType].sambanova,
                messages: [{ role: 'user', content: prompt }],
            });
            return completion.choices[0].message.content || "";
        } catch (error) {
            console.warn("[Sambanova] Failed, trying fallback to Google...", error);
        }
    }

    // 3. Fallback to Google AI
    if (genAI) {
        try {
            console.log(`[GoogleAI] Generating text with model: ${modelType}`);
            const model = genAI.getGenerativeModel({ model: MODEL_MAP[modelType].google });
            const result = await model.generateContent(prompt);
            return result.response.text();
        } catch (error) {
            console.error("[GoogleAI] Error generating text:", error);
            throw error;
        }
    }

    throw new Error("No available AI providers configured (Check keys).");
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function generateVision(modelType: 'flash' | 'pro', prompt: string, imageParts: any[]) {
    // 1. Try OpenRouter First
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

            const completion = await openai.chat.completions.create({
                model: MODEL_MAP[modelType].openrouter,
                messages: [{ role: 'user', content: formattedContent }],
            });

            return completion.choices[0].message.content || "";
        } catch (error) {
            console.warn("[OpenRouter] Vision failed, trying fallback to Sambanova...", error);
        }
    }

    // 2. Fallback to Sambanova (Vision)
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
                model: 'Llama-3.2-11B-Vision-Instruct', // Specific model for vision
                messages: [{ role: 'user', content: formattedContent }],
            });
            return completion.choices[0].message.content || "";

        } catch (error) {
            console.warn("[Sambanova] Vision failed, trying fallback to Google...", error);
        }

    }


    // 3. Fallback to Google AI
    if (genAI) {
        try {
            console.log(`[GoogleAI] Generating vision with model: ${modelType}`);
            const model = genAI.getGenerativeModel({ model: MODEL_MAP[modelType].google });
            const result = await model.generateContent([prompt, ...imageParts]);
            return result.response.text();
        } catch (error) {
            console.error("[GoogleAI] Vision Error:", error);
            throw error;
        }
    }

    throw new Error("No available AI providers configured (Check keys).");
}
