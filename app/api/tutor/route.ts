import { streamText } from 'ai';
import { aiEngine } from '@/lib/ai/engine';

export const maxDuration = 30;

export async function POST(req: Request) {
    // Note: apiKey is managed by aiEngine internally now
    const { prompt, topic, mode, instructions, image, model } = await req.json();

    const activeTopic = topic || prompt;

    let systemPrompt = `You are an expert AI Tutor.`;
    if (mode === 'detailed') systemPrompt += ` Provide detailed, deep-dive explanations.`;
    else if (mode === 'eli5') systemPrompt += ` Explain like I'm 5.`;
    else systemPrompt += ` Provide clear, concise explanations.`;

    const userContent: any[] = [{ type: 'text', text: `Topic/Question: "${activeTopic}"` }];
    if (instructions) userContent.push({ type: 'text', text: `\nInstructions: ${instructions}` });

    if (image) {
        userContent.push({ type: 'image', image: image });
        systemPrompt += `\n\nAnalyze the attached image.`;
    }

    try {
        let effectiveModel = model;
        if (!effectiveModel || effectiveModel === 'auto') {
            effectiveModel = aiEngine.getSmartDefaultModel();
        }
        console.log(`[TutorAPI] Using model: ${effectiveModel}`);

        const aiModel = aiEngine.getModelInstance(effectiveModel);

        const result = streamText({
            model: aiModel,
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

        let status = 500;
        let message = error.message || "Internal Server Error";

        if (error.message?.includes("quota") || error.message?.includes("429")) {
            status = 429;
            message = "AI Quota Exceeded. Please check your plan or try a different provider/model.";
        }

        return new Response(JSON.stringify({ error: message }), {
            status: status,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}
