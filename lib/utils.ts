import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function parseAIJSON(text: string) {
  try {
    // 1. Try direct parse
    return JSON.parse(text);
  } catch (e) {
    // 2. Try stripping markdown code blocks
    const cleanText = text.replace(/```json/g, '').replace(/```/g, '').trim();
    try {
      return JSON.parse(cleanText);
    } catch (e2) {
      // 3. Try finding the first '[' or '{' and last ']' or '}'
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
      throw new Error("Could not parse JSON from AI response: " + text.substring(0, 100) + "...");
    }
  }
}
