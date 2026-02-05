'use server';

import { aiEngine } from '@/lib/ai/engine';
import { z } from 'zod';

const RoadmapDaySchema = z.object({
    day: z.number(),
    title: z.string().describe("Topic of the day"),
    tasks: z.array(z.string()).describe("List of 3-4 specific actionable sub-tasks"),
    resources: z.array(z.string()).describe("List of 2-3 specific topics to search on YouTube/Google"),
    tip: z.string().describe("A short motivational or efficiency tip for this specific day"),
});

import { checkRateLimit } from '@/lib/rate-limit';

export async function generateRoadmap(formData: FormData) {
    try {
        await checkRateLimit('roadmap');
    } catch (error: any) {
        return { success: false, error: error.message };
    }

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
        
        Generate a detailed roadmap with actionable tasks, resources, and tips for each day.
        `;

        const { object } = await aiEngine.generateObject(
            prompt,
            z.array(RoadmapDaySchema),
            { temperature: 0.7 }
        );

        return { success: true, data: object };
    } catch (error) {
        console.error('Roadmap generation error:', error);
        return { success: false, error: 'Failed to generate roadmap. Please try again.' };
    }
}
