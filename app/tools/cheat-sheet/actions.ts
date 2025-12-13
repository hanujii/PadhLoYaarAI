'use server';

import { generateText } from '@/lib/gemini';

export async function generateCheatSheet(formData: FormData) {
    const topic = formData.get('topic') as string;
    if (!topic) return { error: 'Topic required' };

    const prompt = `Create a comprehensive Cheat Sheet for: "${topic}".
  
  Format requirements:
  - Use Markdown tables for data/formulas.
  - Use bullet points for key concepts.
  - Include a "Quick Summary" section.
  - Keep it compact and dense.
  
  Structure:
  1. Key Definitions (Table)
  2. Formulas / Important Dates / Syntax (Table)
  3. Core Concepts (Bulleted)
  4. Common Pitfalls`;

    try {
        const text = await generateText('flash', prompt);
        return { success: true, data: text };
    } catch (error) {
        return { success: false, error: 'Failed to generate cheat sheet.' };
    }
}
