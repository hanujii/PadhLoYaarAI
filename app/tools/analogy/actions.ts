'use server';

import { aiEngine } from '@/lib/ai/engine';

export async function generateAnalogy(formData: FormData) {
    const concept = formData.get('concept') as string;
    const interest = formData.get('interest') as string;

    if (!concept || !interest) {
        return { success: false, error: 'Concept and Interest are required' };
    }

    try {
        const prompt = `
        You are an expert at explaining complex topics using simple analogies.
        
        Concept to Explain: "${concept}"
        User's Interest / Context: "${interest}"
        
        Task: Explain the concept entirely using the vocabulary, scenarios, and logic of the user's interest. 
        For example, if the interest is "Cricket", explain "Voltage" as the bowler's speed.
        
        Format the output in Markdown:
        ## The Analogy: ${interest}
        [The creative explanation]
        
        ## Key Mapping
        - **[Concept Term]** = **[Analogy Term]**
        - ...

        ## Simplified Definition
        [A one-sentence plain English definition]
        `;

        const { text } = await aiEngine.generateText(prompt, { temperature: 0.8 });

        return { success: true, data: text };
    } catch (error) {
        console.error('Analogy Gen Error:', error);
        return { success: false, error: 'Failed to generate analogy.' };
    }
}
