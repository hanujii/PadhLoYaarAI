'use server';

import { aiEngine } from '@/lib/ai/engine';

export async function conductViva(topic: string, history: { role: string; content: string }[]) {
    // 1. Construct the persona and context
    const systemPrompt = `You are a strict external examiner conducting a Viva Voce (Oral Exam) on the topic: "${topic}".
    
    Your goal is to test the student's depth of knowledge.
    - If the user's answer is shallow, press them for more details.
    - If the answer is wrong, correct them briefly and move to a simpler question.
    - If the answer is correct, acknowledge it briefly and ask a harder follow-up.
    
    Format your response purely as spoken text. Do not use markdown headers or bullet points that can't be spoken naturally.
    Keep your responses under 3 sentences unless explaining a complex correction.
    
    Tone: Professional, academic, slightly intimidating but fair.`;

    // 2. Format history for the AI
    const conversation = history.map(msg => `${msg.role === 'user' ? 'Student' : 'Examiner'}: ${msg.content}`).join('\n');

    const prompt = `${systemPrompt}\n\nConversation so far:\n${conversation}\n\nExaminer (You):`;

    try {
        const { text } = await aiEngine.generateText(prompt, {
            temperature: 0.7,
            maxTokens: 150
        });

        return { success: true, response: text.trim() };
    } catch (error) {
        console.error("Viva Examiner Error:", error);
        return { success: false, error: "The examiner is reviewing your notes... (AI Error)" };
    }
}
