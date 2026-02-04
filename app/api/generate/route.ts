import { streamText } from 'ai';
import { aiEngine } from '@/lib/ai/engine';

export const maxDuration = 60;

// System prompts for different tools
const TOOL_PROMPTS: Record<string, string> = {
    tutor: `You are an expert AI Tutor. Provide clear, educational explanations with examples. Use markdown formatting for better readability. Include headers, bullet points, and code blocks where appropriate.`,
    
    'question-solver': `You are an expert problem solver. Break down the problem step by step, show your work, and provide the final answer clearly. Use LaTeX for math equations when needed.`,
    
    'cheat-sheet': `You are a study aid expert. Create concise, well-organized cheat sheets with key formulas, definitions, and concepts. Use tables and bullet points for easy scanning.`,
    
    'code-transformer': `You are a senior software engineer. Transform, optimize, or convert code as requested. Always explain what changes you made and why.`,
    
    'diagram-explainer': `You are a visual learning expert. Analyze diagrams and images, explaining each component clearly. Describe relationships, flows, and key concepts shown.`,
    
    'roadmap': `You are a learning path architect. Create detailed, actionable study roadmaps with daily/weekly plans, resources, and milestones.`,
    
    'analogy': `You are a creative educator who excels at making complex topics simple. Explain concepts using relatable analogies and examples from everyday life.`,
    
    'meme': `You are a creative content creator. Generate educational meme ideas that make learning fun and memorable. Describe the meme format and text.`,
    
    'roast-my-code': `You are a brutally honest but helpful senior developer. Roast the code sarcastically while providing genuine improvements. Be funny but educational.`,
    
    'youtube-notes': `You are a note-taking expert. Summarize video content into structured, scannable notes with key points, timestamps, and takeaways.`,
    
    'reverse-exam': `You are a tricky examiner. Present information with intentional mistakes for the student to find. Reveal the correct answers after they identify errors.`,
    
    default: `You are a helpful AI assistant for students. Provide clear, accurate, and educational responses. Use markdown formatting.`
};

// Mode modifiers
const MODE_MODIFIERS: Record<string, string> = {
    concise: 'Be concise and to the point. Focus on essential information only.',
    detailed: 'Provide comprehensive, in-depth explanations with multiple examples.',
    eli5: 'Explain like I\'m 5 years old. Use simple language and fun analogies.',
    academic: 'Use formal academic language with proper citations and terminology.',
    creative: 'Be creative and engaging. Make learning fun and memorable.',
};

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { 
            tool = 'default',
            prompt,
            mode = 'concise',
            instructions,
            image,
            model,
            context
        } = body;

        if (!prompt) {
            return new Response(JSON.stringify({ error: 'Prompt is required' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        // Build system prompt
        let systemPrompt = TOOL_PROMPTS[tool] || TOOL_PROMPTS.default;
        
        if (mode && MODE_MODIFIERS[mode]) {
            systemPrompt += `\n\n${MODE_MODIFIERS[mode]}`;
        }

        if (instructions) {
            systemPrompt += `\n\nAdditional instructions: ${instructions}`;
        }

        // Build user content
        const userContent: any[] = [{ type: 'text', text: prompt }];

        if (context) {
            userContent.unshift({ type: 'text', text: `Context:\n${context}\n\n---\n\n` });
        }

        if (image) {
            userContent.push({ type: 'image', image: image });
            systemPrompt += '\n\nAnalyze the attached image as part of your response.';
        }

        // Get model
        let effectiveModel = model;
        if (!effectiveModel || effectiveModel === 'auto') {
            effectiveModel = aiEngine.getSmartDefaultModel();
        }

        console.log(`[GenerateAPI] Tool: ${tool}, Model: ${effectiveModel}`);

        const aiModel = aiEngine.getModelInstance(effectiveModel);

        const result = streamText({
            model: aiModel,
            messages: [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: userContent as any }
            ],
            onError: (err) => {
                console.error("[GenerateAPI] Stream Error:", err);
            }
        });

        return result.toTextStreamResponse();

    } catch (error: any) {
        console.error("[GenerateAPI] Error:", error);

        let status = 500;
        let message = error.message || "Internal Server Error";

        if (error.message?.includes("quota") || error.message?.includes("429")) {
            status = 429;
            message = "AI quota exceeded. Please try a different model or wait a moment.";
        }

        if (error.message?.includes("No AI configured") || error.message?.includes("not configured")) {
            status = 503;
            message = "No AI provider configured. Please add an API key to your .env.local file.";
        }

        return new Response(JSON.stringify({ error: message }), {
            status,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}
