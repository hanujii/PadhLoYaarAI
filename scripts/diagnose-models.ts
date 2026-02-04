
import dotenv from 'dotenv';
dotenv.config();

const modelsToTest = [
    "gemini-1.5-flash",
    "gemini-1.5-flash-latest",
    "gemini-1.5-flash-001",
    "gemini-1.5-flash-002",
    "gemini-1.5-pro",
    "gemini-1.5-pro-latest",
    "gemini-pro",
    "gemini-2.0-flash-exp"
];

async function checkModel(modelName: string, apiKey: string) {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`;
    const body = {
        contents: [{ parts: [{ text: "Hello" }] }]
    };

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
        });

        const data = await response.json();

        if (response.ok) {
            console.log(`✅ [SUCCESS] ${modelName} is working!`);
            return true;
        } else {
            console.log(`❌ [FAILED] ${modelName}: ${data.error?.message || response.statusText}`);
            return false;
        }
    } catch (e: any) {
        console.log(`❌ [ERROR] ${modelName}: ${e.message}`);
        return false;
    }
}

async function run() {
    const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY;
    if (!apiKey) {
        console.error("No API Key found in env");
        return;
    }

    console.log(`Testing API Key: ${apiKey.substring(0, 10)}...`);

    for (const model of modelsToTest) {
        await checkModel(model, apiKey);
    }
}

run();
