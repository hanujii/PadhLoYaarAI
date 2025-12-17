import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { generateText } from 'ai';
import * as dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY;

async function run() {
    const candidates = [
        'gemini-1.5-flash-latest',
        'gemini-1.5-flash-001',
        'gemini-1.5-flash-002',
        'gemini-1.5-flash-8b',
        'gemini-pro'
    ];

    for (const modelId of candidates) {
        console.log(`\n--- Testing: ${modelId} ---`);
        const aiModel = createGoogleGenerativeAI({ apiKey })(modelId);

        try {
            const result = await generateText({
                model: aiModel,
                messages: [{ role: 'user', content: 'Hi' }],
            });
            console.log(`Success! Response: ${result.text}`);
            // If success, we found a winner
            break;
        } catch (e: any) {
            console.error(`Failed: ${e.message}`);
        }
    }
}

run();
