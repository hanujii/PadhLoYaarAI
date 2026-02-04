
import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { generateText } from 'ai';
import dotenv from 'dotenv';
dotenv.config();

async function testGemini() {
    try {
        const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY;
        console.log("Testing with Key:", apiKey ? "FOUND (" + apiKey.substring(0, 10) + "...)" : "MISSING");

        if (!apiKey) throw new Error("No API Key found");

        const google = createGoogleGenerativeAI({
            apiKey: apiKey
        });

        console.log("Generating text...");
        const { text } = await generateText({
            model: google('gemini-1.5-flash-latest'),
            prompt: 'Explain Quantum Entanglement in one sentence.',
        });

        console.log("\nSuccess! Response:\n", text);
    } catch (error: any) {
        console.error("\nFailure!", error);
    }
}

testGemini();
