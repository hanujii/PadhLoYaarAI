const { GoogleGenerativeAI } = require("@google/generative-ai");
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

// Load env vars manually
const envLocalPath = path.resolve(process.cwd(), '.env.local');

if (fs.existsSync(envLocalPath)) {
    const envConfig = dotenv.parse(fs.readFileSync(envLocalPath));
    for (const k in envConfig) {
        process.env[k] = envConfig[k];
    }
}

async function testGeminiModels() {
    const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_GENERATIVE_AI_API_KEY;

    let log = "--- Gemini Model Availability Test ---\n";
    log += `Time: ${new Date().toISOString()}\n`;

    if (!apiKey) {
        fs.writeFileSync('test-gemini-result.txt', log + "\n❌ No API Key found in env (GEMINI_API_KEY)", 'utf8');
        return;
    }

    try {
        const genAI = new GoogleGenerativeAI(apiKey);
        // There isn't a direct "listModels" on the client instance in some versions, 
        // but let's try the standard verify method by trying to get a model
        // Actually, the older SDK might not expose listModels easily, checking documentation...
        // We will try to invoke a simple generation on common models to see which succeed.

        const modelsToTest = [
            "gemini-2.0-flash-exp",
            "gemini-1.5-pro",
            "gemini-1.5-flash",
            "gemini-pro",
            "gemini-1.0-pro"
        ];

        log += "Testing specific models for availability:\n";

        for (const modelName of modelsToTest) {
            try {
                const model = genAI.getGenerativeModel({ model: modelName });
                const result = await model.generateContent("Hello, are you there?");
                const response = result.response;
                const text = response.text();
                log += `✅ ${modelName}: Works! (Response: "${text.substring(0, 20)}...")\n`;
            } catch (error) {
                log += `❌ ${modelName}: Failed (${error.message.split(' ')[0]}...)\n`;
            }
        }

    } catch (error) {
        log += `\n❌ Critical Error: ${error.message}\n`;
    }

    fs.writeFileSync('test-gemini-result.txt', log, { encoding: 'utf8' });
    console.log("Test complete. Results written to test-gemini-result.txt");
}

testGeminiModels();
