'use server';

import { google } from '@ai-sdk/google';
import { generateObject } from 'ai';
import { z } from 'zod';

const ExamSchema = z.object({
    examTitle: z.string(),
    questions: z.array(z.object({
        id: z.number(),
        question: z.string(),
        options: z.array(z.string()),
        correctOptionIndex: z.number(),
    }))
});

export async function generateExam(topic: string, difficulty: string) {
    try {
        const { object } = await generateObject({
            model: google(`gemini-1.5-flash`),
            schema: ExamSchema,
            prompt: `Create a ${difficulty} difficulty exam about "${topic}". 
            Generate exactly 5 multiple choice questions.
            Each question must have 4 options.`,
        });

        return { success: true, data: object };
    } catch (error) {
        return { success: false, error: 'Failed to generate exam.' };
    }
}
