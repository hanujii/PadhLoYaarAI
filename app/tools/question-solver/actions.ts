'use server';

import { aiEngine } from '@/lib/ai/engine';
import { ImagePart } from '@/lib/ai/types';

export async function solveQuestion(formData: FormData) {
    const customQuestion = formData.get('question') as string;
    const imageFile = formData.get('image') as File | null;
    const model = formData.get('model') as string || 'auto';

    if (!customQuestion && !imageFile) {
        return { error: 'Please provide a question (text) or an image.' };
    }

    try {
        let responseText = '';

        if (imageFile && imageFile.size > 0) {
            // Handle Image + Text (Vision/Multimodal)
            const bytes = await imageFile.arrayBuffer();
            const base64Data = Buffer.from(bytes).toString('base64');

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

            if (customQuestion) {
                prompt += `\n\nAdditional Question/Context: ${customQuestion}`;
            }

            const result = await aiEngine.generateText(prompt, {
                images: [imagePart],
                preferredProvider: 'google', // Vision preferred
                forceModel: model,
                temperature: 0.7,
            });
            responseText = result.text;
        } else {
            // Text only
            const prompt = `You are an expert academic solver. Solve the following question step-by-step:
      
      Question: "${customQuestion}"
      
      Format with Markdown.`;

            const result = await aiEngine.generateText(prompt, {
                temperature: 0.7,
                forceModel: model
            });
            responseText = result.text;
        }

        return { success: true, data: responseText };

    } catch (error) {
        console.error("Solver Error:", error);
        return { success: false, error: 'Failed to solve question.' };
    }
}
