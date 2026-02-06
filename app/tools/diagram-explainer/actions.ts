'use server';

import { aiEngine } from '@/lib/ai/engine';
import { ImagePart } from '@/lib/ai/types';
import { validatePrompt } from '@/lib/security/sanitize';

export async function explainDiagram(formData: FormData) {
    const imageFile = formData.get('image') as File | null;
    const question = formData.get('question') as string | null;
    const model = (formData.get('model') as string) || 'auto';

    if (!imageFile) {
        return { success: false, error: 'Image is required.' };
    }

    // Validate file size
    if (imageFile.size > 10 * 1024 * 1024) {
        return { success: false, error: 'Image size exceeds 10MB limit.' };
    }

    // Validate file type
    const validMimeTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!validMimeTypes.includes(imageFile.type)) {
        return { success: false, error: 'Invalid image format. Please use JPEG, PNG, GIF, or WebP.' };
    }

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
        if (question?.trim()) {
            const { validatePrompt } = await import('@/lib/security/sanitize');
            const sanitizedQuestion = validatePrompt(question, 2000);
            prompt += `\n\nSpecific Question: ${sanitizedQuestion}`;
        }

        prompt += `\n\nProvide the explanation in Markdown.`;

        const { text } = await aiEngine.generateText(prompt, {
            images: [imagePart],
            preferredProvider: 'google', // Best vision support
            forceModel: model !== 'auto' ? model : undefined,
            temperature: 0.7,
        });
        
        return { success: true, data: text };

    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to explain diagram.';
        if (process.env.NODE_ENV === 'development') {
            console.error("Diagram Action Error:", error);
        }
        return { success: false, error: errorMessage };
    }
}
