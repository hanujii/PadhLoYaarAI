import { GoogleGenerativeAI } from '@google/generative-ai';
import * as dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY;

if (!apiKey) {
    console.error("No API KEY");
    process.exit(1);
}

async function run() {
    console.log("Testing @google/generative-ai (Official SDK)...");
    const genAI = new GoogleGenerativeAI(apiKey as string);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    try {
        const result = await model.generateContentStream("Explain quantum physics simply.");

        console.log("Stream started...");
        for await (const chunk of result.stream) {
            const text = chunk.text();
            process.stdout.write(text);
        }
        console.log("\nSuccess!");
    } catch (e: any) {
        console.error("Failed:", e.message);
    }
}

run();
