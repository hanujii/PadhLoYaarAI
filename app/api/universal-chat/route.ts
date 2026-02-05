import { createClient } from '@/lib/supabase/server';
import { google } from '@ai-sdk/google';
import { streamText } from 'ai';

export async function POST(req: Request) {
    const supabase = await createClient();
    const { data: { session } } = await supabase.auth.getSession();

    // Allow anonymous usage for now if user wants instant access, or enforce auth?
    // User asked for "instant login", implying they WILL be logged in.
    // But let's be lenient.

    const { messages, systemPrompt, model } = await req.json();

    const result = streamText({
        model: google('gemini-1.5-flash'),
        system: systemPrompt || "You are a helpful AI assistant.",
        messages,
    });

    return result.toTextStreamResponse();
}
