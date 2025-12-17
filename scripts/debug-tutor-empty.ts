
import dotenv from 'dotenv';
dotenv.config();

import { streamText } from 'ai';
import { createGoogleGenerativeAI } from '@ai-sdk/google';

async function main() {
    process.env.GEMINI_API_KEY = process.env.GEMINI_API_KEY || process.env.GOOGLE_GENERATIVE_AI_API_KEY;
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
        console.error("No API Key found.");
        return;
    }

    console.log("Checking available models for this key...");

    // Let's try to just run with `gemini-1.5-flash-001` which is the stable version.

    const candidates = [
        'gemini-1.5-flash',
        'gemini-1.5-flash-001',
        'gemini-1.5-flash-latest',
        'gemini-pro',
        'gemini-1.0-pro'
    ];

    const google = createGoogleGenerativeAI({ apiKey });

    for (const modelId of candidates) {
        console.log(`\nTesting Model ID: ${modelId}`);
        try {
            const result = streamText({
                model: google(modelId),
                prompt: "Hello",
            });

            let text = "";
            for await (const chunk of result.textStream) {
                text += chunk;
            }
            console.log(`SUCCESS: ${modelId} works! Response: ${text.substring(0, 20)}...`);
        } catch (e: any) {
            console.error(`FAILED: ${modelId} - ${e.message?.substring(0, 100)}`);
        }
    }
}

main().catch(console.error);
