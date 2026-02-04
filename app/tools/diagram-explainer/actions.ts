'use server';

import { aiEngine } from '@/lib/ai/engine';
import { ImagePart } from '@/lib/ai/types';

export async function explainDiagram(formData: FormData) {
    const imageFile = formData.get('image') as File;
    const question = formData.get('question') as string;

    if (!imageFile) return { error: 'Image is required.' };

    try {
        const bytes = await imageFile.arrayBuffer();
        const base64Data = Buffer.from(bytes).toString('base64');
        const imagePart: ImagePart = {
            inlineData: {
                data: base64Data,
                mimeType: imageFile.type,
            },
        };

        let prompt = `Analyze this diagram/image in detail. Explain the components, relationships, and any processes shown.`;
        if (question) prompt += `\n\nSpecific Question: ${question}`;

        prompt += `\n\nProvide the explanation in Markdown.`;

        const { text } = await aiEngine.generateText(prompt, {
            images: [imagePart],
            preferredProvider: 'google', // Best vision support
            temperature: 0.7,
        });
        
        return { success: true, data: text };

    } catch (error) {
        console.error("Diagram Action Error:", error);
        const errorMessage = error instanceof Error ? error.message : String(error);
        return { success: false, error: errorMessage };
    }
}
