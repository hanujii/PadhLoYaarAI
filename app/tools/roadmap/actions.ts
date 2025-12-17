'use server';

import { generateText } from '@/lib/gemini';
import { parseAIJSON } from '@/lib/utils';

export async function generateRoadmap(formData: FormData) {
    const goal = formData.get('goal') as string;
    const days = formData.get('days') as string;
    const hours = formData.get('hours') as string;

    if (!goal || !days) {
        return { success: false, error: 'Goal and Duration are required' };
    }

    try {
        const prompt = `
        You are an expert study planner. Create a day-by-day study roadmap for the following goal: "${goal}".
        Duration: ${days} days.
        Study time: ${hours || '2'} hours per day.
        
        Return STRICTLY a JSON array of objects. Each object must have:
        - "day": number
        - "title": string (Topic of the day)
        - "tasks": string[] (List of 3-4 specific actionable sub-tasks)
        - "resources": string[] (List of 2-3 specific topics to search on YouTube/Google, e.g. "YouTube: React Hooks Introduction")
        - "tip": string (A short motivational or efficiency tip for this specific day)
        
        Do not include any markdown formatting (like \`\`\`json) or extra text. Just the raw JSON array.
        `;

        const text = await generateText('flash', prompt); // Switch to 'flash' for speed/reliability

        const roadmap = parseAIJSON(text);

        return { success: true, data: roadmap };
    } catch (error) {
        console.error('Roadmap generation error:', error);
        return { success: false, error: 'Failed to generate roadmap. Please try again.' };
    }
}
