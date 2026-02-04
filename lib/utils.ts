import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Safely parses JSON returned by an AI model.
 * AI models often wrap JSON in Markdown code blocks (```json ... ```) or include extra text.
 * This function attempts multiple strategies to extract valid JSON.
 */
export function parseAIJSON(text: string) {
  try {
    // Strategy 1: The happy path - direct parse
    return JSON.parse(text);
  } catch {
    // Strategy 2: Strip Markdown code blocks
    // AI often returns: ```json { "foo": "bar" } ```
    const cleanText = text.replace(/```json/g, '').replace(/```/g, '').trim();
    try {
      return JSON.parse(cleanText);
    } catch {
      // Strategy 3: Brute force extraction
      // Find the first '{' or '[' and the last '}' or ']' to isolate the JSON object/array
      const firstOpenBrace = cleanText.indexOf('{');
      const firstOpenBracket = cleanText.indexOf('[');

      let start = -1;
      if (firstOpenBrace !== -1 && firstOpenBracket !== -1) {
        start = Math.min(firstOpenBrace, firstOpenBracket);
      } else if (firstOpenBrace !== -1) {
        start = firstOpenBrace;
      } else if (firstOpenBracket !== -1) {
        start = firstOpenBracket;
      }

      if (start !== -1) {
        const end = cleanText.lastIndexOf(cleanText[start] === '[' ? ']' : '}');
        if (end !== -1) {
          const jsonCandidate = cleanText.substring(start, end + 1);
          return JSON.parse(jsonCandidate);
        }
      }

      console.error("Failed to parse JSON:", text);
      throw new Error("Could not parse JSON from AI response: " + text.substring(0, 100) + "...");
    }
  }
}
