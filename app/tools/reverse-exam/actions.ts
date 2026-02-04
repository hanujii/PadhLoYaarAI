'use server';

import { aiEngine } from '@/lib/ai/engine';
import { z } from 'zod';

export async function generateMistake(formData: FormData) {
    const topic = formData.get('topic') as string;
    if (!topic) return { success: false, error: 'Topic is required' };

    try {
        const prompt = `You are a simulator of a confused student. Topic: "${topic}".
        Generate a fundamental question and a plausible but incorrect answer with a "lie" explanation.`;

        const { object } = await aiEngine.generateObject(prompt, z.object({
            question: z.string().describe("A fundamental question about the topic"),
            wrong_answer: z.string().describe("A plausible but factually INCORRECT answer a beginner might give"),
            lie_explanation: z.string().describe("A short sentence explaining why the confused student thinks this wrong answer is right")
        }));

        return { success: true, data: object };
    } catch (error) {
        console.error('Reverse Exam Gen error:', error);
        return { success: false, error: 'Failed to generate mistake.' };
    }
}

export async function gradeCorrection(originalMistake: string, userCorrection: string, originalQuestion: string) {
    try {
        const prompt = `You are the Teacher. 
        Question: "${originalQuestion}"
        Student's Wrong Answer: "${originalMistake}"
        User's Correction: "${userCorrection}"
        
        Grade the correction.`;

        const { object } = await aiEngine.generateObject(prompt, z.object({
            score: z.number().min(0).max(10),
            feedback: z.string().describe("Did they catch the specific error? Is the explanation accurate?"),
            correct_answer: z.string().describe("The absolute truth/correct answer")
        }));

        return { success: true, data: object };
    } catch (error) {
        console.error('Reverse Exam Grade error:', error);
        return { success: false, error: 'Failed to grade.' };
    }
}
