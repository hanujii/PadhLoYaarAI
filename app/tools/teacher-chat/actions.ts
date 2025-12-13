'use server';

import { generateText } from '@/lib/gemini';

export async function chatTeacher(message: string, history: any[]) {
    const context = `You are a strict but helpful teacher conducting an oral exam or tutoring session.
  Your goal is to check the student's understanding by asking follow-up questions.
  Keep your responses concise (suitable for speech synthesis) but insightful.
  
  Current Conversation:
  ${history.map((h: any) => `${h.role}: ${h.content}`).join('\n')}
  
  Student: ${message}
  Teacher:`;

    try {
        const text = await generateText('flash', context);
        return { success: true, data: text };
    } catch (error) {
        return { success: false, error: 'Teacher is silent.' };
    }
}
