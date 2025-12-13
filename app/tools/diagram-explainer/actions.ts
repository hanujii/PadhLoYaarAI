'use server';

import { generateVision } from '@/lib/gemini';

export async function explainDiagram(formData: FormData) {
    const imageFile = formData.get('image') as File;
    const question = formData.get('question') as string;

    if (!imageFile) return { error: 'Image is required.' };

    try {
        const bytes = await imageFile.arrayBuffer();
        const base64Data = Buffer.from(bytes).toString('base64');
        const imagePart = {
            inlineData: {
                data: base64Data,
                mimeType: imageFile.type,
            },
        };

        let prompt = `Analyze this diagram/image in detail. Explain the components, relationships, and any processes shown.`;
        if (question) prompt += `\n\nSpecific Question: ${question}`;

        prompt += `\n\nProvide the explanation in Markdown.`;

        const text = await generateVision('pro', prompt, [imagePart]);
        return { success: true, data: text };

    } catch (error) {
        return { success: false, error: 'Failed to analyze diagram.' };
    }
}
