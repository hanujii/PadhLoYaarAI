'use server';

import { generateVision, generateText } from '@/lib/gemini';

export async function solveQuestion(formData: FormData) {
    const customQuestion = formData.get('question') as string;
    const imageFile = formData.get('image') as File | null;

    if (!customQuestion && !imageFile) {
        return { error: 'Please provide a question (text) or an image.' };
    }

    try {
        let responseText = '';

        if (imageFile && imageFile.size > 0) {
            // Handle Image + Text
            const bytes = await imageFile.arrayBuffer();
            const base64Data = Buffer.from(bytes).toString('base64');

            const imagePart = {
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

            responseText = await generateVision('flash', prompt, [imagePart]); // Using Flash for speed/cost, Pro if complex
        } else {
            // Text only
            const prompt = `You are an expert academic solver. Solve the following question step-by-step:
      
      Question: "${customQuestion}"
      
      Format with Markdown.`;

            responseText = await generateText('flash', prompt);
        }

        return { success: true, data: responseText };

    } catch (error) {
        console.error("Solver Error:", error);
        return { success: false, error: 'Failed to solve question.' };
    }
}
