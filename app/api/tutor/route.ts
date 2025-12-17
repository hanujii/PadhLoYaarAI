import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { streamText } from 'ai';

export const maxDuration = 30;

export async function POST(req: Request) {
    // useCompletion sends { prompt, ...body } at the top level
    const { prompt, topic, mode, instructions, image } = await req.json();

    // Fallback: use 'prompt' as topic if topic is missing (standard useCompletion behavior)
    const activeTopic = topic || prompt;


    // Actually useCompletion sends { prompt: ... }. 
    // I can pass additional data in body.

    // Let's rely on the body being passed.

    let systemPrompt = `You are an expert AI Tutor.`;
    if (mode === 'detailed') systemPrompt += ` Provide detailed, deep-dive explanations.`;
    else if (mode === 'eli5') systemPrompt += ` Explain like I'm 5.`;
    else systemPrompt += ` Provide clear, concise explanations.`;

    const userContent: any[] = [{ type: 'text', text: `Topic/Question: "${activeTopic}"` }];
    if (instructions) userContent.push({ type: 'text', text: `\nInstructions: ${instructions}` });

    if (image) {
        // Image is base64 string
        userContent.push({ type: 'image', image: image });
        systemPrompt += `\n\nAnalyze the attached image.`;
    }

    try {
        const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY;
        if (!apiKey) {
            throw new Error("Missing Google API Key");
        }

        const result = streamText({
            model: createGoogleGenerativeAI({
                apiKey: apiKey
            })('gemini-1.5-flash'),
            messages: [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: userContent as any }
            ],
            onError: (err) => {
                console.error("StreamText Error:", err);
            }
        });

        return result.toTextStreamResponse();
    } catch (error: any) {
        console.error("Tutor API Error:", error);
        return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    }
}
