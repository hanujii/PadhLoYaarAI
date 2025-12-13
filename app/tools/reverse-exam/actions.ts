'use server';

import { generateText } from '@/lib/gemini';
import { parseAIJSON } from '@/lib/utils';

export async function generateMistake(formData: FormData) {
    const topic = formData.get('topic') as string;

    if (!topic) {
        return { success: false, error: 'Topic is required' };
    }

    try {
        const prompt = `
        You are a simulator of a confused student.
        Topic: "${topic}"
        
        Generate a JSON object with:
        - "question": A fundamental question about the topic.
        - "wrong_answer": A plausible but factually INCORRECT answer that a beginner might give. It must have a clear error.
        - "lie_explanation": A short sentence explaining why you (the confused student) think this wrong answer is right.
        
        Return STRICTLY a valid JSON object. Do not add any markdown.
        Format:
        {
            "question": "string",
            "wrong_answer": "string",
            "lie_explanation": "string"
        }
        `;

        const text = await generateText('pro', prompt);
        const data = parseAIJSON(text);

        return { success: true, data };
    } catch (error) {
        console.error('Reverse Exam Gen error:', error);
        return { success: false, error: 'Failed to generate mistake.' };
    }
}

export async function gradeCorrection(originalMistake: string, userCorrection: string, originalQuestion: string) {
    try {
        const prompt = `
        You are the Teacher grading a student who is correcting a peer's mistake.
        
        Question: "${originalQuestion}"
        Confused Peer's Wrong Answer: "${originalMistake}"
        User's Correction: "${userCorrection}"
        
        Grade the User's correction.
        Return JSON:
        - "score": number (0-10)
        - "feedback": string (Did they catch the specific error? Is their explanation accurate?)
        - "correct_answer": string (The absolute truth)
        
        Return STRICTLY JSON.
        `;

        const text = await generateText('pro', prompt);
        const data = parseAIJSON(text);

        return { success: true, data };
    } catch (error) {
        console.error('Reverse Exam Grade error:', error);
        return { success: false, error: 'Failed to grade.' };
    }
}
