'use server';

import { generateText } from '@/lib/gemini';

export async function generateExam(formData: FormData) {
    const topic = formData.get('topic') as string;
    const difficulty = formData.get('difficulty') as string;
    const questionCount = formData.get('questionCount') as string;
    const type = formData.get('type') as string; // mcq or written

    if (!topic) return { error: 'Topic is required' };

    let prompt = `You are an expert Exam Generator. Create an exam on the topic: "${topic}".
  
  Configuration:
  - Difficulty: ${difficulty}
  - Number of Questions: ${questionCount}
  - Format: ${type === 'mcq' ? 'Multiple Choice Questions (with A,B,C,D options)' : 'Written / Short Answer'}
  
  Output Format:
  1. The Exam (Questions).
  2. The Solutions (Key) at the very end, separated by a horizontal rule or clear header.
  
  Use Markdown.`;

    try {
        const text = await generateText('flash', prompt);
        return { success: true, data: text };
    } catch (error) {
        console.error("Exam Gen Error:", error);
        return { success: false, error: 'Failed to generate exam.' };
    }
}
