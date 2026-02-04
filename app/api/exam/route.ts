import { aiEngine } from '@/lib/ai/engine';
import { z } from 'zod';

export const maxDuration = 45;

const MCQSchema = z.object({
    questions: z.array(z.object({
        id: z.number(),
        question: z.string(),
        options: z.array(z.string()).min(4).max(4),
        correctIndex: z.number().min(0).max(3),
        explanation: z.string(),
    })),
});

const WrittenSchema = z.object({
    questions: z.array(z.object({
        id: z.number(),
        question: z.string(),
        expectedAnswer: z.string(),
        keyPoints: z.array(z.string()),
        marks: z.number(),
    })),
});

export async function POST(req: Request) {
    try {
        const {
            topic,
            type = 'mcq',
            count = 10,
            difficulty = 'medium',
            model
        } = await req.json();

        if (!topic) {
            return new Response(JSON.stringify({ error: 'Topic is required' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        if (type === 'mcq') {
            const prompt = `Create an exam with ${count} multiple choice questions about "${topic}".

Difficulty: ${difficulty}

Requirements:
- Each question should have exactly 4 options (A, B, C, D)
- Include one correct answer and three plausible distractors
- Questions should test understanding, not just recall
- Provide a brief explanation for why the correct answer is right
- Vary question styles (definitions, applications, comparisons)`;

            const { object } = await aiEngine.generateObject(prompt, MCQSchema, {
                maxTokens: 8192,
                temperature: 0.7,
            });

            return new Response(JSON.stringify({ type: 'mcq', ...object }), {
                status: 200,
                headers: { 'Content-Type': 'application/json' }
            });

        } else {
            const prompt = `Create a written exam with ${count} short/long answer questions about "${topic}".

Difficulty: ${difficulty}

Requirements:
- Mix of short answer (2-5 marks) and long answer (5-10 marks) questions
- Provide expected answer and key points to look for
- Questions should test deep understanding
- Include application and analysis questions`;

            const { object } = await aiEngine.generateObject(prompt, WrittenSchema, {
                maxTokens: 8192,
                temperature: 0.7,
            });

            return new Response(JSON.stringify({ type: 'written', ...object }), {
                status: 200,
                headers: { 'Content-Type': 'application/json' }
            });
        }

    } catch (error: any) {
        console.error("[ExamAPI] Error:", error);

        let status = 500;
        let message = error.message || "Failed to generate exam";

        if (error.message?.includes("No AI configured")) {
            status = 503;
            message = "No AI provider configured. Please add an API key.";
        }

        return new Response(JSON.stringify({ error: message }), {
            status,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}
