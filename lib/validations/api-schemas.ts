import { z } from 'zod';

// Common validation schemas for API routes

export const tutorRequestSchema = z.object({
    prompt: z.string().min(1, 'Prompt is required').max(10000, 'Prompt too long'),
    topic: z.string().optional(),
    mode: z.enum(['simple', 'detailed', 'eli5']).optional().default('simple'),
    instructions: z.string().max(2000, 'Instructions too long').optional(),
    image: z.string().regex(/^data:image\/(jpeg|jpg|png|gif|webp);base64,/, 'Invalid image format').optional(),
    model: z.string().optional(),
});

export const generateRequestSchema = z.object({
    tool: z.string().max(100).optional().default('default'),
    prompt: z.string().min(1, 'Prompt is required').max(10000, 'Prompt too long'),
    mode: z.enum(['concise', 'detailed', 'eli5', 'academic', 'creative']).optional().default('concise'),
    instructions: z.string().max(2000, 'Instructions too long').optional(),
    image: z.string().regex(/^data:image\/(jpeg|jpg|png|gif|webp);base64,/, 'Invalid image format').optional(),
    model: z.string().max(200).optional(),
    context: z.string().max(5000, 'Context too long').optional(),
});

// Type exports for use in API routes
export type TutorRequest = z.infer<typeof tutorRequestSchema>;
export type GenerateRequest = z.infer<typeof generateRequestSchema>;

// Vercel AI SDK content types
export type TextContentPart = { type: 'text'; text: string };
export type ImageContentPart = { type: 'image'; image: string };
export type ContentPart = TextContentPart | ImageContentPart;
