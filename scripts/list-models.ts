
import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';
dotenv.config();

async function listModels() {
    try {
        const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY;
        if (!apiKey) throw new Error("No API Key found");

        const genAI = new GoogleGenerativeAI(apiKey);
        const modelCallback = await genAI.getGenerativeModel({ model: "gemini-pro" }); // Dummy init to get client if needed, or just use core lib

        // Actually, listing models might require using the raw API or specific method if SDK exposes it.
        // GoogleGenerativeAI class doesn't have listModels on instance usually.
        // It's often a separate fetch to https://generativelanguage.googleapis.com/v1beta/models?key=...

        console.log("Fetching models via REST API...");
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);
        const data = await response.json();

        if (data.models) {
            console.log("Available Models:");
            data.models.forEach((m: any) => console.log(`- ${m.name}`));
        } else {
            console.log("Error listing models:", data);
        }

    } catch (error: any) {
        console.error("\nFailure!", error);
    }
}

listModels();
