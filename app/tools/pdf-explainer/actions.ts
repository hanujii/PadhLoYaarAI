'use server';

import { aiEngine } from '@/lib/ai/engine';

export async function chatWithPDF(message: string, pdfText: string, history: any[]) {
    if (!pdfText) return { error: 'No PDF content found.' };

    // Prepare context - truncate if too large
    const context = `You are a helpful assistant analyzing a PDF document.
  
  DOCUMENT CONTENT START:
  ${pdfText.slice(0, 500000)} ... [truncated if too long]
  DOCUMENT CONTENT END.
  
  Current Conversation:
  ${history.map((h: any) => `${h.role}: ${h.content}`).join('\n')}
  
  User: ${message}
  Assistant:`;

    try {
        const { text } = await aiEngine.generateText(context, { temperature: 0.7 });
        return { success: true, data: text };
    } catch (error) {
        console.error("PDF Chat Error:", error);
        return { success: false, error: 'Failed to get response.' };
    }
}

export async function summarizePDF(pdfText: string) {
    const prompt = `Summarize the following document concisely, highlighting key points and concepts.
    
    ${pdfText.slice(0, 500000)}`;

    try {
        const { text } = await aiEngine.generateText(prompt, { temperature: 0.7 });
        return { success: true, data: text };
    } catch (error) {
        console.error("PDF Summarize Error:", error);
        return { success: false, error: 'Failed to summarize.' };
    }
}
