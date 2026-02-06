'use server';

import { aiEngine } from '@/lib/ai/engine';
import { ImagePart } from '@/lib/ai/types';
import { validatePrompt } from '@/lib/security/sanitize';

export async function solveQuestion(formData: FormData) {
    const customQuestion = formData.get('question') as string | null;
    const imageFile = formData.get('image') as File | null;
    const model = (formData.get('model') as string) || 'auto';

    // Validate input
    if (!customQuestion?.trim() && !imageFile) {
        return { success: false, error: 'Please provide a question (text) or an image.' };
    }

    // Validate file size if image provided
    if (imageFile && imageFile.size > 10 * 1024 * 1024) {
        return { success: false, error: 'Image size exceeds 10MB limit.' };
    }

    try {
        let responseText = '';

        if (imageFile && imageFile.size > 0) {
            // Handle Image + Text (Vision/Multimodal)
            const bytes = await imageFile.arrayBuffer();
            const base64Data = Buffer.from(bytes).toString('base64');

            // Validate image format
            const validMimeTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
            if (!validMimeTypes.includes(imageFile.type)) {
                return { success: false, error: 'Invalid image format. Please use JPEG, PNG, GIF, or WebP.' };
            }

            const imagePart: ImagePart = {
                inlineData: {
                    data: base64Data,
                    mimeType: imageFile.type,
                },
            };

            let prompt = `You are an expert academic solver. Analyze the image and any text provided.
1. Identify the question/problem.
2. Provide a step-by-step solution.
3. State the final answer clearly.

Format with Markdown.`;

            if (customQuestion?.trim()) {
                const sanitizedQuestion = validatePrompt(customQuestion, 2000);
                prompt += `\n\nAdditional Question/Context: ${sanitizedQuestion}`;
            }

            const result = await aiEngine.generateText(prompt, {
                images: [imagePart],
                preferredProvider: 'google', // Vision preferred
                forceModel: model !== 'auto' ? model : undefined,
                temperature: 0.7,
            });
            responseText = result.text;
        } else if (customQuestion?.trim()) {
            // Text only
            const sanitizedQuestion = validatePrompt(customQuestion);
            const prompt = `You are an expert academic solver. Solve the following question step-by-step:

Question: "${sanitizedQuestion}"

Format with Markdown.`;

            const result = await aiEngine.generateText(prompt, {
                temperature: 0.7,
                forceModel: model !== 'auto' ? model : undefined,
            });
            responseText = result.text;
        }

        return { success: true, data: responseText };

    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to solve question.';
        if (process.env.NODE_ENV === 'development') {
            console.error("Solver Error:", error);
        }
        return { success: false, error: errorMessage };
    }
}
