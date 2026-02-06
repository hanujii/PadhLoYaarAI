import { streamText } from 'ai';
import { aiEngine } from '@/lib/ai/engine';
import { generateRequestSchema, type ContentPart } from '@/lib/validations/api-schemas';
import { validatePrompt, validateImageDataUrl } from '@/lib/security/sanitize';
import { checkRateLimit, getClientIdentifier, RATE_LIMITS } from '@/lib/security/rate-limit';
import { z } from 'zod';
import { checkRateLimit, getClientIdentifier, RATE_LIMITS } from '@/lib/security/rate-limit';
import { validatePrompt, validateImageDataUrl } from '@/lib/security/sanitize';

export const maxDuration = 60;
export const maxBodySize = 10 * 1024 * 1024; // 10MB

// Standardized error response
interface ErrorResponse {
    error: string;
    code?: string;
}

function createErrorResponse(message: string, status: number, code?: string): Response {
    const response: ErrorResponse = { error: message };
    if (code) response.code = code;
    
    return new Response(JSON.stringify(response), {
        status,
        headers: { 'Content-Type': 'application/json' }
    });
}

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
        // Rate limiting
        const clientId = getClientIdentifier(req);
        const rateLimitResult = checkRateLimit(clientId, RATE_LIMITS.aiGeneration);
        
        if (!rateLimitResult.allowed) {
            return createErrorResponse(
                'Rate limit exceeded. Please try again later.',
                429,
                'RATE_LIMIT_EXCEEDED'
            );
        }

        // Check request size
        const contentLength = req.headers.get('content-length');
        if (contentLength && parseInt(contentLength) > maxBodySize) {
            return createErrorResponse(
                'Request body too large. Maximum size is 10MB.',
                413,
                'PAYLOAD_TOO_LARGE'
            );
        }

        // Parse and validate request body
        const body = await req.json();
        const validationResult = generateRequestSchema.safeParse(body);

        if (!validationResult.success) {
            return createErrorResponse(
                `Invalid request: ${validationResult.error.errors.map(e => e.message).join(', ')}`,
                400,
                'VALIDATION_ERROR'
            );
        }

        const { 
            tool,
            prompt,
            mode,
            instructions,
            image,
            model,
            context
        } = validationResult.data;

        // Validate and sanitize user inputs
        const sanitizedPrompt = validatePrompt(prompt);
        const sanitizedInstructions = instructions ? validatePrompt(instructions, 2000) : undefined;
        const sanitizedContext = context ? validatePrompt(context, 5000) : undefined;

        // Validate image if provided
        if (image && !validateImageDataUrl(image)) {
            return createErrorResponse(
                'Invalid image format. Please provide a valid base64-encoded image (JPEG, PNG, GIF, or WebP).',
                400,
                'INVALID_IMAGE'
            );
        }

        // Build system prompt
        let systemPrompt = TOOL_PROMPTS[tool] || TOOL_PROMPTS.default;
        
        if (mode && MODE_MODIFIERS[mode]) {
            systemPrompt += `\n\n${MODE_MODIFIERS[mode]}`;
        }

        if (sanitizedInstructions) {
            systemPrompt += `\n\nAdditional instructions: ${sanitizedInstructions}`;
        }

        // Build user content with proper typing and sanitized inputs
        const userContent: ContentPart[] = [];

        if (sanitizedContext) {
            userContent.push({ type: 'text', text: `Context:\n${sanitizedContext}\n\n---\n\n` });
        }

        userContent.push({ type: 'text', text: sanitizedPrompt });

        if (image) {
            userContent.push({ type: 'image', image: image });
            systemPrompt += '\n\nAnalyze the attached image as part of your response.';
        }

        // Get model
        let effectiveModel = model;
        if (!effectiveModel || effectiveModel === 'auto') {
            effectiveModel = aiEngine.getSmartDefaultModel();
        }

        if (process.env.NODE_ENV === 'development') {
            console.log(`[GenerateAPI] Tool: ${tool}, Model: ${effectiveModel}`);
        }

        const aiModel = aiEngine.getModelInstance(effectiveModel);

        const result = streamText({
            model: aiModel,
            messages: [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: userContent }
            ],
            onError: (err) => {
                if (process.env.NODE_ENV === 'development') {
                    console.error("[GenerateAPI] Stream Error:", err);
                }
            }
        });

        return result.toTextStreamResponse();

    } catch (error) {
        // Handle validation errors
        if (error instanceof z.ZodError) {
            return createErrorResponse(
                `Invalid request: ${error.errors.map(e => e.message).join(', ')}`,
                400,
                'VALIDATION_ERROR'
            );
        }

        // Handle other errors
        const errorMessage = error instanceof Error ? error.message : 'Internal Server Error';
        let status = 500;
        let code = 'INTERNAL_ERROR';

        if (errorMessage.includes('quota') || errorMessage.includes('429')) {
            status = 429;
            code = 'QUOTA_EXCEEDED';
        } else if (errorMessage.includes('No AI configured') || errorMessage.includes('not configured')) {
            status = 503;
            code = 'SERVICE_UNAVAILABLE';
        }

        if (process.env.NODE_ENV === 'development') {
            console.error("[GenerateAPI] Error:", error);
        }

        return createErrorResponse(
            status === 429 
                ? "AI quota exceeded. Please try a different model or wait a moment."
                : status === 503
                ? "No AI provider configured. Please add an API key to your .env.local file."
                : "An error occurred while processing your request. Please try again.",
            status,
            code
        );
    }
}
