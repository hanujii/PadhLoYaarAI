
import 'dotenv/config'; // Requires 'dotenv' package
import { aiEngine } from '../lib/ai/engine';

async function test() {
    console.log("Testing AI Engine...");
    console.log("Gemini Key Present:", !!process.env.GEMINI_API_KEY);
    console.log("OpenRouter Key Present:", !!process.env.OPENROUTER_API_KEY);
    console.log("Github Key Present:", !!process.env.GITHUB_TOKEN);
    console.log("Groq Key Present:", !!process.env.GROQ_API_KEY);

    // Test 1: Simple Text Generation (Auto)
    try {
        console.log("\n--- Test 1: Auto Selection ---");
        const result = await aiEngine.generateText("Hello, are you online?", { maxTokens: 50 });
        console.log(`Success! Provider: ${result.providerUsed}, Model: ${result.modelUsed}`);
        console.log(`Response: ${result.text.trim()}`);
    } catch (e) {
        console.error("Test 1 Failed:", e);
    }

    // Test 2: Specific Provider (Github)
    try {
        console.log("\n--- Test 2: Force Github ---");
        const result = await aiEngine.generateText("What is 2+2?", { preferredProvider: 'github', maxTokens: 10 });
        console.log(`Success! Provider: ${result.providerUsed}`);
    } catch (e: any) {
        console.warn("Test 2 Failed (Expected if Github key invalid/quota):", (e as any).message);
    }

    // Test 3: Specific Provider (Groq)
    try {
        console.log("\n--- Test 3: Force Groq ---");
        const result = await aiEngine.generateText("What is 2+2?", { preferredProvider: 'groq', maxTokens: 10 });
        console.log(`Success! Provider: ${result.providerUsed}`);
    } catch (e: any) {
        console.warn("Test 3 Failed:", (e as any).message);
    }
}

test();
