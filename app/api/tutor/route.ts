import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { streamText } from 'ai';

export const maxDuration = 30;

export async function POST(req: Request) {
    const { prompt, inputs } = await req.json();
    // inputs contains { topic, mode, instructions, image }

    // Construct Prompt (Similar logic to before)
    const { topic, mode, instructions, image } = inputs || {}; // useCompletion sends 'prompt' as huge string if not careful, better to pass body

    // Actually useCompletion sends { prompt: ... }. 
    // I can pass additional data in body.

    // Let's rely on the body being passed.

    let systemPrompt = `You are an expert AI Tutor.`;
    if (mode === 'detailed') systemPrompt += ` Provide detailed, deep-dive explanations.`;
    else if (mode === 'eli5') systemPrompt += ` Explain like I'm 5.`;
    else systemPrompt += ` Provide clear, concise explanations.`;

    const userContent: any[] = [{ type: 'text', text: `Topic/Question: "${topic}"` }];
    if (instructions) userContent.push({ type: 'text', text: `\nInstructions: ${instructions}` });

    if (image) {
        // Image is base64 string
        userContent.push({ type: 'image', image: image });
        systemPrompt += `\n\nAnalyze the attached image.`;
    }

    const result = streamText({
        model: createGoogleGenerativeAI({
            apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY
        })('gemini-1.5-flash'),
        messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userContent as any }
        ],
    });

    return result.toTextStreamResponse();
}
