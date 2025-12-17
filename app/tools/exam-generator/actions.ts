'use server';

import { generateText } from '@/lib/gemini';
import { parseAIJSON } from '@/lib/utils';

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
    
    Return STRICTLY a JSON array of objects with this schema:
    [
      {
          "question": "The question text",
          "options": ["Option A", "Option B", "Option C", "Option D"], // Only if MCQ, else empty array
          "answer": "The correct answer (text) or model answer",
          "type": "${type}",
          "clarification": "Brief explanation of the answer"
      }
    ]
    `;

    try {
        const text = await generateText('flash', prompt);
        const data = parseAIJSON(text);
        return { success: true, data: data };
    } catch (error) {
        console.error("Exam Gen Error:", error);
        return { success: false, error: 'Failed to generate exam.' };
    }
}
