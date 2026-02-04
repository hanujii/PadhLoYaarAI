'use server';

import { aiEngine } from '@/lib/ai/engine';
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
        const prompt = `Create a ${difficulty} difficulty exam about "${topic}". 
            Generate exactly 5 multiple choice questions.
            Each question must have 4 options.
            Include an examTitle and questions array with id, question, options, and correctOptionIndex.`;

        const { object } = await aiEngine.generateObject(
            prompt,
            ExamSchema,
            { temperature: 0.7 }
        );

        return { success: true, data: object };
    } catch (error) {
        console.error('Exam Simulator Error:', error);
        return { success: false, error: 'Failed to generate exam.' };
    }
}
