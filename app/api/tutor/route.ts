import { streamText } from 'ai';
import { aiEngine } from '@/lib/ai/engine';
import { tutorRequestSchema, type ContentPart } from '@/lib/validations/api-schemas';
import { z } from 'zod';
import { checkRateLimit, getClientIdentifier, RATE_LIMITS } from '@/lib/security/rate-limit';
import { validatePrompt, validateImageDataUrl } from '@/lib/security/sanitize';

export const maxDuration = 30;
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
        const validationResult = tutorRequestSchema.safeParse(body);

        if (!validationResult.success) {
            return createErrorResponse(
                `Invalid request: ${validationResult.error.errors.map(e => e.message).join(', ')}`,
                400,
                'VALIDATION_ERROR'
            );
        }

        const { prompt, topic, mode, instructions, image, model } = validationResult.data;
        
        // Sanitize inputs
        const sanitizedPrompt = validatePrompt(prompt);
        const sanitizedTopic = topic ? validatePrompt(topic, 500) : sanitizedPrompt;
        const sanitizedInstructions = instructions ? validatePrompt(instructions, 2000) : undefined;
        
        // Validate image if provided
        if (image && !validateImageDataUrl(image)) {
            return createErrorResponse(
                'Invalid image format. Please provide a valid base64-encoded image (JPEG, PNG, GIF, or WebP).',
                400,
                'INVALID_IMAGE'
            );
        }
        
        const activeTopic = sanitizedTopic;

        // Build system prompt
        let systemPrompt = `You are an expert AI Tutor.`;
        if (mode === 'detailed') {
            systemPrompt += ` Provide detailed, deep-dive explanations.`;
        } else if (mode === 'eli5') {
            systemPrompt += ` Explain like I'm 5.`;
        } else {
            systemPrompt += ` Provide clear, concise explanations.`;
        }

        // Build user content with proper typing
        const userContent: ContentPart[] = [{ type: 'text', text: `Topic/Question: "${activeTopic}"` }];
        
        if (sanitizedInstructions) {
            userContent.push({ type: 'text', text: `\nInstructions: ${sanitizedInstructions}` });
        }

        if (image) {
            userContent.push({ type: 'image', image: image });
            systemPrompt += `\n\nAnalyze the attached image.`;
        }

        // Get model instance
        let effectiveModel = model;
        if (!effectiveModel || effectiveModel === 'auto') {
            effectiveModel = aiEngine.getSmartDefaultModel();
        }

        if (process.env.NODE_ENV === 'development') {
            console.log(`[TutorAPI] Using model: ${effectiveModel}`);
        }

        const aiModel = aiEngine.getModelInstance(effectiveModel);

        // Stream response
        const result = streamText({
            model: aiModel,
            messages: [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: userContent }
            ],
            onError: (err) => {
                if (process.env.NODE_ENV === 'development') {
                    console.error("[TutorAPI] StreamText Error:", err);
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
            console.error("[TutorAPI] Error:", error);
        }

        return createErrorResponse(
            status === 429 
                ? "AI Quota Exceeded. Please check your plan or try a different provider/model."
                : status === 503
                ? "No AI provider configured. Please add an API key to your .env.local file."
                : "An error occurred while processing your request. Please try again.",
            status,
            code
        );
    }
}
