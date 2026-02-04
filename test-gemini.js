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

async function testGemini() {
    const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_GENERATIVE_AI_API_KEY;

    let log = "--- Gemini Connectivity Test Results ---\n";
    log += `Time: ${new Date().toISOString()}\n`;

    if (!apiKey) {
        fs.writeFileSync('test-result.txt', log + "\n❌ No API Key found in env", 'utf8');
        return;
    }

    log += `API Key Format Check: ${apiKey.startsWith('AIza') ? "Valid (AIza...)" : "INVALID (Must start with AIza)"}\n`;

    const genAI = new GoogleGenerativeAI(apiKey);

    // Test multiple models
    const modelsToTry = ["gemini-1.5-flash", "gemini-pro"];

    for (const modelName of modelsToTry) {
        log += `\n--- Testing Model: ${modelName} ---\n`;
        try {
            const model = genAI.getGenerativeModel({ model: modelName });
            const result = await model.generateContent("Hello");
            const response = await result.response;
            const text = response.text();

            log += `✅ Success! Response: "${text}"\n`;

        } catch (error) {
            log += `❌ Error: ${error.message}\n`;
            if (error.response) {
                // safely stringify circular structures or minimal fields
                log += `Status: ${error.status || error.response.status}\n`;
            }
        }
    }

    // Write all output to file with explicit UTF-8 encoding
    fs.writeFileSync('test-result.txt', log, { encoding: 'utf8' });
    console.log("Test complete. Results written to test-result.txt");
}

testGemini();
