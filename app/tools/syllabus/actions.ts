'use server';

import { generateText } from '@/lib/gemini';
import { parseAIJSON } from '@/lib/utils';
// import { getDocument } from 'pdfjs-dist/legacy/build/pdf';

export async function parseSyllabus(formData: FormData) {
    const file = formData.get('file') as File;

    if (!file) {
        return { success: false, error: 'No file uploaded' };
    }

    try {
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        // Dynamic import to avoid build-time issues with canvas dependencies
        const pdfjs = await import('pdfjs-dist/legacy/build/pdf.mjs');

        // Configure worker to null for Node.js environment
        pdfjs.GlobalWorkerOptions.workerSrc = '';

        const namingConflict: any = pdfjs;

        // Load the document
        const loadingTask = namingConflict.getDocument({
            data: new Uint8Array(buffer),
            useSystemFonts: true,
            disableFontFace: true,
        });

        const pdfDocument = await loadingTask.promise;
        const numPages = pdfDocument.numPages;
        let fullText = '';

        // Iterate through all pages and extract text
        for (let i = 1; i <= numPages; i++) {
            const page = await pdfDocument.getPage(i);
            const textContent = await page.getTextContent();
            const pageText = textContent.items
                .filter((item: any) => item.str)
                .map((item: any) => item.str)
                .join(' ');

            fullText += pageText + '\n\n';

            // Safety break for very large PDFs to avoid timeout
            if (fullText.length > 50000) break;
        }

        const text = fullText.slice(0, 30000); // Limit text for AI context

        const prompt = `
        You are a Syllabus Analyzer. I will provide the text of an exam syllabus.
        
        Extract the structured syllabus. Group topics into logical "Units" or "Modules".
        For each Unit, estimate the study hours required.
        
        Return STRICTLY a JSON array of objects with this schema:
        [
            {
                "unit": "Unit Name",
                "hours": "Estimated Hours (e.g., '10h')",
                "topics": ["Topic 1", "Topic 2"]
            }
        ]
        
        SYLLABUS TEXT:
        ${text}
        `;

        const result = await generateText('flash', prompt);
        const topics = parseAIJSON(result);

        return { success: true, data: topics };
    } catch (error) {
        console.error('Syllabus Parse Error:', error);
        return { success: false, error: 'Failed to process syllabus PDF.' };
    }
}
