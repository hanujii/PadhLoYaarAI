const OpenAI = require("openai");
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

async function testGroq() {
    const apiKey = process.env.GROQ_API_KEY;

    let log = "--- Groq Connectivity Test Results ---\n";
    log += `Time: ${new Date().toISOString()}\n`;

    if (!apiKey) {
        fs.writeFileSync('test-groq-result.txt', log + "\n❌ No API Key found in env", 'utf8');
        return;
    }

    const client = new OpenAI({
        apiKey: apiKey,
        baseURL: 'https://api.groq.com/openai/v1',
    });

    try {
        log += "Fetching available models...\n";
        const models = await client.models.list();
        log += "Available Models:\n";
        models.data.forEach(m => {
            log += `- ${m.id}\n`;
        });

        // Try the first available model
        if (models.data.length > 0) {
            const firstModel = models.data[0].id;
            log += `\nTesting First Available Model: ${firstModel}...\n`;

            const completion = await client.chat.completions.create({
                messages: [{ role: "user", content: "Hello" }],
                model: firstModel,
            });
            const text = completion.choices[0].message.content;
            log += `✅ Success! Response: "${text}"\n`;
        } else {
            log += "❌ No models returned by API.\n";
        }

    } catch (error) {
        log += `\n❌ Error: ${error.message}\n`;
        if (error.status) log += `Status Code: ${error.status}\n`;
    }

    // Write all output to file with explicit UTF-8 encoding
    fs.writeFileSync('test-groq-result.txt', log, { encoding: 'utf8' });
    console.log("Test complete. Results written to test-groq-result.txt");
}

testGroq();
