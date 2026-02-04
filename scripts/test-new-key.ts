
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
import { createOpenAI } from '@ai-sdk/openai';
import { generateText } from 'ai';

async function testKey() {
    const key = process.env.OPENAI_API_KEY;
    if (!key) {
        console.error("❌ No API Key found in .env.local");
        process.exit(1);
    }
    console.log(`✅ Using Key: ${key.substring(0, 10)}... (Length: ${key.length})`);

    const openai = createOpenAI({ apiKey: key });

    try {
        console.log("Testing gpt-4o-mini...");
        const result = await generateText({
            model: openai('gpt-4o-mini'),
            prompt: "Say hello",
        });
        console.log("✅ Success:", result.text);
    } catch (error: any) {
        console.error("❌ Failed:", error.message);
        if (error.response) {
            console.error("Response:", JSON.stringify(error.response, null, 2));
        }
    }
}

testKey();
