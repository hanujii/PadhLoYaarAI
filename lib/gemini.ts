import { aiEngine } from './ai/engine';
import { ImagePart } from './ai/types';

// Backward compatibility function signature
export async function generateText(modelType: 'flash' | 'pro' | 'nano', prompt: string) {
    // Map legacy 'modelType' to new engine preferences if needed
    // 'flash' -> isPro: false
    // 'pro' -> isPro: true
    // For now the engine handles defaults intelligently.

    // We can pass current user intent via options slightly
    const result = await aiEngine.generateText(prompt, {
        maxTokens: 8192,
        temperature: 0.7,
    });

    return result.text;
}

// Vision backward compatibility - Now properly supports multimodal
export async function generateVision(modelType: 'flash' | 'pro', prompt: string, imageParts: ImagePart[]) {
    const result = await aiEngine.generateText(prompt, {
        maxTokens: 8192,
        temperature: 0.7,
        images: imageParts,
        preferredProvider: 'google', // Google has best vision support
    });

    return result.text;
}
