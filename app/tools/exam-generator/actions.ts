'use server';

import { aiEngine } from '@/lib/ai/engine';
import { z } from 'zod';

const ExamQuestionSchema = z.object({
    question: z.string(),
    options: z.array(z.string()).describe("Options for MCQ, empty array for written"),
    answer: z.string().describe("The correct answer text or model answer"),
    type: z.string(),
    clarification: z.string().describe("Brief explanation of the answer"),
});

export async function generateExam(formData: FormData) {
    const topic = formData.get('topic') as string;
    const difficulty = formData.get('difficulty') as string;
    const questionCount = formData.get('questionCount') as string;
    const type = formData.get('type') as string; // mcq or written

    if (!topic) return { error: 'Topic is required' };

    const prompt = `You are an expert Exam Generator. Create an exam on the topic: "${topic}".
  
    Configuration:
    - Difficulty: ${difficulty}
    - Number of Questions: ${questionCount}
    - Type: ${type}
    
    Generate ${questionCount} exam questions. For MCQ type, include 4 options. For written type, provide model answers.`;

    try {
        const { object } = await aiEngine.generateObject(
            prompt,
            z.array(ExamQuestionSchema),
            { temperature: 0.7 }
        );
        return { success: true, data: object };
    } catch (error) {
        console.error("Exam Gen Error:", error);
        return { success: false, error: 'Failed to generate exam.' };
    }
}
