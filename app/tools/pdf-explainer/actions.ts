'use server';

import { aiEngine } from '@/lib/ai/engine';

interface ChatMessage {
    role: 'user' | 'assistant';
    content: string;
}

export async function chatWithPDF(message: string, pdfText: string, history: ChatMessage[]) {
    if (!pdfText || !pdfText.trim()) {
        return { success: false, error: 'No PDF content found.' };
    }

    // Validate and sanitize message
    if (!message || !message.trim()) {
        return { success: false, error: 'Message cannot be empty.' };
    }

    // Prepare context - truncate if too large
    const context = `You are a helpful assistant analyzing a PDF document.
  
  DOCUMENT CONTENT START:
  ${pdfText.slice(0, 500000)} ... [truncated if too long]
  DOCUMENT CONTENT END.
  
  Current Conversation:
  ${history.map((h) => `${h.role}: ${h.content}`).join('\n')}
  
  User: ${message.trim()}
  Assistant:`;

    try {
        const { text } = await aiEngine.generateText(context, { temperature: 0.7 });
        return { success: true, data: text };
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to get response.';
        if (process.env.NODE_ENV === 'development') {
            console.error("PDF Chat Error:", error);
        }
        return { success: false, error: errorMessage };
    }
}

export async function summarizePDF(pdfText: string) {
    if (!pdfText || !pdfText.trim()) {
        return { success: false, error: 'PDF text is empty.' };
    }

    const prompt = `Summarize the following document concisely, highlighting key points and concepts.
    
    ${pdfText.slice(0, 500000)}`;

    try {
        const { text } = await aiEngine.generateText(prompt, { temperature: 0.7 });
        return { success: true, data: text };
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to summarize.';
        if (process.env.NODE_ENV === 'development') {
            console.error("PDF Summarize Error:", error);
        }
        return { success: false, error: errorMessage };
    }
}
